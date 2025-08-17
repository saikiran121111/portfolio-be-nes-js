@echo off
echo 🔧 Setting up Git hooks...

REM Configure Git to use the .githooks directory
git config core.hooksPath .githooks

REM Create a wrapper pre-push hook that calls the PowerShell version
echo #!/bin/sh > .githooks\pre-push
echo # Wrapper script to call PowerShell version on Windows >> .githooks\pre-push
echo powershell.exe -ExecutionPolicy Bypass -File .githooks/pre-push.ps1 >> .githooks\pre-push

echo ✅ Git hooks configured successfully!
echo.
echo 📋 Configured hooks:
echo    - pre-push: Runs tests, linting, and coverage checks before allowing push
echo.
echo 🎯 Coverage requirements:
echo    - Statements: 100%%
echo    - Branches: 90%%
echo    - Functions: 100%%
echo    - Lines: 100%%
echo.
echo ⚡ To bypass hooks in emergency (not recommended):
echo    git push --no-verify

pause
