## 🌐 Frontend

**Framework**: React Native
**Key Features:**

* Splash + Welcome Screen
* Login / Sign Up / Guest Access
* Home Dashboard (central hub with cards)
* My Garden: add/view plants
* Reminders & To-Do management
* Plant Library with filtering
* Journal: mood + notes + plant-linked entries
* Gardening Tips & FAQs
* Voice Commands UI
* Profile & Settings (font, theme, notifications)

### 🔄 Navigation Flow Summary

1. **Splash Screen** → auto-transitions to → Login/Signup/Guest
2. **Login/Signup** → leads to → Home Dashboard
3. **Dashboard Cards** navigate to:

   * 🪴 *My Garden*
   * ✅ *Reminders / To-Do*
   * 🌿 *Plant Library / Favorites*
   * 📓 *Journal*
   * 💡 *Gardening Tips / Help*
   * ⚙ *Settings*
4. Profile icon (top-right) leads to → Profile Page
5. Each section supports CRUD operations, filtering, and multimedia inputs.

---

## ✅ Getting Started

### Frontend:

```bash
npm install
npm run dev
```