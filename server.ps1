$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:8081/")
$listener.Start()
Write-Host "Server started on http://+:8081/ (accessible from your LAN if firewall allows it)"
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }
    $filePath = Join-Path "c:\Users\Vinayak Jadhav\OneDrive\Desktop\Porfolio website" $localPath.TrimStart("/")
    if (Test-Path $filePath -PathType Leaf) {
        $contentType = if ($filePath.EndsWith(".html")) { "text/html" } elseif ($filePath.EndsWith(".css")) { "text/css" } elseif ($filePath.EndsWith(".js")) { "application/javascript" } elseif ($filePath -match '\.png$') { "image/png" } elseif ($filePath -match '\.jpe?g$') { "image/jpeg" } elseif ($filePath -match '\.gif$') { "image/gif" } elseif ($filePath -match '\.svg$') { "image/svg+xml" } elseif ($filePath -match '\.pdf$') { "application/pdf" } else { "application/octet-stream" }
        $buffer = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } else {
        $response.StatusCode = 404
        $notFound = "404 Not Found"
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    $response.OutputStream.Close()
}