# Portal Implementation Guide

## 1. File Structure
The portal consists of static, production-ready files designed for zero-backend static hosting (GitHub Pages, Netlify, Vercel, or institutional Apache/Nginx web servers):

```
ATAL-FDP-Program/
│
├── index.html                     # Public-facing single-page portal with schedule & Teams links
├── assets/
│   └── aicte-logo.png             # Official AICTE emblem
├── admin/
│   └── attendance.html            # Coordinator attendance intelligence & Teams CSV parser
├── atal_fdp_program_overview.md   # Program metadata, resource persons & curriculum
├── portal_architecture.md         # System design & architectural overview
└── implementation_guide.md        # Technical implementation & configuration reference
```

---

## 2. Dynamic MS Teams Live Session Configuration

### A. Configuring Teams Meeting Links
Inside `index.html`, meeting links are defined globally and per-day in the `SCHEDULE` array:

```javascript
// Default fallback link for all days
const DEFAULT_TEAMS_URL = 'https://teams.microsoft.com/l/meetup-join/...';

// To assign unique MS Teams links per day:
const SCHEDULE = [
    { day: 1, date: '2026-12-14', theme: 'Foundations of AI', teamsUrl: 'https://teams.microsoft.com/...day1', sessions: [...] },
    { day: 2, date: '2026-12-15', theme: 'Explainable & Trustworthy AI', teamsUrl: 'https://teams.microsoft.com/...day2', sessions: [...] },
    // ...
];
```

### B. Session Timing & 15-Minute Activation Logic
The schedule automatically monitors the client's current time converted to Indian Standard Time (IST, `+05:30`):

* **Days 1 to 5:** 6:00 PM to 9:30 PM IST (18:00 – 21:30 IST)
  * Meeting link activates at **5:45 PM IST (17:45 IST)** (15 minutes early).
* **Day 6:** 2:00 PM to 7:30 PM IST (14:00 – 19:30 IST)
  * Meeting link activates at **1:45 PM IST (13:45 IST)** (15 minutes early).

**Preview / Testing Mode:** Coordinators can preview the live button state anytime by appending `?live=true` or `?preview=live` to the URL.

---

## 3. Coordinator Attendance Dashboard (`/admin/attendance.html`)

### A. How to Export Attendance from Microsoft Teams
1. During or after the live meeting in Microsoft Teams, open the **People / Participants** panel.
2. Click the **More actions (...)** menu in the top right of the panel.
3. Select **Download attendance list** (or navigate to Meeting Details > Attendance tab).
4. Save the generated `.csv` report.

### B. Uploading & Processing Attendance Reports
1. Navigate to `/admin/attendance.html` in your browser.
2. Drag and drop the Teams `.csv` file into the upload area (or click **Browse**).
3. The client-side parser automatically:
   * Detects UTF-16LE or UTF-8 character encoding with BOM.
   * Extracts participants from standard and modern Teams formats (with or without `2. Attendees` summary blocks).
   * Parses duration formats such as `3h 44m`, `1h 15m`, `45m`, `01:45:00`, or raw minutes.
   * **Deduplicates multiple reconnections:** Participants who disconnected and reconnected are grouped by lowercase email, and their durations are combined.
4. **Select Session Target:**
   * Click **Days 1–5 (210m)** for standard weekday sessions (80% benchmark = 168 mins).
   * Click **Day 6 (330m)** for the final day synthesis (80% benchmark = 264 mins).
   * Or enter a custom duration in minutes.
5. Review KPIs, doughnut breakdown chart, duration distribution bar chart, and the sortable attendee table.
6. Click **Export Cleaned CSV** to download a finalized spreadsheet ready for AICTE ATAL portal submission.

---

## 4. LMS Examination Portal & Gradebook

### A. Candidate Assessment Interface (`/lms/exam.html`)
* **Verification Gate:** Candidate inputs Full Name, Registered Email, and Institution.
* **Proctoring Engine:** Continuously tracks tab switching and window focus changes. Alerts the candidate and logs violations.
* **Exam Engine:** Features a 60-minute countdown clock, an interactive question status palette (Answered, For Review, Unvisited), and instant grading against the AICTE 60% mark.
* **Provisional Scorecard:** Candidates receive instant feedback and a printable score card upon test submission.

### B. Updating the Question Bank
The questions are defined cleanly in `lms/exam.html` under the `const QUESTIONS = [...]` array. Each question follows this standard JSON structure:

```javascript
{
    id: 1,
    module: 'Module Name',
    question: 'Question text here?',
    options: [
        'Option A text',
        'Option B text',
        'Option C text',
        'Option D text'
    ],
    correct: 0 // Index of correct option (0 = A, 1 = B, 2 = C, 3 = D)
}
```
Whenever you are ready with your final question bank, simply replace the contents of the `QUESTIONS` array in `lms/exam.html`.

### C. Coordinator Exam Gradebook (`/admin/exam-analytics.html`)
* Automatically syncs with student submissions from `lms/exam.html`.
* Displays candidate scores, passing status (≥ 60%), and proctoring alert counts.
* Provides **"Export Cleaned Results CSV"** to generate the final assessment report for the AICTE ATAL portal.

---

## 5. Deployment Instructions
1. Commit and push the repository to GitHub:
   ```bash
   git add .
   git commit -m "Add MS Teams live integration, attendance dashboard, and LMS exam portal"
   git push origin main
   ```
2. Enable **GitHub Pages** under repository **Settings > Pages > Branch: `main` / `root`**.
3. Access:
   * Public portal: `https://<username>.github.io/<repo>/`
   * Online Exam portal: `https://<username>.github.io/<repo>/lms/exam.html`
   * Attendance analytics: `https://<username>.github.io/<repo>/admin/attendance.html`
   * Exam Gradebook: `https://<username>.github.io/<repo>/admin/exam-analytics.html`
