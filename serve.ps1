# Pequeño servidor HTTP estático para PowerShell
# Coloca este archivo en la carpeta del proyecto y ejecútalo desde PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\serve.ps1
# Luego abre: http://localhost:5500/

Add-Type -AssemblyName System.Net.HttpListener
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:5500/"
$listener.Prefixes.Add($prefix)
try{
    $listener.Start()
    Write-Host "Servidor iniciado en $prefix — pulsa Ctrl+C para detener"
    while ($listener.IsListening){
        $context = $listener.GetContext()
        $req = $context.Request
        $resp = $context.Response

        # Obtener ruta local relativa
        $rawPath = $req.Url.LocalPath.TrimStart('/') -replace '/','\\'
        if ([string]::IsNullOrEmpty($rawPath)) { $rawPath = 'index.html' }
        $fullPath = Join-Path (Get-Location) $rawPath

        if (Test-Path $fullPath) {
            try{
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $resp.ContentLength64 = $bytes.Length
                switch ([System.IO.Path]::GetExtension($fullPath).ToLower()){
                    '.html' { $resp.ContentType = 'text/html; charset=utf-8' }
                    '.css'  { $resp.ContentType = 'text/css' }
                    '.js'   { $resp.ContentType = 'application/javascript' }
                    '.json' { $resp.ContentType = 'application/json' }
                    '.png'  { $resp.ContentType = 'image/png' }
                    '.jpg'  { $resp.ContentType = 'image/jpeg' }
                    '.jpeg' { $resp.ContentType = 'image/jpeg' }
                    '.svg'  { $resp.ContentType = 'image/svg+xml' }
                    '.mp3'  { $resp.ContentType = 'audio/mpeg' }
                    default { $resp.ContentType = 'application/octet-stream' }
                }
                $resp.OutputStream.Write($bytes,0,$bytes.Length)
            } catch {
                $resp.StatusCode = 500
                $msg = [System.Text.Encoding]::UTF8.GetBytes("Internal server error: $($_.Exception.Message)")
                $resp.OutputStream.Write($msg,0,$msg.Length)
            }
        } else {
            $resp.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $rawPath")
            $resp.OutputStream.Write($msg,0,$msg.Length)
        }
        $resp.OutputStream.Close()
    }
}catch{
    Write-Host "Error al iniciar el servidor: $($_.Exception.Message)"
}finally{
    if ($listener -and $listener.IsListening) { $listener.Stop(); $listener.Close(); }
}
