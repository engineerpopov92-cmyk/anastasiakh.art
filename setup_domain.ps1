# Anastasia Kh. - Local Domain & SSL Setup Script
# Configures anastasiakh.art in Windows hosts file and trusts local SSL certificate

$ErrorActionPreference = "Stop"

# Ensure running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Requesting Administrator privileges to update hosts file and SSL store..." -ForegroundColor Yellow
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Anastasia Kh. - Local Domain Configuration (anastasiakh.art) " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Update Hosts File
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$hostsContent = Get-Content $hostsPath -Raw -ErrorAction SilentlyContinue

$domainEntry = @"

# Anastasia Kh. Local Domain
127.0.0.1 anastasiakh.art
127.0.0.1 www.anastasiakh.art
"@

if ($hostsContent -notmatch "anastasiakh\.art") {
    Write-Host "[1/3] Adding anastasiakh.art to Windows hosts file..." -ForegroundColor Green
    Add-Content -Path $hostsPath -Value $domainEntry -Encoding UTF8
    Write-Host "      Successfully updated hosts file!" -ForegroundColor Gray
} else {
    Write-Host "[1/3] anastasiakh.art already mapped in hosts file." -ForegroundColor Yellow
}

# 2. Trust Local SSL Certificate in Windows Store
$certPath = "D:\Anastasia website\cert.pem"
if (Test-Path $certPath) {
    Write-Host "[2/3] Installing local SSL certificate into Windows Trusted Root..." -ForegroundColor Green
    try {
        $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certPath)
        $store = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "LocalMachine")
        $store.Open("ReadWrite")
        $store.Add($cert)
        $store.Close()
        Write-Host "      SSL certificate trusted successfully (no browser warnings)!" -ForegroundColor Gray
    } catch {
        Write-Host "      Note on SSL trust: $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
} else {
    Write-Host "[2/3] cert.pem not found in D:\Anastasia website." -ForegroundColor Red
}

# 3. Flush DNS Cache
Write-Host "[3/3] Flushing Windows DNS resolver cache..." -ForegroundColor Green
ipconfig /flushdns | Out-Null
Write-Host "      DNS cache flushed." -ForegroundColor Gray

Write-Host "`nAll set! You can now visit: https://anastasiakh.art" -ForegroundColor Cyan
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
