# 🔄 Development Workflow Guide

**How to work on improvements while the website is live and users are using it**

---

## 📚 Overview

This guide explains the professional workflow for continuing development on a live website using **Git branches** and **Vercel preview deployments**.

### Key Concepts
- **Live site (Production)** = `main` branch → All users see this
- **Preview site (Staging)** = Feature branches → Only you & client see this
- **Never break the live site!** - Test everything on preview first

---

## 🎯 The Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. CREATE BRANCH                                               │
│     git checkout -b feature/new-feature                        │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  2. MAKE CHANGES                                               │
│     - Write code                                               │
│     - Test locally                                             │
│     - Commit changes                                           │
│     git push origin feature/new-feature                        │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  3. VERCEL AUTO-DEPLOYS PREVIEW                                │
│     🌐 greek-souvlaki-website-abc123.vercel.app               │
│     - Only YOU see this                                        │
│     - Live site is UNCHANGED                                   │
│     - Test everything here                                     │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  4. CLIENT REVIEWS                                             │
│     - Share preview URL with client                            │
│     - Get feedback                                             │
│     - Make fixes if needed                                     │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  5. CREATE PULL REQUEST                                        │
│     - Go to GitHub                                             │
│     - Create PR from feature → main                            │
│     - Request client approval                                  │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  6. MERGE TO MAIN                                             │
│     git checkout main                                          │
│     git merge feature/new-feature                             │
│     git push origin main                                       │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  7. VERCEL DEPLOYS TO PRODUCTION                              │
│     🌐 greek-souvlaki-website.vercel.app                      │
│     - ALL USERS see this                                      │
│     - New features are LIVE!                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Guide

### Step 1: Create a Feature Branch

**Never work directly on `main`!** Always create a branch.

```bash
# See current branch
git branch

# Create and switch to new branch
git checkout -b feature/online-ordering

# Branch naming convention:
# feature/new-feature    - For new features
# fix/bug-name          - For bug fixes
# hotfix/urgent-fix     - For urgent production fixes
# chore/update-name     - For minor updates
```

### Step 2: Make Your Changes

```bash
# Make changes to files
# Edit App.tsx, constants.ts, etc.

# See what changed
git status

# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add shopping cart component"
```

### Step 3: Push to GitHub

```bash
# Push your branch to GitHub
git push origin feature/online-ordering
```

### Step 4: Vercel Creates Preview URL ✨

**This happens automatically!**

| Branch Type | URL Example | Who Can See |
|-------------|-------------|-------------|
| **main** | `greek-souvlaki-website.vercel.app` | Everyone (PRODUCTION) |
| **feature/*** | `greek-souvlaki-website-j4k2m1.vercel.app` | Only you (PREVIEW) |
| **fix/*** | `greek-souvlaki-website-x9p3q5.vercel.app` | Only you (PREVIEW) |

**Key Points:**
- Preview URL is unique for each branch
- Preview updates automatically when you push
- Live site is **never affected**
- You can share preview URL with client for testing

### Step 5: Test on Preview URL

```bash
# Check your Vercel dashboard for preview URL
# Or check the GitHub deployment status

# Test the preview URL:
# https://greek-souvlaki-website-j4k2m1.vercel.app
```

**Testing Checklist:**
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All languages work
- [ ] No performance issues

### Step 6: Share Preview with Client

```bash
# Share the preview URL via WhatsApp/Email
# "Here's the new feature for testing:"
# https://greek-souvlaki-website-j4k2m1.vercel.app
```

**Client can:**
- Test the feature
- Request changes
- Approve when satisfied

### Step 7: Make Fixes if Needed

```bash
# Make more changes based on feedback
git add .
git commit -m "fix: adjust button color based on feedback"
git push origin feature/online-ordering

# Preview URL updates automatically!
# Same URL, new code
```

### Step 8: Create Pull Request

When approved, create a PR on GitHub:

**Option 1: Via GitHub Website**
1. Go to: https://github.com/ward3107/Souvlaki
2. Click "Pull requests" → "New pull request"
3. Select branch: `feature/online-ordering` → `main`
4. Add title and description
5. Click "Create pull request"

**Option 2: Via Command Line**
```bash
# Using GitHub CLI (if installed)
gh pr create --title "Add online ordering system" --body "Implements shopping cart and checkout"
```

### Step 9: Merge Pull Request

1. Wait for PR approval (from client or yourself)
2. Click "Merge pull request" on GitHub
3. Delete the branch (optional but recommended)

### Step 10: Vercel Deploys to Production 🚀

**This happens automatically when you merge to `main`!**

```bash
# Or via command line:
git checkout main
git pull
git branch -d feature/online-ordering  # Delete local branch
```

**Production Deployment:**
- Vercel detects `main` branch changed
- Builds and deploys automatically
- **Live site updated!**
- All users see the new feature

---

## 🛠️ Common Workflows

### Workflow 1: Quick Bug Fix

```bash
# 1. Create fix branch
git checkout -b fix/mobile-menu

# 2. Make the fix
# Edit files...
git add .
git commit -m "fix: mobile menu not closing"

# 3. Push and test
git push origin fix/mobile-menu
# Test on preview URL

# 4. Merge to main
# Create PR → Merge → Deployed!
```

### Workflow 2: Large Feature (Multiple Days)

```bash
# Day 1: Start feature
git checkout -b feature/reservation-system
# Work on it...
git add .
git commit -m "feat: add calendar component"
git push origin feature/reservation-system
# Preview available for testing

# Day 2: Continue work
# More commits...
git add .
git commit -m "feat: add time slot selection"
git push origin feature/reservation-system
# Preview updates automatically

# Day 3: Client testing
# Share preview URL with client
# Get feedback

# Day 4: Make fixes
git add .
git commit -m "fix: adjust time slots based on feedback"
git push origin feature/reservation-system
# Preview updates

# Day 5: Final approval and merge
# Create PR → Merge → Deployed!
```

### Workflow 3: Multiple Features at Once

```bash
# You can have multiple branches being developed simultaneously:

# Branch 1: Online ordering
git checkout -b feature/online-ordering
git push origin feature/online-ordering
# Preview: greek-souvlaki-website-abc123.vercel.app

# Branch 2: Table reservations
git checkout -b feature/reservations
git push origin feature/reservations
# Preview: greek-souvlaki-website-def456.vercel.app

# Branch 3: Blog section
git checkout -b feature/blog
git push origin feature/blog
# Preview: greek-souvlaki-website-ghi789.vercel.app

# Each branch has its own preview URL
# None affect the live site
# Merge them in any order when ready!
```

---

## 🚨 Emergency Fixes (Hotfixes)

If you need to fix something critical on the live site **immediately**:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# 2. Make the fix
git add .
git commit -m "hotfix: patch security vulnerability"

# 3. Push and merge immediately
git push origin hotfix/critical-security-fix
# Create PR → Merge → Deployed within minutes!

# 4. Sync other branches later
git checkout main
git pull
git checkout feature/some-other-feature
git merge main
# Now your other feature has the fix too
```

---

## 📋 Branch Naming Convention

Use these prefixes for clarity:

| Prefix | Usage | Example |
|--------|-------|---------|
| `feature/` | New features | `feature/online-ordering` |
| `fix/` | Bug fixes | `fix/mobile-menu-bug` |
| `hotfix/` | Urgent production fixes | `hotfix/security-patch` |
| `refactor/` | Code refactoring | `refactor/menu-component` |
| `perf/` | Performance improvements | `perf/image-optimization` |
| `docs/` | Documentation updates | `docs/update-readme` |
| `style/` | Code style changes | `style/formatting` |
| `test/` | Adding tests | `test/menu-tests` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |

---

## 🔄 Git Commands Reference

### Branch Management
```bash
# Create new branch
git checkout -b feature/name

# Switch to existing branch
git checkout feature/name

# See all branches
git branch -a

# Delete local branch
git branch -d feature/name

# Delete remote branch
git push origin --delete feature/name

# Rename branch
git branch -m old-name new-name
```

### Syncing
```bash
# Update local main from remote
git checkout main
git pull origin main

# Update feature branch with latest from main
git checkout feature/name
git merge main

# Push to remote
git push origin feature/name
```

### Commit History
```bash
# See commit history
git log --oneline --graph --all

# See changes in last commit
git show HEAD

# See uncommitted changes
git diff

# Undo last commit (keep changes)
git reset HEAD~1
```

---

## 🌐 Vercel Deployment URLs

### Production
- **URL**: `greek-souvlaki-website.vercel.app`
- **Branch**: `main`
- **Updates**: Every time you push to `main`

### Previews
- **URL Pattern**: `greek-souvlaki-website-[random].vercel.app`
- **Branch**: All branches except `main`
- **Updates**: Every time you push to the branch
- **Lifetime**: Preview URLs stay active for branch lifetime

### Finding Preview URLs

**Option 1: Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments"
4. Find your branch deployment
5. Click "Visit" to see preview URL

**Option 2: GitHub**
1. Go to your repository on GitHub
2. Click the "🔍 Checks" tab (or "Actions")
3. Find the deployment status
4. Click "Details" to see preview URL

**Option 3: Terminal**
```bash
# After pushing, Vercel CLI shows the URL
vercel --prod
```

---

## ✅ Best Practices

### ✅ DO
- Always create a branch for new work
- Test thoroughly on preview URL
- Share preview URL with client before merging
- Write clear commit messages
- Delete merged branches (keeps things clean)
- Pull latest `main` before starting new feature
- Use descriptive branch names

### ❌ DON'T
- Never work directly on `main` branch
- Never merge untested code to `main`
- Never skip preview testing
- Never commit sensitive data (API keys, passwords)
- Never force push to `main` unless absolutely necessary
- Don't keep old branches around (delete when done)

---

## 📞 Troubleshooting

### Issue: Preview URL not working
**Solution:**
1. Check Vercel dashboard for build errors
2. Fix errors and push again
3. Preview URL updates automatically

### Issue: Merge conflict
**Solution:**
```bash
# 1. Pull latest main
git checkout main
git pull origin main

# 2. Go back to your branch
git checkout feature/name

# 3. Merge main into your branch
git merge main

# 4. Fix conflicts manually
# Edit files, remove conflict markers

# 5. Commit the merge
git add .
git commit -m "merge: resolve conflicts with main"

# 6. Push
git push origin feature/name
```

### Issue: Wrong code deployed to production
**Solution:**
```bash
# 1. Revert the merge (create revert commit)
git revert HEAD

# 2. Push immediately
git push origin main

# 3. Vercel will redeploy previous version
```

---

## 📊 Workflow Summary

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   DEVELOPMENT BRANCHES          PRODUCTION (main)            │
│                                                              │
│   feature/online-ordering                                    │
│   fix/mobile-bug                  ↓                           │
│   feature/reservations          MERGE                         │
│   feature/blog                     ↓                         │
│                                     ↓                        │
│                              PRODUCTION                      │
│                           All Users See This                │
│                                                              │
│   Each branch = Preview URL     main = Live Site             │
│   Safe to test!                 Only tested code!            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎓 Learning Resources

- **Git Branching**: https://git-scm.com/book/en/v2/Git-Branching-Branches-and-Revisions
- **Vercel Git Integration**: https://vercel.com/docs/concepts/git
- **Pull Requests**: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests

---

<div align="center">

**🔄 Keep the live site safe - Test on previews first!**

**🌐 main = Production | 🔀 branches = Previews**

</div>
