param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
)

$ErrorActionPreference = 'Stop'

$workspaceRoot = Join-Path $RepoRoot '.workspace'
$nodeRoot = Join-Path $workspaceRoot 'local\.conda-node'
$nodeExe = Join-Path $nodeRoot 'node.exe'
$npmCli = Join-Path $nodeRoot 'node_modules\npm\bin\npm-cli.js'
$projectDir = Join-Path $workspaceRoot 'toys'
$buildDir = Join-Path $projectDir 'build'
$targetDir = Join-Path $RepoRoot 'embeds\cloud'
$tmpDir = Join-Path $workspaceRoot 'local\.tmp-build'

if (!(Test-Path $nodeExe) -or !(Test-Path $npmCli)) {
  throw 'Local Node runtime not found. Create x:\w\academicpages\0mil.github.io\.workspace\local\.conda-node first.'
}

$env:PATH = "$nodeRoot;$env:PATH"
$env:TMP = $tmpDir
$env:TEMP = $tmpDir
$env:PUBLIC_URL = '.'

New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

Push-Location $projectDir
try {
  if (!(Test-Path (Join-Path $projectDir 'node_modules\react-scripts'))) {
    & $nodeExe $npmCli install
  }

  & $nodeExe $npmCli run build
}
finally {
  Pop-Location
}

$resolvedTarget = (Resolve-Path $targetDir).Path
$expectedTarget = (Resolve-Path (Join-Path $RepoRoot 'embeds\cloud')).Path
if ($resolvedTarget -ne $expectedTarget) {
  throw "Unexpected publish target: $resolvedTarget"
}

Get-ChildItem -LiteralPath $targetDir -Force | Remove-Item -Recurse -Force
Copy-Item -Path (Join-Path $buildDir '*') -Destination $targetDir -Recurse -Force

Write-Host "Published single-cloud bundle to $targetDir"
