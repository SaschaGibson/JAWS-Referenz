# Lieferpaket-Hinweis

Das Liefer-ZIP wird lokal mit `Create-DeliveryZip.ps1` erzeugt und enthält alle Quellen, Build- und Deployment-Skripte.

Die finale Windows-EXE (`RemoteJawsReconnect.exe`) wird über
`Build-RemoteJawsReconnectExe.ps1` auf einem Windows-System erzeugt
(PyInstaller, `--noconsole`, `--onefile`).
