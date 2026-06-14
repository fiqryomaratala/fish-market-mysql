param(
  [string]$Origin = "http://localhost:5173",
  [string]$ApiUrl = "http://localhost:8080/api/products"
)

Write-Host "Testing preflight request to $ApiUrl from origin $Origin" -ForegroundColor Cyan
curl.exe -i -X OPTIONS $ApiUrl `
  -H "Origin: $Origin" `
  -H "Access-Control-Request-Method: GET" `
  -H "Access-Control-Request-Headers: Authorization, Content-Type"

Write-Host ""
Write-Host "Testing actual GET request to $ApiUrl from origin $Origin" -ForegroundColor Cyan
curl.exe -i $ApiUrl `
  -H "Origin: $Origin"
