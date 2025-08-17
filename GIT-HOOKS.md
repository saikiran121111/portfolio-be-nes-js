# Git Hooks Setup

This project includes Git hooks to ensure code quality by preventing pushes when tests fail, linting errors exist, or coverage requirements are not met.

## 🚀 Quick Setup

### Option 1: Using npm script (Recommended)
```bash
npm run setup-hooks
```

### Option 2: Using setup scripts
```bash
# For Unix/Linux/Mac
./setup-hooks.sh

# For Windows
setup-hooks.bat
```

### Option 3: Manual setup
```bash
git config core.hooksPath .githooks
```

## 📋 What the pre-push hook checks

The pre-push hook will automatically run before every `git push` and check:

1. **🧪 Tests**: All Jest tests must pass
2. **🔍 Linting**: ESLint must pass with no errors
3. **📊 Coverage**: Code coverage must meet minimum requirements:
   - Statements: 100%
   - Branches: ≥90%
   - Functions: 100%
   - Lines: 100%

## ✅ Successful Push Flow

When you run `git push`, you'll see:

```
🔍 Running pre-push checks...
🧪 Running tests...
✅ All tests passed!
🔍 Running linting...
✅ Linting passed!
🎯 Running test coverage...
✅ All coverage requirements met!
🚀 All checks passed! Proceeding with push...
```

## ❌ Failed Push Flow

If any check fails, the push will be rejected:

```
🔍 Running pre-push checks...
🧪 Running tests...
❌ Tests failed! Push rejected.
Please fix failing tests before pushing.
```

## 🚨 Emergency Bypass

**⚠️ Not recommended!** In emergency situations, you can bypass the hooks:

```bash
git push --no-verify
```

## 🛠️ Troubleshooting

### Hook not running?
- Ensure you've run the setup: `npm run setup-hooks`
- Check git config: `git config core.hooksPath` should show `.githooks`

### Permission denied on Unix/Linux/Mac?
```bash
chmod +x .githooks/pre-push
```

### Tests/linting failing?
- Run locally to debug: `npm run verify-setup`
- Fix issues before attempting to push

## 📁 Files Structure

```
.githooks/
├── pre-push           # Git pre-push hook script (wrapper for Windows)
├── pre-push.ps1       # PowerShell implementation for Windows
setup-hooks.sh         # Unix setup script
setup-hooks.bat        # Windows setup script
```

## 🎯 Benefits

- **Quality Assurance**: Prevents broken code from being pushed
- **Team Consistency**: Ensures all team members follow the same quality standards
- **Automated Checks**: No need to remember to run tests/linting manually
- **Coverage Enforcement**: Maintains high code coverage standards
- **Cross-Platform**: Works on both Unix/Linux/Mac and Windows systems

## 📝 Customizing Coverage Requirements

To modify coverage requirements, edit `.githooks/pre-push` and adjust the regex pattern or add more sophisticated parsing logic.

Current requirement pattern: `"All files.*100.*9[0-9].*100.*100"`
- First `100`: 100% statements
- `9[0-9]`: 90-99% branches
- Last two `100`: 100% functions and lines
