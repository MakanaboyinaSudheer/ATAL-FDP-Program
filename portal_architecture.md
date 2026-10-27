# Portal Architecture & System Design

## 1. System Overview
The ATAL FDP Web Portal is built as a high-performance, single-page responsive web application designed for faculty members, research scholars, and industry professionals. It provides immediate access to schedule timelines, speaker credentials, official registration links, dynamic Microsoft Teams live classroom access, and a dedicated client-side attendance analytics dashboard for program coordinators.

## 2. Technical Stack
* **Markup & Structure:** HTML5 (Semantic markup adhering to web accessibility standards)
* **Styling Framework:** Tailwind CSS (Utility-first CSS via CDN for rapid styling, responsive grid systems, and smooth animations)
* **Icons:** FontAwesome 6.4.0 (Vector icons for intuitive visual cues)
* **Typography:** Google Fonts (Inter font family for clean, professional academic typography; JetBrains Mono for metrics)
* **Client-Side Libraries:**
  * **PapaParse 5.4.1 (CDN):** High-performance in-browser CSV parsing supporting UTF-16LE, UTF-8 BOM, and tab/comma separation.
  * **Chart.js 4.x (CDN):** Responsive canvas-based data visualizations for attendance eligibility and duration distribution.
* **Interactivity:** Vanilla JavaScript (ES6+) for dynamic day-switching tabs, IST-based session status calculation, and attendance aggregation.

## 3. Component Architecture
```
[ Client Browser / Mobile Device ]
       │
       ▼
[ Header & Sticky Navigation ] (With Attendance Portal quick-access)
       │
       ├─► Hero Banner (Key Metadata, CTA & Real-Time Countdown)
       ├─► About Section (LBRCE & FDP Objectives)
       ├─► Key Topics Grid (AI/ML, XAI, Materials, Drones)
       ├─► Distinguished Speakers Showcase (9 Experts with search & filters)
       ├─► Interactive Schedule (Day 1 to Day 6 Tabs)
       │     └─► MS Teams Live Session Action Card
       │           ├─► Client IST status checker (Pulsing "Live Now" / Inactive)
       │           ├─► 15-minute pre-session link activation
       │           └─► AICTE ATAL 80% attendance compliance notice
       ├─► Registration Section (Official AICTE ATAL Academy portal)
       ├─► FAQ Accordion
       ├─► Contact & Coordinators Section (Includes Attendance Dashboard tool card)
       └─► Footer & Copyright
       
[ Coordinator Portal: /admin/attendance.html ] (100% Client-Side)
       │
       ├─► Drag & Drop Teams Attendance CSV Ingestion (UTF-16LE / UTF-8)
       ├─► Reconnection Aggregator (Groups by lowercase email, sums total minutes)
       ├─► Target Duration & AICTE ATAL 80% Threshold Evaluator
       ├─► KPI Cards (Total Unique, Qualified Count, Avg Duration, Rate)
       ├─► Chart.js Visualizations (Eligibility Doughnut & Duration Bar Chart)
       ├─► Searchable & Sortable Participant Table with Badges
       └─► Cleaned CSV Export (With UTF-8 BOM for Microsoft Excel)

[ Candidate LMS Exam Portal: /lms/exam.html ]
       │
       ├─► Candidate Verification Gate (Name, Email, Institution, App No.)
       ├─► 60-Minute Countdown Clock (Auto-submits on 00:00)
       ├─► Proctoring Integrity Engine (Tab-switch tracking & alerts, fullscreen)
       ├─► 20 Curriculum-Aligned MCQs (AI/ML, XAI, Materials, GNNs, UAVs)
       ├─► Interactive Question Palette (Answered, Review, Unvisited)
       └─► Instant Result Screen (Score, Pass ≥ 60%, Printable Scorecard)

[ Coordinator Exam Gradebook: /admin/exam-analytics.html ]
       │
       ├─► Real-time Candidate Submissions Monitor
       ├─► Pass/Fail Ratio & Score Histogram Charts (Chart.js)
       ├─► Proctoring Violation Flagging (>2 tab switches)
       └─► Final Gradebook Export (Cleaned CSV for AICTE ATAL Submission)
```

## 4. Key Attendance Subsystems

### A. Dynamic MS Teams Session Status Checker (`#schedule`)
* **Timing Windows:** Days 1–5 (6:00 PM – 9:30 PM IST) and Day 6 (2:00 PM – 7:30 PM IST).
* **Early Activation:** Automatically enables the "Join Live Session (MS Teams)" button 15 minutes before session start (17:45 IST on Days 1–5, 13:45 IST on Day 6).
* **Status States:**
  * `Live Now`: Pulsing green indicator, active one-click join button to Microsoft Teams.
  * `Upcoming`: Disabled button with activation notice: *"Meeting link activates 15 minutes before session start."*
  * `Completed`: Disabled button with session completed indicator.
* **Compliance Notice:** Displays mandatory reminder regarding exact name/email match with the AICTE ATAL portal for attendance recording.

### B. Client-Side Teams Attendance CSV Intelligence (`/admin/attendance.html`)
* **Privacy-First:** Operates 100% client-side with no server uploads.
* **Encoding Detection:** Handles Teams Windows exports (UTF-16LE with BOM `0xFF 0xFE` or UTF-8 with BOM).
* **Reconnection Handling:** Automatically aggregates multiple join/leave entries for participants who experienced disconnections.
* **AICTE ATAL Certification Standard:** Evaluates whether total duration meets $\ge 80\%$ of the target session length (e.g. 168 mins for 210-min sessions; 264 mins for 330-min sessions).

## 5. LMS Examination & Gradebook Architecture

### A. Candidate Assessment Portal (`/lms/exam.html`)
* **60-Minute Clock:** Client-side countdown with automated submission upon expiration.
* **Proctoring Engine:** Hooks into `visibilitychange` and window focus events. Any tab switch immediately triggers a security warning banner and logs the violation in the submission metadata.
* **Question Bank Mapping:** 20 MCQs structured across the 5 technical thrust areas. Includes interactive review flags, clear response options, and color-coded status palette.
* **Scoring & Certification Threshold:** Instant grading with AICTE standard $\ge 60\%$ passing requirement. Generates a printable provisional assessment scorecard.

### B. Coordinator Gradebook & Analytics (`/admin/exam-analytics.html`)
* **Consolidated Submissions View:** Real-time gradebook showing candidate scores, percentages, pass/fail status, and proctoring alert counts.
* **Analytics Visualizations:** Chart.js doughnut chart for pass/fail ratio and histogram for score distribution brackets.
* **Master CSV Export:** Exports a final gradebook spreadsheet ready for official submission to the AICTE ATAL Academy.
* **Encoding Detection:** Handles Teams Windows exports (UTF-16LE with BOM `0xFF 0xFE` or UTF-8 with BOM).
* **Reconnection Handling:** Automatically aggregates multiple join/leave entries for participants who experienced disconnections.
* **AICTE ATAL Certification Standard:** Evaluates whether total duration meets $\ge 80\%$ of the target session length (e.g. 168 mins for 210-min sessions; 264 mins for 330-min sessions).
