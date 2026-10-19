$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$sdkRoot = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } elseif ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { "$env:LOCALAPPDATA\Android\Sdk" }
$adbPath = Join-Path $sdkRoot 'platform-tools\adb.exe'
$emulatorPath = Join-Path $sdkRoot 'emulator\emulator.exe'
$avdName = if ($env:ANDROID_AVD) { $env:ANDROID_AVD } else { 'Pixel_6' }

if (-not (Test-Path $adbPath)) {
  throw "adb not found at $adbPath"
}

if (-not (Test-Path $emulatorPath)) {
  throw "emulator not found at $emulatorPath"
}

function Get-AndroidDeviceSerial {
  param(
    [string]$AdbExe
  )

  $lines = & $AdbExe devices
  $deviceLine = $lines | Select-String -Pattern '^emulator-\d+\s+device$' | Select-Object -First 1
  if (-not $deviceLine) {
    return $null
  }

  return (($deviceLine.Line -split '\s+')[0]).Trim()
}

function Install-ExpoGoIfCached {
  param(
    [string]$AdbExe,
    [string]$Serial
  )

  if (-not $Serial) {
    return
  }

  $installedPath = (& $AdbExe -s $Serial shell pm path host.exp.exponent 2>$null | Out-String).Trim()
  if ($installedPath) {
    return
  }

  $apkCacheDir = Join-Path $env:USERPROFILE '.expo\android-apk-cache'
  if (-not (Test-Path $apkCacheDir)) {
    return
  }

  $apk = Get-ChildItem -Path $apkCacheDir -Filter 'Expo-Go-*.apk' -File -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

  if (-not $apk) {
    return
  }

  Write-Host "Installing cached Expo Go on $Serial..."
  $maxInstallAttempts = 3
  for ($attempt = 1; $attempt -le $maxInstallAttempts; $attempt++) {
    $activeSerial = Get-AndroidDeviceSerial -AdbExe $AdbExe
    if (-not $activeSerial) {
      & $AdbExe wait-for-device | Out-Null
      continue
    }

    & $AdbExe -s $activeSerial install -r -d --user 0 $apk.FullName | Out-Null
    if ($LASTEXITCODE -eq 0) {
      Write-Host 'Expo Go installed from cache.'
      return
    }

    if ($attempt -lt $maxInstallAttempts) {
      & $AdbExe wait-for-device | Out-Null
    }
  }
}

$deviceOutput = & $adbPath devices
$hasEmulator = $deviceOutput | Select-String -Pattern 'emulator-\d+\s+(device|offline)'

if (-not $hasEmulator) {
  Write-Host "Starting Android emulator: $avdName"
  Start-Process -FilePath $emulatorPath -ArgumentList '-avd', $avdName | Out-Null
}

Write-Host 'Waiting for emulator to connect...'
& $adbPath wait-for-device | Out-Null

$bootCompleted = ''
$maxChecks = 60
$check = 0
while ($bootCompleted -ne '1' -and $check -lt $maxChecks) {
  $bootCompleted = (& $adbPath shell getprop sys.boot_completed).Trim()
  $check += 1
}

if ($bootCompleted -ne '1') {
  throw 'Emulator did not finish booting in time.'
}

Write-Host 'Android emulator is ready. Starting Expo on Android...'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
$env:EXPO_NO_DOCTOR = '1'
$env:CI = '1'
$expoPort = if ($env:EXPO_PORT) { $env:EXPO_PORT } else { '8083' }

$deviceSerial = Get-AndroidDeviceSerial -AdbExe $adbPath
Install-ExpoGoIfCached -AdbExe $adbPath -Serial $deviceSerial

$maxExpoAttempts = 2
for ($expoAttempt = 1; $expoAttempt -le $maxExpoAttempts; $expoAttempt++) {
  npx expo start --android --port $expoPort
  if ($LASTEXITCODE -eq 0) {
    exit 0
  }

  if ($expoAttempt -lt $maxExpoAttempts) {
    Write-Host 'Expo failed to attach to device. Retrying once after adb reconnection...'
    & $adbPath kill-server | Out-Null
    & $adbPath start-server | Out-Null
    & $adbPath wait-for-device | Out-Null
  }
}

throw 'Expo could not open on Android after retry. Check emulator window and run adb devices.'
