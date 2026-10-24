param(
    [Parameter(Position=0)]
    [string]$Command,
    [Parameter(Position=1)]
    [string]$SubCommand,
    [Parameter(ValueFromRemainingArguments=$true)]
    $RemainingArgs
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($Command -eq "start" -or ($Command -eq "run" -and ($SubCommand -eq "start" -or $SubCommand -eq "dev"))) {
    & "$scriptDir\node.ps1" "$scriptDir\server.js"
} elseif ($Command -eq "run" -and $SubCommand -eq "verify") {
    & "$scriptDir\node.ps1" "$scriptDir\verifyApi.js"
} elseif (-not $Command) {
    Write-Host "HackSphere backend commands:" -ForegroundColor Cyan
    Write-Host "  npm start       - Starts the backend server (node server.js)"
    Write-Host "  npm run dev     - Starts the backend server"
    Write-Host "  npm run verify  - Runs automated CRUD API verification tests"
} else {
    & "$scriptDir\node.ps1" $Command $SubCommand $RemainingArgs
}
