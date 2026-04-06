param(
  [string]$RepoRoot = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

$nodeExe = Join-Path $RepoRoot '.workspace\local\.conda-node\node.exe'
$scriptPath = Join-Path $RepoRoot '.workspace\scripts\build-site.mjs'

if (!(Test-Path $nodeExe)) {
  throw 'Local Node runtime not found. Create x:\w\academicpages\0mil.github.io\.workspace\local\.conda-node first.'
}

& $nodeExe $scriptPath
