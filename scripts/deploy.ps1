# Deploy commo.cc to server. Run from project root (uses your SSH keys).
# Requires: .env.deploy with COMMO_SSH and COMMO_REMOTE_PATH (see .env.deploy.example).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$envFile = Join-Path $root ".env.deploy"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
        }
    }
}

$sshTarget = $env:COMMO_SSH
$remotePath = $env:COMMO_REMOTE_PATH
$sshKey = $env:COMMO_SSH_KEY

if (-not $sshTarget -or -not $remotePath) {
    Write-Host "Missing COMMO_SSH or COMMO_REMOTE_PATH. Copy .env.deploy.example to .env.deploy and set values."
    exit 1
}

$cmd = "[ -s /root/.nvm/nvm.sh ] && . /root/.nvm/nvm.sh; cd $remotePath && git pull && (test -f package-lock.json && npm ci || npm install) && npm run build && (pm2 restart commo 2>/dev/null || pm2 start ecosystem.config.cjs 2>/dev/null || pm2 start npm --name commo -- start 2>/dev/null || echo 'Start app manually: pm2 start ecosystem.config.cjs')"
Write-Host "Deploying to $sshTarget ($remotePath) ..."
if ($sshKey) { ssh -i $sshKey $sshTarget $cmd } else { ssh $sshTarget $cmd }
Write-Host "Done."
