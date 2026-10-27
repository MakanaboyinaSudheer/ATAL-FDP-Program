# Portal Implementation Guide

## 1. File Structure
The entire application is self-contained within a single production-ready HTML file (`atal_fdp_portal.html`) to ensure seamless deployment on static hosting platforms (GitHub Pages, Netlify, Vercel, or institutional servers).

## 2. Key Code Modules

### A. Tailwind CSS Integration & Customization
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    brand: {
                        50: '#eef2ff',
                        600: '#4f46e5',
                        700: '#4338ca',
                    }
                }
            }
        }
    }
</script>
```

### B. Interactive Schedule Tab Controller (JavaScript)
The script manages day-by-day session visibility:
```javascript
function switchDay(dayNum) {
    // Highlights active tab and toggles session container visibility
    const tabs = document.querySelectorAll('.day-tab');
    tabs.forEach(tab => {
        if(tab.getAttribute('data-day') == dayNum) {
            tab.className = "day-tab px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-600 text-white shadow-md transition-all";
        } else {
            tab.className = "day-tab px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all";
        }
    });

    document.querySelectorAll('.day-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`day-${dayNum}-content`).classList.remove('hidden');
}
```

## 3. Deployment Steps
1. Save the generated portal code as `index.html`.
2. Upload the file to any static web host or the institutional server managed by the Department of AI&DS at LBRCE.
3. Verify that registration buttons link correctly to `https://atalacademy.aicte-india.org`.