// === DARK MODE ===
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// === TAB NAVIGATION ===
document.querySelectorAll(".tab-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".tab-link").forEach((a) => a.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));

    link.classList.add("active");
    document.getElementById(link.dataset.tab).classList.add("active");

    if (link.dataset.tab === "home") showDeadlineList();
    if (link.dataset.tab === "tasks") showTaskList();
  });
});

// === TAMBAH TUGAS ===
document.getElementById("addTask").addEventListener("click", () => {
  const name = document.getElementById("taskName").value.trim();
  const deadline = document.getElementById("taskDeadline").value;

  if (!name || !deadline) {
    alert("Isi nama tugas dan deadline dulu ya 🌷");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ name, deadline });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskName").value = "";
  document.getElementById("taskDeadline").value = "";

  showTaskList();
  showDeadlineList();
});

// === TAMPILKAN SEMUA TUGAS ===
function showTaskList() {
  const container = document.getElementById("taskList");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  container.innerHTML = "";

  if (tasks.length === 0) {
    container.innerHTML = "<p>Belum ada tugas disimpan 🌱</p>";
    return;
  }

  tasks.forEach((task, index) => {
    const deadline = new Date(task.deadline);
    const div = document.createElement("div");
    div.classList.add("task-item");

    div.innerHTML = `
      <div>
        <strong>${task.name}</strong><br>
        <small>Deadline: ${deadline.toLocaleString()}</small>
      </div>
      <button class="delete" data-index="${index}">Hapus</button>
    `;

    container.appendChild(div);
  });

  // Hapus tugas
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      showTaskList();
      showDeadlineList();
    });
  });
}

// === DEADLINE URUT + PENANDA ===
function showDeadlineList() {
  const container = document.getElementById("deadlineList");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  container.innerHTML = "";

  if (tasks.length === 0) {
    container.innerHTML = "<p>Belum ada tugas 🌷</p>";
    return;
  }

  // Urutkan berdasarkan waktu
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const now = new Date();

  tasks.forEach((task) => {
    const deadline = new Date(task.deadline);
    const timeDiff = (deadline - now) / (1000 * 60 * 60); // jam
    const isClose = timeDiff <= 24; // < 24 jam dianggap mepet

    const div = document.createElement("div");
    div.classList.add("task-item");
    if (isClose) div.classList.add("urgent");

    div.innerHTML = `
      <div>
        <strong>${task.name}</strong><br>
        <small>Deadline: ${deadline.toLocaleString()}</small>
      </div>
      ${isClose ? '<span class="urgent-tag">⚠️ Mepet!</span>' : ""}
    `;
    container.appendChild(div);
  });
}

// === INISIALISASI AWAL ===
showTaskList();
showDeadlineList();
