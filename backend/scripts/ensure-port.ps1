param(
  [int]$Port = 8080,
  [switch]$KillExisting,
  [switch]$UseFallback,
  [int[]]$FallbackPorts = @(8081, 8082, 8083, 8090),
  [switch]$StartServer
)

function Get-PortOwner {
  param([int]$TargetPort)

  try {
    $connection = Get-NetTCPConnection -LocalPort $TargetPort -State Listen -ErrorAction Stop |
      Select-Object -First 1

    if ($null -eq $connection) {
      return $null
    }

    return Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
  } catch {
    $netstatLine = netstat -ano | Select-String -Pattern "LISTENING\s+$" | ForEach-Object { $_.Line } |
      Where-Object { $_ -match "[:\.]$TargetPort\s" } | Select-Object -First 1

    if (-not $netstatLine) {
      return $null
    }

    $parts = ($netstatLine -replace '\s+', ' ').Trim().Split(' ')
    $pid = [int]$parts[-1]
    return Get-Process -Id $pid -ErrorAction SilentlyContinue
  }
}

function Test-PortFree {
  param([int]$TargetPort)

  return $null -eq (Get-PortOwner -TargetPort $TargetPort)
}

function Resolve-AvailablePort {
  param(
    [int]$PrimaryPort,
    [int[]]$CandidatePorts
  )

  if (Test-PortFree -TargetPort $PrimaryPort) {
    return $PrimaryPort
  }

  foreach ($candidate in $CandidatePorts) {
    if (Test-PortFree -TargetPort $candidate) {
      return $candidate
    }
  }

  throw "Tidak ada port yang tersedia pada daftar kandidat: $($CandidatePorts -join ', ')"
}

$owner = Get-PortOwner -TargetPort $Port

if ($owner) {
  Write-Host "Port $Port sedang dipakai oleh PID $($owner.Id) ($($owner.ProcessName))." -ForegroundColor Yellow

  if ($KillExisting) {
    Stop-Process -Id $owner.Id -Force
    Start-Sleep -Milliseconds 500
    Write-Host "Process PID $($owner.Id) berhasil dihentikan." -ForegroundColor Green
  }
} else {
  Write-Host "Port $Port sedang kosong." -ForegroundColor Green
}

$selectedPort = $Port

if ($UseFallback) {
  $selectedPort = Resolve-AvailablePort -PrimaryPort $Port -CandidatePorts $FallbackPorts
  Write-Host "Port terpilih: $selectedPort" -ForegroundColor Cyan
}

if ($StartServer) {
  $env:APP_PORT = "$selectedPort"
  Write-Host "Menjalankan backend pada port $selectedPort ..." -ForegroundColor Cyan
  go run cmd/server/main.go
}
