# 🌌 A P I . A U R A
> **The Stormy Morning Dashboard.** A high-fidelity, 3-dimensional monitoring suite for mission-critical endpoints.

---

### ⌈ THE PHILOSOPHY ⌋
Most monitors are spreadsheets in disguise. **API Aura** is a workspace. It treats endpoints as physical objects—tactile, movable, and interactive. Built with the **Stormy Morning** design system, it’s designed to be open on a vertical monitor while you work, providing a calm but constant heartbeat of your distributed systems.

### ⌈ CORE ARCHITECTURE ⌋
| Component | Tech | Purpose |
| :--- | :--- | :--- |
| **Engine** | `Astro + React` | Island architecture for zero-lag UI. |
| **Logic** | `TypeScript` | Verbatim type safety for endpoint streams. |
| **Aesthetics** | `Tailwind v4` | Modern CSS variables & 3D perspectives. |
| **Interactivity**| `dnd-kit` | Frictionless drag-and-drop workspace reordering. |

---

### ⌈ FUNCTIONAL CAPABILITIES ⌋

**01. TACTILE INTERFACE**
Cards aren't just divs. They exist in 3D space. Flip them to reveal raw endpoint data, or drag them to prioritize your stack. The `perspective-1000` CSS engine ensures every movement feels weighted and intentional.

**02. THE HEARTBEAT**
A non-blocking polling system that monitors latency in real-time. Each card pulses with a "Stormy" glow—Green for healthy, Red for critical—giving you an instant "vibe check" of your entire infrastructure.

**03. PERSISTENT WORKSPACE**
Your layout is your own. Using custom `localStorage` synchronization, your pins, reorders, and API lists persist across sessions. 

**04. DATA PORTABILITY**
Export your entire monitoring configuration as a `.json` backup. Import it on a new machine. No backend required, no data leakage—your endpoints stay in your browser.

---

### ⌈ SETUP THE VOID ⌋

```bash
# Clone the aura
git clone [https://github.com/your-username/api-aura.git](https://github.com/your-username/api-aura.git)

# Initialize dependencies
npm install

# Invoke the development server
npm run dev
