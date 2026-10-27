# Portal Architecture & System Design

## 1. System Overview
The ATAL FDP Web Portal is built as a high-performance, single-page responsive web application designed for faculty members, research scholars, and industry professionals. It provides immediate access to schedule timelines, speaker credentials, and registration links.

## 2. Technical Stack
* **Markup & Structure:** HTML5 (Semantic markup adhering to web accessibility standards)
* **Styling Framework:** Tailwind CSS (Utility-first CSS via CDN for rapid styling, responsive grid systems, and smooth animations)
* **Icons:** FontAwesome 6.4.0 (Vector icons for intuitive visual cues)
* **Typography:** Google Fonts (Inter font family for clean, professional academic typography)
* **Interactivity:** Vanilla JavaScript (ES6+) for dynamic day-switching tabs and responsive mobile navigation drawers.

## 3. Component Architecture
```
[ Client Browser / Mobile Device ]
       │
       ▼
[ Header & Sticky Navigation ]
       │
       ├─► Hero Banner (Key Metadata & CTA)
       ├─► About Section (LBRCE & FDP Objectives)
       ├─► Key Topics Grid (AI/ML, XAI, Materials, Drones)
       ├─► Distinguished Speakers Showcase (9 Experts)
       ├─► Interactive Schedule (Day 1 to Day 6 Tabs)
       ├─► Contact & Coordinators Section
       └─► Footer & Copyright
```

## 4. Responsive Design Strategy
* **Mobile-First Breakpoints:** Optimized for small mobile viewports (`sm`), tablets (`md`), and desktop workstations (`lg`).
* **Dynamic Content Toggle:** JavaScript state handlers (`switchDay(dayNum)`) dynamically filter and display session timelines without page reloads.