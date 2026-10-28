// Initial Mock Data
let students = [
    { id: "6601001", name: "กิตติพงษ์ วงศ์สว่าง", subject: "DBI223", status: "SUBMITTED", time: "10/10/2026 09:30" },
    { id: "6601002", name: "จิราพร สุขเสริฐ", subject: "DBI223", status: "SUBMITTED", time: "10/10/2026 10:15" },
    { id: "6601003", name: "ชินวัตร แก้วมณี", subject: "DBI223", status: "PENDING", time: "-" },
    { id: "6601004", name: "ณิชาภัทร นามวงศ์", subject: "DBI223", status: "SUBMITTED", time: "10/10/2026 11:00" },
    { id: "6601005", name: "ธนกฤต เพชรแท้", subject: "DBI223", status: "PENDING", time: "-" },
    { id: "6601006", name: "นภัสสร รัตนดิลก", subject: "DBI224", status: "SUBMITTED", time: "10/10/2026 08:45" },
    { id: "6601007", name: "บุญส่ง มั่นคง", subject: "DBI224", status: "PENDING", time: "-" },
    { id: "6601008", name: "ปวิตรา อินทร์งาม", subject: "DBI224", status: "SUBMITTED", time: "10/10/2026 13:20" },
    { id: "6601009", name: "พงศกร ใจดี", subject: "DBI224", status: "PENDING", time: "-" },
    { id: "6601010", name: "วรัญญา ศรีสุข", subject: "DBI224", status: "SUBMITTED", time: "10/10/2026 14:00" },
    { id: "6601011", name: "อภิสิทธิ์ มงคล", subject: "DBI223", status: "SUBMITTED", time: "10/10/2026 14:10" },
    { id: "6601012", name: "ศิริพร บุญช่วย", subject: "DBI224", status: "PENDING", time: "-" }
];

let alertCount = 14;
let pieChart, barChart;

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('init-time').innerText = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + " น.";
    renderTable();
    updateStats();
    initCharts();
});

// Update Statistics & Charts
function updateStats() {
    const total = students.length;
    const submitted = students.filter(s => s.status === 'SUBMITTED').length;
    const pending = total - submitted;
    const subPct = total > 0 ? Math.round((submitted / total) * 100) : 0;
    const penPct = total > 0 ? 100 - subPct : 0;

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-submitted').innerText = submitted;
    document.getElementById('stat-submitted-pct').innerText = `${subPct}% ของทั้งหมด`;
    document.getElementById('stat-pending').innerText = pending;
    document.getElementById('stat-pending-pct').innerText = `${penPct}% ต้องติดตามซ้ำ`;
    document.getElementById('stat-alerts').innerText = alertCount;

    updateStudentSelectOptions();
    if (pieChart && barChart) updateChartData();
}

// Render Student Select Box
function updateStudentSelectOptions() {
    const select = document.getElementById('sim-student-select');
    select.innerHTML = '';
    const pendingList = students.filter(s => s.status === 'PENDING');
    
    if (pendingList.length === 0) {
        select.innerHTML = '<option value="">ส่งงานครบทุกคนแล้ว!</option>';
        return;
    }

    pendingList.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.innerText = `${s.id} - ${s.name} (${s.subject})`;
        select.appendChild(opt);
    });
}

// Render Student Table
function renderTable(data = students) {
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-400">ไม่พบข้อมูลนักศึกษา</td></tr>`;
        return;
    }

    data.forEach(s => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/80 transition";

        const isSubmitted = s.status === 'SUBMITTED';
        const statusBadge = isSubmitted 
            ? `<span class="bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded-full text-[10px]"><i class="fa-solid fa-check mr-1"></i>ส่งแล้ว</span>`
            : `<span class="bg-rose-100 text-rose-700 font-medium px-2 py-0.5 rounded-full text-[10px]"><i class="fa-solid fa-clock mr-1"></i>ยังไม่ส่ง</span>`;

        const actionButton = isSubmitted
            ? `<button onclick="toggleStatus('${s.id}')" class="text-slate-400 hover:text-slate-600 text-[11px] underline">สลับเป็นยังไม่ส่ง</button>`
            : `<button onclick="nudgeStudent('${s.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium px-2.5 py-1 rounded-md transition flex items-center gap-1 mx-auto">
                <i class="fa-solid fa-bell"></i> สะกิด LINE
               </button>`;

        tr.innerHTML = `
            <td class="py-3 px-3 font-mono text-slate-700 font-semibold">${s.id}</td>
            <td class="py-3 px-3 font-medium text-slate-800">${s.name}</td>
            <td class="py-3 px-3"><span class="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono text-[11px]">${s.subject}</span></td>
            <td class="py-3 px-3">${statusBadge}</td>
            <td class="py-3 px-3 text-center">${actionButton}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Filter Table
function filterStudents() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const subject = document.getElementById('filter-subject').value;
    const status = document.getElementById('filter-status').value;

    const filtered = students.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search) || s.id.includes(search);
        const matchSubject = subject === 'ALL' || s.subject === subject;
        const matchStatus = status === 'ALL' || s.status === status;
        return matchSearch && matchSubject && matchStatus;
    });

    renderTable(filtered);
}

// Simulation: Submit Form
function simulateFormSubmit() {
    const stdId = document.getElementById('sim-student-select').value;
    const taskName = document.getElementById('sim-task-input').value;

    if (!stdId) {
        alert("ไม่มีนักศึกษาค้างส่งงานในระบบ");
        return;
    }

    const student = students.find(s => s.id === stdId);
    if (student) {
        student.status = 'SUBMITTED';
        student.time = new Date().toLocaleString('th-TH');
        alertCount++;

        pushLineMessage(`
            <div class="bg-slate-700 p-3 rounded-xl border-l-4 border-emerald-500 space-y-1">
                <div class="flex justify-between items-center text-[10px] text-slate-400">
                    <span class="font-bold text-emerald-400">LINE Notify</span>
                    <span>${getCurrentTime()}</span>
                </div>
                <p class="font-bold text-white">✅ [ส่งงานสำเร็จ]</p>
                <p class="text-slate-300">วิชา: <span class="text-white font-semibold">${student.subject}</span></p>
                <p class="text-slate-300">รหัส: ${student.id} | ${student.name}</p>
                <p class="text-slate-300">งาน: ${taskName}</p>
            </div>
        `);

        updateStats();
        filterStudents();
    }
}

// Simulation: Scheduled Alerts
function triggerScheduledAlert(type) {
    alertCount++;
    let title = "", detail = "", borderClass = "border-amber-500";

    if (type === '3days') {
        title = "⏰ [แจ้งเตือนกำหนดส่งงาน - 3 วัน]";
        detail = "อย่าลืม! มีกำหนดส่งงานวิชา DBI223/DBI224 ในอีก 3 วันข้างหน้า";
        borderClass = "border-amber-500";
    } else if (type === '1day') {
        title = "⚠️ [แจ้งเตือนด่วน - 1 วันสุดท้าย]";
        detail = "เหลือเวลาอีกเพียง 24 ชั่วโมง! สำหรับการส่งงาน DBI223/DBI224";
        borderClass = "border-orange-500";
    } else if (type === 'missed') {
        title = "🚨 [แจ้งเตือนเลยกำหนดส่ง]";
        detail = "พบนักศึกษาบางส่วนยังไม่ได้ส่งงานตามกำหนด ระบบได้บันทึกรายชื่อเรียบร้อยแล้ว";
        borderClass = "border-rose-500";
    }

    pushLineMessage(`
        <div class="bg-slate-700 p-3 rounded-xl border-l-4 ${borderClass} space-y-1">
            <div class="flex justify-between items-center text-[10px] text-slate-400">
                <span class="font-bold text-emerald-400">LINE Notify</span>
                <span>${getCurrentTime()}</span>
            </div>
            <p class="font-bold text-white">${title}</p>
            <p class="text-slate-300">${detail}</p>
        </div>
    `);

    updateStats();
}

// Nudge Individual Student
function nudgeStudent(stdId) {
    const student = students.find(s => s.id === stdId);
    if (student) {
        alertCount++;
        pushLineMessage(`
            <div class="bg-slate-700 p-3 rounded-xl border-l-4 border-indigo-500 space-y-1">
                <div class="flex justify-between items-center text-[10px] text-slate-400">
                    <span class="font-bold text-indigo-400">LINE OA (สะกิดรายบุคคล)</span>
                    <span>${getCurrentTime()}</span>
                </div>
                <p class="font-bold text-white">📩 [ข้อความติดตามงานถึง ${student.name}]</p>
                <p class="text-slate-300">วิชา: ${student.subject} รหัส ${student.id}</p>
                <p class="text-slate-300">กรุณาส่งงานผ่าน Google Form ของวิชาด้วยครับ</p>
            </div>
        `);
        updateStats();
    }
}

// Toggle Status
function toggleStatus(stdId) {
    const student = students.find(s => s.id === stdId);
    if (student) {
        student.status = student.status === 'SUBMITTED' ? 'PENDING' : 'SUBMITTED';
        updateStats();
        filterStudents();
    }
}

// Add Student Prompt
function addNewStudentPrompt() {
    const id = prompt("กรอกรหัสนักศึกษา:");
    if (!id) return;
    const name = prompt("กรอกชื่อ-นามสกุล:");
    if (!name) return;
    const subject = prompt("กรอกรายวิชา (DBI223 หรือ DBI224):", "DBI223");

    students.push({
        id: id,
        name: name,
        subject: (subject && subject.toUpperCase().includes('224')) ? 'DBI224' : 'DBI223',
        status: 'PENDING',
        time: '-'
    });

    updateStats();
    filterStudents();
}

// Push Message to LINE Live Feed
function pushLineMessage(htmlContent) {
    const feed = document.getElementById('line-chat-feed');
    feed.innerHTML += htmlContent;
    feed.scrollTop = feed.scrollHeight;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + " น.";
}

// Initialize Charts
function initCharts() {
    // Pie Chart
    const ctxPie = document.getElementById('statusPieChart').getContext('2d');
    pieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: getPieData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { family: 'Kanit' } } } }
        }
    });

    // Bar Chart
    const ctxBar = document.getElementById('subjectBarChart').getContext('2d');
    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: getBarData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { family: 'Kanit' } } } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function getPieData() {
    const submitted = students.filter(s => s.status === 'SUBMITTED').length;
    const pending = students.length - submitted;
    return {
        labels: ['ส่งแล้ว', 'ยังไม่ส่ง'],
        datasets: [{
            data: [submitted, pending],
            backgroundColor: ['#10b981', '#f43f5e']
        }]
    };
}

function getBarData() {
    const dbi223Sub = students.filter(s => s.subject === 'DBI223' && s.status === 'SUBMITTED').length;
    const dbi223Pen = students.filter(s => s.subject === 'DBI223' && s.status === 'PENDING').length;
    const dbi224Sub = students.filter(s => s.subject === 'DBI224' && s.status === 'SUBMITTED').length;
    const dbi224Pen = students.filter(s => s.subject === 'DBI224' && s.status === 'PENDING').length;

    return {
        labels: ['DBI223', 'DBI224'],
        datasets: [
            { label: 'ส่งแล้ว', data: [dbi223Sub, dbi224Sub], backgroundColor: '#10b981' },
            { label: 'ยังไม่ส่ง', data: [dbi223Pen, dbi224Pen], backgroundColor: '#f43f5e' }
        ]
    };
}

function updateChartData() {
    pieChart.data = getPieData();
    pieChart.update();

    barChart.data = getBarData();
    barChart.update();
}
