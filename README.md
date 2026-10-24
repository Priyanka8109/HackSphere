# HackSphere — Experiments 1 & 2

A clean, responsive, and interactive Hackathon Management & Collaboration Platform built with **React** and **Tailwind CSS**.

---

## 📌 Syllabus & Experiments Mapping

| Exp No. | Experiment Title | Project Milestone | Implementation Details |
| :--- | :--- | :--- | :--- |
| **Exp 1** | **Build responsive and interactive UIs using Tailwind CSS** | Design responsive frontend pages (Home, Login, Dashboard) | Built clean, high-contrast, responsive **Home**, **Login**, and **Dashboard** pages with mobile drawers, clean cards, and responsive grids. |
| **Exp 2** | **React Hooks** | Implement forms, data fetching, and reusable custom hooks | Built reusable custom hooks (`useFetch`, `useForm`, `useLocalStorage`, `useDebounce`), interactive forms with validation, and simulated data fetching with loading/error states. |

---

## 📁 Project Structure

```
Mini Project/
├── index.html                   # HTML Entry Point
├── package.json                 # React 18, React Router v6, Tailwind CSS, Lucide React
├── tailwind.config.js           # Clean, accessible theme configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite build configuration
├── src/
│   ├── hooks/                   # [Exp 2] Reusable Custom Hooks
│   │   ├── useFetch.js          # Async data fetching hook (loading, error, refetch)
│   │   ├── useForm.js           # Reusable form hook (values, errors, validation, submit)
│   │   ├── useLocalStorage.js   # LocalStorage synchronization hook
│   │   └── useDebounce.js       # Value debounce hook for search inputs
│   │
│   ├── data/
│   │   └── mockData.js          # Realistic mock data and async fetch simulators
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx       # Responsive navbar with mobile hamburger menu
│   │   │   ├── Footer.jsx       # Clean footer with quick links & info
│   │   │   ├── Button.jsx       # Reusable button component
│   │   │   └── LoadingSpinner.jsx # [Exp 2] Reusable data fetching loading spinner
│   │   ├── home/
│   │   │   ├── Hero.jsx         # Clean hero section with search filter
│   │   │   ├── HackathonCard.jsx # Card with interactive details modal
│   │   │   ├── HowItWorks.jsx   # 4-step workflow cards
│   │   │   ├── FeatureCard.jsx  # 6 capability cards
│   │   │   └── CallToAction.jsx # Call to action banner
│   │   └── dashboard/
│   │       ├── DashboardSidebar.jsx # Clean desktop sidebar & mobile drawer
│   │       ├── StatCard.jsx     # 4 clean metric cards with progress bars
│   │       ├── TeamSection.jsx  # Team Alpha roster & status
│   │       ├── TaskSection.jsx  # Interactive task checklist with hooks
│   │       ├── ProjectSubmitModal.jsx # [Exp 2] Form with useForm hook
│   │       ├── DeadlineCard.jsx # Deadline & submission status
│   │       └── AnnouncementList.jsx # Live announcements stream
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Home Page with search filter (useDebounce, useMemo)
│   │   ├── Login.jsx            # Login Page with validation (useForm, useLocalStorage)
│   │   └── Dashboard.jsx        # Participant Dashboard (useFetch, useState)
│   │
│   ├── App.jsx                  # Main router (/, /login, /dashboard)
│   ├── main.jsx                 # React root mount
│   └── index.css                # Tailwind directives & base styles
```

---

## 💡 React Hooks Demonstrated (Experiment 2)

1. **`useFetch` (Custom Hook):**
   - Asynchronously loads hackathons and dashboard announcements with loading spinners, error boundaries, and refresh controls.
2. **`useForm` (Custom Hook):**
   - Powers the **Login Form** and **Project Submission Form** with real-time field validation, error messages, and controlled submissions.
3. **`useLocalStorage` (Custom Hook):**
   - Persists user preferences and login session.
4. **`useDebounce` (Custom Hook):**
   - Debounces the search input on the Home page to optimize search filtering.
5. **Built-in Hooks:**
   - `useState` for component state management (task status, mobile menu, modals).
   - `useEffect` for data fetching lifecycle and cleanups.
   - `useMemo` for filtering hackathons and computing task completion ratios.
   - `useCallback` for memoized event callbacks.

---

## 🚀 How to Run the Project

1. Open your terminal in the project directory:
   ```bash
   cd "C:\Users\Priyanka\OneDrive\Desktop\Mini Project"
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to **`http://localhost:5173`**.
