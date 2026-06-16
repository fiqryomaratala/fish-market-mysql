param(
  [int]$Port = 8080,
  [switch]$KillExisting,
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

if ($StartServer) {
  if (-not (Test-PortFree -TargetPort $Port) -and -not $KillExisting) {
    throw "Port $Port sedang dipakai. Backend dikonfigurasi hanya boleh berjalan di port ini."
  }

  $env:APP_PORT = "$Port"
  Write-Host "Menjalankan backend pada port $Port ..." -ForegroundColor Cyan
  go run cmd/server/main.go
}
