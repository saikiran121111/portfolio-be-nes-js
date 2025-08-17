# Pre-push hook script for Windows PowerShell
# This hook is called by "git push" and can be used to prevent a push from taking place.

Write-Host "Running pre-push checks..." -ForegroundColor Cyan

Write-Host "Running tests..." -ForegroundColor Yellow

# Run tests
npm test
$testExitCode = $LASTEXITCODE
if ($testExitCode -ne 0) {
    Write-Host "Tests failed! Push rejected." -ForegroundColor Red
    Write-Host "Please fix failing tests before pushing." -ForegroundColor Red
    exit 1
}
Write-Host "All tests passed!" -ForegroundColor Green

Write-Host "Running linting..." -ForegroundColor Yellow

# Run linting
npm run lint
$lintExitCode = $LASTEXITCODE
if ($lintExitCode -ne 0) {
    Write-Host "Linting failed! Push rejected." -ForegroundColor Red
    Write-Host "Please fix linting errors before pushing." -ForegroundColor Red
    exit 1
}
Write-Host "Linting passed!" -ForegroundColor Green

Write-Host "Running test coverage..." -ForegroundColor Yellow

# Run test coverage and capture output
$coverageOutput = npm run test:cov | Out-String
$coverageExitCode = $LASTEXITCODE

if ($coverageExitCode -ne 0) {
    Write-Host "Coverage check failed! Push rejected." -ForegroundColor Red
    Write-Host $coverageOutput
    exit 1
}

# Check if coverage meets minimum requirements
if ($coverageOutput -notmatch "All files.*100.*9[0-9].*100.*100") {
    Write-Host "Coverage requirements not met! Push rejected." -ForegroundColor Red
    Write-Host "Required: Statements: 100%, Branches: >=90%, Functions: 100%, Lines: 100%" -ForegroundColor Red
    
    # Try to show the coverage line
    if ($coverageOutput -match "All files.*\d+.*\d+.*\d+.*\d+") {
        Write-Host "Current coverage: $($matches[0])" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host "All coverage requirements met!" -ForegroundColor Green
Write-Host "All checks passed! Proceeding with push..." -ForegroundColor Green
exit 0
