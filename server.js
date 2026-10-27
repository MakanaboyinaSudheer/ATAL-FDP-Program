const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);
const DATA_DIR = path.join(ROOT, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // ================= API ENDPOINTS FOR PERSISTENCE =================
    // 1. Save candidate exam submission (POST)
    if (pathname === '/api/exam/submit' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const record = JSON.parse(body);
          const dataFile = path.join(DATA_DIR, 'exam_submissions.json');
          let list = [];
          if (fs.existsSync(dataFile)) {
            list = JSON.parse(fs.readFileSync(dataFile, 'utf8') || '[]');
          }
          const existingIdx = list.findIndex(s => s.email && record.email && s.email.toLowerCase() === record.email.toLowerCase());
          if (existingIdx >= 0) {
            list[existingIdx] = record;
          } else {
            list.push(record);
          }
          fs.writeFileSync(dataFile, JSON.stringify(list, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          return res.end(JSON.stringify({ success: true, count: list.length, id: record.id }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // 2. Get all saved exam submissions (GET)
    if (pathname === '/api/exam/results' && req.method === 'GET') {
      const dataFile = path.join(DATA_DIR, 'exam_submissions.json');
      let list = [];
      if (fs.existsSync(dataFile)) {
        list = JSON.parse(fs.readFileSync(dataFile, 'utf8') || '[]');
      }
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({ success: true, submissions: list }));
    }

    // 3. Save daily attendance records (POST)
    if (pathname === '/api/attendance/save' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body); // { day: 1..6, date: '2026-12-14', attendees: [...] }
          const dayNum = payload.day || 1;
          const dataFile = path.join(DATA_DIR, `attendance_day${dayNum}.json`);
          fs.writeFileSync(dataFile, JSON.stringify(payload, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          return res.end(JSON.stringify({ success: true, day: dayNum, count: payload.attendees ? payload.attendees.length : 0 }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // 4. Get all days attendance (GET)
    if (pathname === '/api/attendance/all' && req.method === 'GET') {
      const allDays = {};
      for (let d = 1; d <= 6; d++) {
        const file = path.join(DATA_DIR, `attendance_day${d}.json`);
        if (fs.existsSync(file)) {
          allDays[`day${d}`] = JSON.parse(fs.readFileSync(file, 'utf8') || '{}');
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({ success: true, days: allDays }));
    }

    // ================= STATIC FILE SERVING =================
    if (pathname === '/') pathname = '/index.html';
    let filePath = path.join(ROOT, pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('403 Forbidden');
    }

    // Check directory index
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          return res.end(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h2>404 - Page Not Found</h2>
              <p>The requested URL <code>${pathname}</code> was not found on this server.</p>
              <p style="margin-top: 20px;">
                <a href="/index.html" style="color: #4f46e5; text-decoration: underline; margin-right: 15px;">Main Public Portal</a>
                <a href="/lms/exam.html" style="color: #4f46e5; text-decoration: underline; margin-right: 15px;">Exam Portal</a>
                <a href="/admin/attendance.html" style="color: #4f46e5; text-decoration: underline;">Attendance Dashboard</a>
              </p>
            </div>
          `);
        }
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end(`Server Error: ${err.message}`);
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Internal Error: ${err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`ATAL FDP local server is running!`);
  console.log(`Main Portal:          http://localhost:${PORT}/index.html`);
  console.log(`Candidate LMS Exam:   http://localhost:${PORT}/lms/exam.html`);
  console.log(`Attendance Dashboard: http://localhost:${PORT}/admin/attendance.html`);
  console.log(`Exam Gradebook:       http://localhost:${PORT}/admin/exam-analytics.html`);
  console.log(`Final Certification: http://localhost:${PORT}/admin/final-certification.html`);
});
