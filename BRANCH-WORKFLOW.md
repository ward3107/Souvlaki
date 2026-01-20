# 🚀 Production Branch Workflow

**STRICT RULES for a live app with active users**

---

## 🚨 GOLDEN RULE

```
NEVER work directly on main branch!
EVERYTHING must be tested on a branch first!
```

---

## 📋 Mandatory Workflow

### For EVERY Change (Bug Fix, Feature, Update)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. Create Branch                                              │
│     git checkout -b fix/issue-name                             │
│     or                                                         │
│     git checkout -b feature/new-feature                        │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  2. Make Changes & Commit                                      │
│     git add .                                                   │
│     git commit -m "fix: describe the fix"                      │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  3. Push to GitHub                                             │
│     git push origin fix/issue-name                              │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  4. Vercel Creates PREVIEW URL                                 │
│     🌐 greek-souvlaki-website-xyz123.vercel.app                │
│     TEST EVERYTHING HERE                                        │
│     Users still see the old, working version                   │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  5. Test Thoroughly                                            │
│     ✓ Desktop browsers                                         │
│     ✓ Mobile devices                                           │
│     ✓ All languages (HE, AR, RU, EL, EN)                       │
│     ✓ All features related to change                           │
│     ✓ Check for new bugs                                       │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  6. Create Pull Request                                        │
│     Go to GitHub → Create PR                                    │
│     Describe what you changed                                  │
│     List what you tested                                       │
│                                                                 │
│     ↓                                                           │
│                                                                 │
│  7. Merge to Main                                              │
│     Click "Merge Pull Request"                                 │
│     Vercel automatically deploys to PRODUCTION                  │
│     Users now see the update!                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Commands

### Quick Reference Card

```bash
# === START NEW WORK ===
git checkout main                # 1. Switch to main
git pull                        # 2. Get latest changes
git checkout -b fix/name         # 3. Create branch
# OR: git checkout -b feature/name

# === DO YOUR WORK ===
# Make changes to files...
git add .                       # 4. Stage changes
git commit -m "fix: description" # 5. Commit
git push origin fix/name        # 6. Push to GitHub

# === TEST ON PREVIEW ===
# Check GitHub/Vercel for preview URL
# Test thoroughly!

# === DEPLOY TO PRODUCTION ===
# Go to GitHub, create PR, merge when ready
```

---

## 🎯 Real Examples

### Example 1: Quick Bug Fix

```bash
# Scenario: WhatsApp button has wrong number

# 1. Create branch
git checkout main
git pull
git checkout -b fix/whatsapp-number

# 2. Fix the issue
# Edit App.tsx, change phone number

# 3. Commit and push
git add App.tsx
git commit -m "fix: update WhatsApp number to correct value"
git push origin fix/whatsapp-number

# 4. Test on preview
# Preview: greek-souvlaki-website-abc123.vercel.app
# Test: Click WhatsApp button, verify number
# Test: Try on mobile device
# Test: All languages

# 5. Deploy if tests pass
# Go to GitHub → Pull Requests → Create PR
# Click "Merge Pull Request"
# Done! Live site updated
```

### Example 2: New Menu Item

```bash
# Scenario: Add new dish to menu

# 1. Create branch
git checkout main
git pull
git checkout -b feature/add-moussaka

# 2. Add the menu item
# Edit constants.ts, add new item
# Add image to public/gallery/

# 3. Test locally
npm run dev
# Verify new item appears
# Check all languages

# 4. Commit and push
git add .
git commit -m "feat: add moussaka to menu"
git push origin feature/add-moussaka

# 5. Test on preview URL
# Preview: greek-souvlaki-website-def456.vercel.app
# Checklist:
#   ✓ Item appears in menu
#   ✓ Price is correct
#   ✓ Image loads
#   ✓ All languages show correct name
#   ✓ Desktop view looks good
#   ✓ Mobile view looks good
#   ✓ 3D tilt effect works
#   ✓ No console errors

# 6. Get client approval if needed
# Share preview URL with client
# Wait for approval

# 7. Deploy
# Merge PR on GitHub
# Live site updated!
```

### Example 3: Text Content Update

```bash
# Scenario: Update restaurant description

# 1. Create branch
git checkout main
git pull
git checkout -b chore/update-description

# 2. Make changes
# Edit constants.ts, update description text

# 3. Test
git add .
git commit -m "chore: update restaurant description"
git push origin chore/update-description

# 4. Test on preview
# Check all languages show updated text
# Verify no formatting issues

# 5. Deploy
# Merge PR
```

### Example 4: Hotfix (Emergency Fix)

```bash
# Scenario: Critical bug that needs immediate fixing

# 1. Create hotfix branch
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 2. Quick fix
# Make minimal changes to fix issue

# 3. Push and merge immediately
git add .
git commit -m "hotfix: critical menu display bug"
git push origin hotfix/critical-bug

# 4. Create PR, merge, deploy
# Done within minutes!
```

---

## ✅ Testing Checklist

Before merging ANY branch to main, complete this checklist:

### Desktop Testing

- [ ] Chrome (latest version)
- [ ] Safari (if on Mac)
- [ ] Firefox (optional)
- [ ] Edge (optional)

### Mobile Testing

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Test on real device (not just emulator)

### Functionality Testing

- [ ] All language switching works (HE, AR, RU, EL, EN)
- [ ] RTL languages display correctly (HE, AR)
- [ ] All menu items visible
- [ ] WhatsApp button works
- [ ] Google Maps link works
- [ ] Facebook reviews load
- [ ] Opening hours display correctly
- [ ] Dark mode works
- [ ] 3D card effects work (desktop & mobile)
- [ ] Parallax scrolling works
- [ ] Smooth scrolling works
- [ ] No console errors

### Performance Testing

- [ ] Page loads quickly
- [ ] No visible lag/jank
- [ ] Images load properly
- [ ] No broken links

### Regression Testing

- [ ] Features that worked before still work
- [ ] Didn't break any existing functionality

---

## 🚫 What NOT To Do

### ❌ FORBIDDEN Actions

```bash
# ❌ NEVER work directly on main
git checkout main
# Make changes directly  ← DON'T DO THIS!
git push origin main

# ❌ NEVER skip testing
git push origin feature/name
# Immediately merge without testing  ← DON'T DO THIS!

# ❌ NEVER force push to main
git push origin main --force  ← VERY DANGEROUS!

# ❌ NEVER merge untested code
# Always test on preview URL first!
```

---

## 📊 Branch Naming Convention

Use these prefixes:

| Prefix      | When to Use             | Example                          |
| ----------- | ----------------------- | -------------------------------- |
| `fix/`      | Bug fixes               | `fix/mobile-menu-bug`            |
| `hotfix/`   | Urgent production fixes | `hotfix/critical-security-issue` |
| `feature/`  | New features            | `feature/online-ordering`        |
| `chore/`    | Minor updates           | `chore/update-phone-number`      |
| `refactor/` | Code refactoring        | `refactor/menu-component`        |
| `style/`    | Code style only         | `style/formatting`               |
| `docs/`     | Documentation           | `docs/update-readme`             |
| `perf/`     | Performance             | `perf/image-optimization`        |

---

## 🔍 Finding Preview URLs

### Option 1: Vercel Dashboard

```
1. Go to https://vercel.com/dashboard
2. Click "greek-souvlaki-website"
3. Click "Deployments"
4. Find your branch deployment
5. Click "Visit" to see preview URL
```

### Option 2: GitHub

```
1. Go to https://github.com/ward3107/Souvlaki
2. Click the "Checks" tab (or "Actions")
3. Find your branch
4. Click "Details"
5. See preview URL
```

### Option 3: Terminal

```bash
# After pushing, Vercel CLI shows URL
vercel list
```

---

## 🎯 Multiple Changes at Once

You can work on multiple features simultaneously:

```bash
# Branch 1: Online ordering
git checkout -b feature/online-ordering
git push origin feature/online-ordering
# Preview: greek-souvlaki-website-abc123.vercel.app

# Branch 2: Reservations
git checkout -b feature/reservations
git push origin feature/reservations
# Preview: greek-souvlaki-website-def456.vercel.app

# Branch 3: Blog
git checkout -b feature/blog
git push origin feature/blog
# Preview: greek-souvlaki-website-ghi789.vercel.app

# Each has its own preview URL
# Merge in any order when ready
# Live site unaffected until merge
```

---

## 📋 Daily Workflow Template

### Morning - Start New Work

```bash
# 1. Get latest main
git checkout main
git pull origin main

# 2. Create branch for today's work
git checkout -b feature/todays-work

# 3. Work and commit regularly
git add .
git commit -m "progress: made changes"
git push origin feature/todays-work

# 4. Test on preview URL throughout the day
```

### Evening - Deploy If Ready

```bash
# 1. Final test on preview
# Checklist completed ✓

# 2. Create PR on GitHub
# Go to GitHub → Pull Requests → New

# 3. Merge when ready
# Click "Merge Pull Request"

# 4. Clean up
git checkout main
git pull
git branch -d feature/todays-work
```

---

## 🚨 Emergency Rollback

If something breaks on production:

```bash
# 1. Identify the bad commit
git log --oneline

# 2. Revert it
git revert <commit-hash>

# 3. Push immediately
git push origin main

# 4. Vercel auto-deploys the fix
# Live site restored!
```

---

## 📞 Pre-Merge Checklist

Before clicking "Merge Pull Request":

**Testing:**

- [ ] Tested on preview URL
- [ ] Desktop browsers tested
- [ ] Mobile devices tested
- [ ] All languages tested
- [ ] No console errors
- [ ] No regressions

**Code Review:**

- [ ] Code is clean
- [ ] No console.log() left in
- [ ] No commented-out code
- [ ] No TODO comments (or documented)

**Client Approval (if needed):**

- [ ] Client has tested preview URL
- [ ] Client has approved changes
- [ ] Any feedback addressed

---

## 🎓 Best Practices

### ✅ DO

- Always create a branch for changes
- Test thoroughly on preview URL
- Write clear commit messages
- Delete branches after merging
- Pull latest main before starting work
- Use descriptive branch names

### ❌ DON'T

- Never work directly on main
- Never merge without testing
- Never skip preview testing
- Never force push to main
- Never commit secrets
- Never merge unreviewed code

---

## 🔄 Git Commands Quick Reference

```bash
# === BRANCH MANAGEMENT ===
# Create new branch
git checkout -b feature/name

# Switch to branch
git checkout feature/name

# See all branches
git branch -a

# Delete merged branch
git branch -d feature/name

# === SYNCING ===
# Get latest main
git checkout main
git pull origin main

# Update feature branch with main
git checkout feature/name
git merge main

# === COMMITTING ===
# See changes
git status
git diff

# Stage and commit
git add .
git commit -m "type: description"

# Push to remote
git push origin feature/name

# === HISTORY ===
# See commits
git log --oneline --graph --all

# See last commit
git show HEAD

# Undo last commit (keep changes)
git reset HEAD~1
```

---

## 📊 Workflow Summary

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   WORK IN PROGRESS           PRODUCTION (main)               │
│                                                              │
│   fix/issue-123                                            │
│   feature/new-thing         ← ONLY MERGE WHEN READY         │
│   chore/updates                                               │
│                                                              │
│   Each branch =                 ↓                            │
│   Safe testing area          ONLY TESTED CODE                │
│   Preview URL only            GOES TO USERS                  │
│                                                              │
│   main = UNTOUCHED            Users see working site         │
│   until merge!                Always!                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Your Daily Mantra

```
"CREATE BRANCH → TEST → MERGE"
"NEVER ON MAIN DIRECTLY"
"PREVIEW URL IS MY FRIEND"
"TEST FIRST, DEPLOY SECOND"
```

---

<div align="center">

**🚀 PRODUCTION BRANCH WORKFLOW**

**Every change = New branch = Preview URL = Test = Merge**

**Users never see broken code!**

**Always test on previews, deploy when ready!**

</div>
