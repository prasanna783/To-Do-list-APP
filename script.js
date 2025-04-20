let tasks = [];

function addTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const dependencyEl = document.getElementById("dependency");
  const dependency = dependencyEl ? dependencyEl.value.trim() : null;
  const estimatedTime = parseFloat(document.getElementById("estimatedTime").value);
  const dueDate = document.getElementById("dueDate").value;

  if (!taskName || isNaN(estimatedTime)) {
    alert("Please enter valid task details");
    return;
  }

  const task = {
    id: tasks.length + 1,
    name: taskName,
    dependency: dependency ? parseInt(dependency) : null,
    estimatedTime,
    dueDate,
    notified: false,
    completed: false
  };

  tasks.push(task);
  updateTaskList();
  updateAnalytics();

  document.getElementById("taskName").value = "";
  document.getElementById("dependency").value = "";
  document.getElementById("estimatedTime").value = "";
  document.getElementById("dueDate").value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  updateTaskList();
  updateAnalytics();
}

function updateTaskList() {
  const taskList = document.getElementById("tasks");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "done" : "";
    li.innerHTML = `
      <strong>[${task.id}]</strong> ${task.name}<br>
      ${task.dependency ? `Depends on: ${task.dependency}<br>` : ""}
      Time: ${task.estimatedTime} hrs<br>
      Due: ${task.dueDate}<br>
      <button onclick="toggleTask(${index})">${task.completed ? "Undo" : "Complete"}</button>
    `;
    taskList.appendChild(li);
  });
}

function updateAnalytics() {
  document.getElementById("totalTasks").textContent = tasks.length;
  document.getElementById("completedTasks").textContent = tasks.filter(t => t.completed).length;
  document.getElementById("pendingTasks").textContent = tasks.filter(t => !t.completed).length;
  document.getElementById("totalTime").textContent = tasks.reduce((sum, t) => sum + (t.completed ? t.estimatedTime : 0), 0);
}

function checkReminders() {
  const now = new Date();
  tasks.forEach(task => {
    if (!task.completed && task.dueDate) {
      const due = new Date(task.dueDate);
      const timeDiff = due.setHours(23, 59, 59, 999) - now;
      if (timeDiff < 0 && !task.notified) {
        alert(`⚠️ Task "${task.name}" is overdue!`);
        task.notified = true;
      } else if (timeDiff < 86400000 && !task.notified) {
        alert(`⏰ Task "${task.name}" is due today!`);
        task.notified = true;
      }
    }
  });
}

setInterval(checkReminders, 60000); // Check every minute
