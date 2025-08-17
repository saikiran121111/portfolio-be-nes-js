#!/bin/sh

# Git hooks setup script
# This script configures Git to use custom hooks from the .githooks directory

echo "🔧 Setting up Git hooks..."

# Configure Git to use the .githooks directory
git config core.hooksPath .githooks

# Make the pre-push hook executable
chmod +x .githooks/pre-push

echo "✅ Git hooks configured successfully!"
echo ""
echo "📋 Configured hooks:"
echo "   - pre-push: Runs tests, linting, and coverage checks before allowing push"
echo ""
echo "🎯 Coverage requirements:"
echo "   - Statements: 100%"
echo "   - Branches: 90%"
echo "   - Functions: 100%"
echo "   - Lines: 100%"
echo ""
echo "⚡ To bypass hooks in emergency (not recommended):"
echo "   git push --no-verify"
