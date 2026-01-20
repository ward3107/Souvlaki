# ⚡ Quick Reference - Branch Workflow

**Print this and keep it handy!**

---

## 🚀 EVERY CHANGE - Same Workflow

```bash
# 1. Start new work
git checkout main
git pull
git checkout -b feature/name

# 2. Do work & commit
git add .
git commit -m "fix: what you fixed"
git push origin feature/name

# 3. Test on preview URL
# (Check GitHub/Vercel for preview link)

# 4. Merge when ready
# (Go to GitHub → Pull Requests → Merge)
```

---

## 📋 Branch Names

| Type       | Use           | Example                |
| ---------- | ------------- | ---------------------- |
| `fix/`     | Bug fixes     | `fix/mobile-menu`      |
| `feature/` | New features  | `feature/reservations` |
| `hotfix/`  | Urgent fixes  | `hotfix/critical-bug`  |
| `chore/`   | Small updates | `chore/update-text`    |

---

## ✅ Pre-Merge Checklist

- [ ] Tested on preview URL
- [ ] Desktop browsers OK
- [ ] Mobile devices OK
- [ ] All 5 languages OK
- [ ] No console errors
- [ ] Client approved (if needed)

---

## 🚨 NEVER DO THIS

```bash
❌ git checkout main
❌ (make changes)
❌ git push origin main
```

---

## ✅ ALWAYS DO THIS

```bash
✅ git checkout -b feature/name
✅ (make changes)
✅ git push origin feature/name
✅ (test on preview)
✅ (merge when ready)
```

---

## 🌐 URLs

- **GitHub**: https://github.com/ward3107/Souvlaki
- **Vercel**: https://vercel.com/dashboard
- **Live Site**: https://greek-souvlaki-website.vercel.app

---

## 📞 If Something Breaks

```bash
# Emergency rollback
git revert HEAD
git push origin main
```

---

<div align="center">

**Remember: Test on Preview → Then Merge**

**Preview URL = Safe Testing Ground**

**Main Branch = Live Site (Users see this)**

</div>
