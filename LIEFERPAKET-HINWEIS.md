# Lieferpaket-Hinweis

Das Liefer-ZIP wird lokal mit `Create-DeliveryZip.ps1` erzeugt und enthält alle Quellen, Build- und Deployment-Skripte.
Wenn die EXE zwingend enthalten sein soll, nutze:

`powershell.exe -ExecutionPolicy Bypass -File .\Create-DeliveryZip.ps1 -PackageMode OneDir -IncludeExe Required`

Die finale Windows-EXE (`RemoteJawsReconnect.exe`) wird über
`Build-RemoteJawsReconnectExe.ps1` auf einem Windows-System erzeugt
(PyInstaller, `--noconsole`; empfohlen: `OneDir`).
