Write-Host "[INFO] Checking for Tesseract OCR..."

function Set-EnvVars($path) {
  $td = Join-Path ([System.IO.Path]::GetDirectoryName($path)) 'tessdata'
  try { setx TESSERACT_CMD $path /M | Out-Null } catch { setx TESSERACT_CMD $path | Out-Null }
  try { setx TESSDATA_PREFIX $td /M | Out-Null } catch { setx TESSDATA_PREFIX $td | Out-Null }
}

function Find-TesseractPath {
  $candidates = @(
    "$Env:ProgramFiles\Tesseract-OCR\tesseract.exe",
    "$Env:ProgramFiles(x86)\Tesseract-OCR\tesseract.exe"
  )
  foreach ($p in $candidates) { if (Test-Path $p) { return $p } }
  $cmd = (Get-Command tesseract -ErrorAction SilentlyContinue)
  if ($cmd) { return $cmd.Source }
  return $null
}

$tessPath = Find-TesseractPath
if (-not $tessPath) {
  Write-Host "[INFO] Tesseract not found. Attempting auto-install..."

  $installed = $false
  # Try winget first (UB-Mannheim package)
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if ($winget) {
    try {
      Write-Host "[INFO] Using winget to install UB-Mannheim.TesseractOCR"
      winget install -e --id UB-Mannheim.TesseractOCR --accept-package-agreements --accept-source-agreements --silent
      $tessPath = Find-TesseractPath
      if ($tessPath) { $installed = $true }
    } catch { Write-Host "[WARN] winget install failed: $($_.Exception.Message)" }
    if (-not $installed) {
      try {
        Write-Host "[INFO] Using winget to install tesseract (fallback)"
        winget install -e --id TesseractOCR.Tesseract --accept-package-agreements --accept-source-agreements --silent
        $tessPath = Find-TesseractPath
        if ($tessPath) { $installed = $true }
      } catch { Write-Host "[WARN] winget fallback failed: $($_.Exception.Message)" }
    }
  }

  # Try Chocolatey
  if (-not $installed) {
    $choco = Get-Command choco -ErrorAction SilentlyContinue
    if ($choco) {
      try {
        Write-Host "[INFO] Using Chocolatey to install tesseract"
        choco install -y tesseract
        $tessPath = Find-TesseractPath
        if ($tessPath) { $installed = $true }
      } catch { Write-Host "[WARN] choco install failed: $($_.Exception.Message)" }
    }
  }

  # Direct download from GitHub latest release
  if (-not $installed) {
    try {
      Write-Host "[INFO] Downloading installer from GitHub releases (latest)..."
      $release = Invoke-RestMethod -Uri "https://api.github.com/repos/UB-Mannheim/tesseract/releases/latest" -Headers @{ 'User-Agent' = 'chikitsamedha-installer' }
      $asset = $release.assets | Where-Object { $_.name -match 'setup' -and $_.name -match 'w64' -and $_.name -match '\.exe$' } | Select-Object -First 1
      if (-not $asset) { $asset = $release.assets | Where-Object { $_.name -match '\.exe$' } | Select-Object -First 1 }
      if ($asset -and $asset.browser_download_url) {
        $tmp = Join-Path $Env:TEMP "tesseract-setup.exe"
        Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $tmp
        Write-Host "[INFO] Running installer silently..."
        $p = Start-Process -FilePath $tmp -ArgumentList "/VERYSILENT /NORESTART" -PassThru -Wait -ErrorAction SilentlyContinue
        if ($p -and $p.ExitCode -eq 0) {
          $tessPath = Find-TesseractPath
          if ($tessPath) { $installed = $true }
        } else {
          Write-Host "[WARN] Installer returned exit code: $($p.ExitCode)"
        }
      } else {
        Write-Host "[WARN] Could not resolve installer asset from GitHub API."
      }
    } catch { Write-Host "[WARN] GitHub download/install failed: $($_.Exception.Message)" }
  }

  if (-not $installed) {
    $url = "https://github.com/UB-Mannheim/tesseract/wiki"
    Write-Host "[INFO] Please install Tesseract manually from: $url"
    try { Start-Process msedge.exe $url -ErrorAction SilentlyContinue } catch {}
    try { Start-Process chrome.exe $url -ErrorAction SilentlyContinue } catch {}
  }
}

if ($tessPath) {
  Set-EnvVars $tessPath
  Write-Host "[OK]   Tesseract available at: $tessPath"
} else {
  Write-Host "[ERROR] Tesseract not available. OCR will be disabled."
}
