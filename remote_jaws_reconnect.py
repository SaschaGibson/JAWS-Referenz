#!/usr/bin/env python3
"""Restart JAWS on RDP reconnect by invoking JAWS' own FSAPI script entrypoints.

Designed to be called by Windows Task Scheduler.
"""

from __future__ import annotations

import argparse
import ctypes
import datetime as dt
import os
import subprocess
import sys
import time
import traceback
from pathlib import Path

SM_REMOTESESSION = 0x1000


class Logger:
    def __init__(self, logfile: Path) -> None:
        self.logfile = logfile
        self.logfile.parent.mkdir(parents=True, exist_ok=True)

    def write(self, message: str) -> None:
        timestamp = dt.datetime.now().isoformat(timespec="seconds")
        line = f"{timestamp} - {message}\n"
        with self.logfile.open("a", encoding="utf-8") as f:
            f.write(line)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Restart JAWS/Fusion via FSAPI RunScript on remote reconnect."
    )
    parser.add_argument("--delay-seconds", type=int, default=7)
    parser.add_argument("--cooldown-seconds", type=int, default=60)
    parser.add_argument(
        "--state-dir",
        default=r"C:\ProgramData\Beta\RemoteJawsRecovery",
        help="Directory for state files and logs.",
    )
    parser.add_argument(
        "--log-file",
        default=None,
        help="Optional absolute logfile path; default is <state-dir>\\restart-log.txt",
    )
    parser.add_argument(
        "--stamp-file",
        default=None,
        help="Optional absolute stamp file path; default is <state-dir>\\last-restart.txt",
    )
    parser.add_argument(
        "--script-name",
        default="RestartWithoutDump",
        help="JAWS script called via FSAPI.RunScript.",
    )
    parser.add_argument(
        "--fallback-function-name",
        default="",
        help="Optional function called via FSAPI.RunFunction if RunScript fails.",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--force-local",
        action="store_true",
        help="Run even if no remote session is detected.",
    )
    return parser.parse_args()


def is_remote_session() -> bool:
    try:
        if bool(ctypes.windll.user32.GetSystemMetrics(SM_REMOTESESSION)):
            return True
    except Exception:
        pass

    session_name = os.environ.get("SESSIONNAME", "").upper()
    return session_name.startswith("RDP-") or session_name.startswith("ICA-")


def read_last_restart(stamp_file: Path) -> dt.datetime | None:
    if not stamp_file.exists():
        return None
    text = stamp_file.read_text(encoding="utf-8", errors="ignore").strip()
    if not text:
        return None
    return dt.datetime.fromisoformat(text)


def should_abort_for_cooldown(stamp_file: Path, cooldown_seconds: int) -> bool:
    try:
        last = read_last_restart(stamp_file)
    except Exception:
        return False
    if last is None:
        return False
    return (dt.datetime.now() - last).total_seconds() < cooldown_seconds


def write_restart_stamp(stamp_file: Path) -> None:
    stamp_file.parent.mkdir(parents=True, exist_ok=True)
    stamp_file.write_text(dt.datetime.now().isoformat(timespec="seconds"), encoding="utf-8")


def run_with_win32com(script_name: str, fallback_function_name: str, logger: Logger) -> bool:
    import win32com.client  # type: ignore

    api = win32com.client.Dispatch("freedomsci.jawsapi")
    logger.write(f"FSAPI COM connected via win32com. RunScript('{script_name}')")
    ok = bool(api.RunScript(script_name))
    if ok:
        return True

    logger.write(f"RunScript('{script_name}') returned FALSE.")
    if fallback_function_name:
        logger.write(f"Trying RunFunction('{fallback_function_name}').")
        return bool(api.RunFunction(fallback_function_name))
    return False


def run_with_powershell_com(script_name: str, fallback_function_name: str, logger: Logger) -> bool:
    fallback = (
        f"$ok = $api.RunFunction('{fallback_function_name}');"
        if fallback_function_name
        else "$ok = $false;"
    )

    ps = (
        "$api = New-Object -ComObject freedomsci.jawsapi;"
        f"$ok = $api.RunScript('{script_name}');"
        f"if (-not $ok) {{ {fallback} }}"
        "if ($ok) { 'OK' } else { 'FAIL' }"
    )

    logger.write("Fallback: invoking FSAPI through powershell COM.")
    completed = subprocess.run(
        [
            "powershell.exe",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            ps,
        ],
        capture_output=True,
        text=True,
        timeout=30,
        check=False,
    )

    stdout = (completed.stdout or "").strip()
    stderr = (completed.stderr or "").strip()
    logger.write(f"PowerShell exit={completed.returncode}; stdout='{stdout}'; stderr='{stderr}'")
    return completed.returncode == 0 and stdout.endswith("OK")


def invoke_jaws(script_name: str, fallback_function_name: str, logger: Logger) -> bool:
    try:
        return run_with_win32com(script_name, fallback_function_name, logger)
    except ModuleNotFoundError:
        logger.write("win32com not installed. Trying PowerShell COM fallback.")
        return run_with_powershell_com(script_name, fallback_function_name, logger)
    except Exception as exc:
        logger.write(f"win32com path failed: {exc}")
        logger.write(traceback.format_exc().strip())
        logger.write("Trying PowerShell COM fallback.")
        return run_with_powershell_com(script_name, fallback_function_name, logger)


def main() -> int:
    args = parse_args()

    state_dir = Path(args.state_dir)
    log_file = Path(args.log_file) if args.log_file else state_dir / "restart-log.txt"
    stamp_file = Path(args.stamp_file) if args.stamp_file else state_dir / "last-restart.txt"
    logger = Logger(log_file)

    logger.write("--- Start ---")
    logger.write(
        f"Args: delay={args.delay_seconds}, cooldown={args.cooldown_seconds}, "
        f"dry_run={args.dry_run}, force_local={args.force_local}, script={args.script_name}, "
        f"fallback_function={args.fallback_function_name or '<none>'}"
    )
    logger.write(
        f"Context: user={os.environ.get('USERNAME', '?')}, "
        f"session={os.environ.get('SESSIONNAME', '?')}, pid={os.getpid()}"
    )

    if not args.force_local and not is_remote_session():
        logger.write("Abort: no remote session detected.")
        return 0

    if should_abort_for_cooldown(stamp_file, args.cooldown_seconds):
        logger.write("Abort: cooldown is still active.")
        return 0

    if args.delay_seconds > 0:
        logger.write(f"Sleeping {args.delay_seconds}s before invoking FSAPI.")
        time.sleep(args.delay_seconds)

    if args.dry_run:
        logger.write("DRY RUN: no FSAPI call executed.")
        return 0

    ok = invoke_jaws(args.script_name, args.fallback_function_name, logger)
    if not ok:
        logger.write("ERROR: FSAPI call returned FALSE or failed.")
        return 2

    write_restart_stamp(stamp_file)
    logger.write("Success: restart script/function was scheduled in JAWS.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # top-level crash logging
        state_dir = Path(r"C:\ProgramData\Beta\RemoteJawsRecovery")
        logger = Logger(state_dir / "restart-log.txt")
        logger.write(f"FATAL: {exc}")
        logger.write(traceback.format_exc().strip())
        raise
