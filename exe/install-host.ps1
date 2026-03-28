$ExtensionId = $args[0]

if ([string]::IsNullOrWhiteSpace($ExtensionId)) {
    Write-Error "Usage: .\install-host.ps1 <chrome-extension-id>"
    exit 1
}

$manifestPath = Join-Path $PSScriptRoot "host-manifest.template.json"
$targetPath = Join-Path $PSScriptRoot "com.channel_codex.browser_host.json"
$registryKeys = @(
    "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.channel_codex.browser_host",
    "HKCU\Software\Wow6432Node\Google\Chrome\NativeMessagingHosts\com.channel_codex.browser_host"
)

if (-not (Test-Path $manifestPath)) {
    Write-Error "Manifest template not found: $manifestPath"
    exit 1
}

$manifestContent = Get-Content $manifestPath -Raw
$manifestContent = $manifestContent.Replace("REPLACE_WITH_EXTENSION_ID", $ExtensionId)
[System.IO.File]::WriteAllText(
    $targetPath,
    $manifestContent,
    [System.Text.UTF8Encoding]::new($false)
)

foreach ($registryKey in $registryKeys) {
    reg add $registryKey /ve /t REG_SZ /d $targetPath /f | Out-Null
    Write-Host "Registry key registered at $registryKey"
}

Write-Host "Native messaging manifest generated at $targetPath"
Write-Host "Extension ID: $ExtensionId"
