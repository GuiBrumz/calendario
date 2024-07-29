const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const taskForm = document.getElementById('task-form');
const taskDateInput = document.getElementById('task-date');
const taskTimeInput = document.getElementById('task-time');
const taskTextInput = document.getElementById('task-text');
const taskPriorityInput = document.getElementById('task-priority');
const taskModal = document.getElementById('task-modal');
const taskModalList = document.getElementById('task-modal-list');
const calendarWeekdays = document.getElementById('calendar-weekdays');

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentView = 'month';
let tasks = {};

taskForm.addEventListener('submit', addTask);

function renderCalendar(month, year) {
    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDays.innerHTML = '';
    calendarWeekdays.innerHTML = '';
    monthYear.textContent = `${months[month]} ${year}`;

    ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        calendarWeekdays.appendChild(dayDiv);
    });

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarDays.appendChild(emptyDiv);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.setAttribute('data-day', i);
        dayDiv.setAttribute('data-month', month);
        dayDiv.setAttribute('data-year', year);

        const dayNumber = document.createElement('div');
        dayNumber.textContent = i;
        dayNumber.className = 'day-number';

        dayDiv.appendChild(dayNumber);

        if (tasks[year] && tasks[year][month] && tasks[year][month][i]) {
            const taskCount = document.createElement('div');
            taskCount.className = 'task-count';
            taskCount.textContent = tasks[year][month][i].length;
            dayDiv.appendChild(taskCount);

            tasks[year][month][i].forEach(task => {
                const taskIndicator = document.createElement('div');
                taskIndicator.className = `task-indicator task-indicator-${task.priority}`;
                dayDiv.appendChild(taskIndicator);
            });
        }

        dayDiv.addEventListener('click', () => openModal(i, month, year));
        calendarDays.appendChild(dayDiv);
    }
}

function renderWeek(year, month, day) {
    const date = new Date(year, month, day);
    const startOfWeek = date.getDate() - date.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDays.innerHTML = '';
    calendarWeekdays.innerHTML = '';
    monthYear.textContent = `${months[month]} ${year}`;

    ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        calendarWeekdays.appendChild(dayDiv);
    });

    for (let i = 0; i < 7; i++) {
        const currentDay = startOfWeek + i;
        const currentDate = new Date(year, month, currentDay);
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.setAttribute('data-day', currentDate.getDate());
        dayDiv.setAttribute('data-month', currentDate.getMonth());
        dayDiv.setAttribute('data-year', currentDate.getFullYear());

        const dayNumber = document.createElement('div');
        dayNumber.textContent = currentDate.getDate();
        dayNumber.className = 'day-number';

        dayDiv.appendChild(dayNumber);

        if (tasks[currentDate.getFullYear()] && tasks[currentDate.getFullYear()][currentDate.getMonth()] && tasks[currentDate.getFullYear()][currentDate.getMonth()][currentDate.getDate()]) {
            const taskCount = document.createElement('div');
            taskCount.className = 'task-count';
            taskCount.textContent = tasks[currentDate.getFullYear()][currentDate.getMonth()][currentDate.getDate()].length;
            dayDiv.appendChild(taskCount);

            tasks[currentDate.getFullYear()][currentDate.getMonth()][currentDate.getDate()].forEach(task => {
                const taskIndicator = document.createElement('div');
                taskIndicator.className = `task-indicator task-indicator-${task.priority}`;
                dayDiv.appendChild(taskIndicator);
            });
        }

        dayDiv.addEventListener('click', () => openModal(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear()));
        calendarDays.appendChild(dayDiv);
    }
}

function renderYear(year) {
    calendarDays.innerHTML = '';
    calendarWeekdays.innerHTML = '';
    monthYear.textContent = year;

    for (let month = 0; month < 12; month++) {
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');
        monthDiv.textContent = months[month];

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.setAttribute('data-day', day);
            dayDiv.setAttribute('data-month', month);
            dayDiv.setAttribute('data-year', year);

            const dayNumber = document.createElement('div');
            dayNumber.textContent = day;
            dayNumber.className = 'day-number';

            dayDiv.appendChild(dayNumber);

            if (tasks[year] && tasks[year][month] && tasks[year][month][day]) {
                const taskCount = document.createElement('div');
                taskCount.className = 'task-count';
                taskCount.textContent = tasks[year][month][day].length;
                dayDiv.appendChild(taskCount);

                tasks[year][month][day].forEach(task => {
                    const taskIndicator = document.createElement('div');
                    taskIndicator.className = `task-indicator task-indicator-${task.priority}`;
                    dayDiv.appendChild(taskIndicator);
                });
            }

            dayDiv.addEventListener('click', () => openModal(day, month, year));
            monthDiv.appendChild(dayDiv);
        }

        calendarDays.appendChild(monthDiv);
    }
}

function prevPeriod() {
    if (currentView === 'month') {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    } else if (currentView === 'week') {
        const date = new Date(currentYear, currentMonth, 1);
        date.setDate(date.getDate() - 7);
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
        renderWeek(currentYear, currentMonth, date.getDate());
    } else if (currentView === 'year') {
        currentYear--;
        renderYear(currentYear);
    }
}

function nextPeriod() {
    if (currentView === 'month') {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    } else if (currentView === 'week') {
        const date = new Date(currentYear, currentMonth, 1);
        date.setDate(date.getDate() + 7);
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
        renderWeek(currentYear, currentMonth, date.getDate());
    } else if (currentView === 'year') {
        currentYear++;
        renderYear(currentYear);
    }
}

function setView(view) {
    currentView = view;
    if (view === 'month') {
        renderCalendar(currentMonth, currentYear);
    } else if (view === 'week') {
        renderWeek(currentYear, currentMonth, 1);
    } else if (view === 'year') {
        renderYear(currentYear);
    }
}

function addTask(event) {
    event.preventDefault();

    const date = new Date(taskDateInput.value);
    const time = taskTimeInput.value;
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const taskText = `${time} - ${taskTextInput.value}`;
    const taskPriority = taskPriorityInput.value;

    if (!tasks[year]) tasks[year] = {};
    if (!tasks[year][month]) tasks[year][month] = {};
    if (!tasks[year][month][day]) tasks[year][month][day] = [];

    tasks[year][month][day].push({ text: taskText, priority: taskPriority });
    taskTextInput.value = '';
    taskDateInput.value = '';
    taskTimeInput.value = '';

    if (currentView === 'month') {
        renderCalendar(currentMonth, currentYear);
    } else if (currentView === 'week') {
        renderWeek(currentYear, currentMonth, 1);
    } else if (currentView === 'year') {
        renderYear(currentYear);
    }
}

function openModal(day, month, year) {
    taskModalList.innerHTML = '';

    if (tasks[year] && tasks[year][month] && tasks[year][month][day]) {
        // Ordenar tarefas por horário
        const sortedTasks = tasks[year][month][day].sort((a, b) => {
            const timeA = a.text.split(' - ')[0];
            const timeB = b.text.split(' - ')[0];
            return timeA.localeCompare(timeB);
        });

        sortedTasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item-modal task-${task.priority}`;
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <button onclick="removeTask(${day}, ${month}, ${year}, ${index})">Remover</button>
            `;
            taskModalList.appendChild(taskItem);
        });
    }

    taskModal.style.display = 'flex';
}

function closeModal() {
    taskModal.style.display = 'none';
}

function removeTask(day, month, year, taskIndex) {
    tasks[year][month][day].splice(taskIndex, 1);
    if (currentView === 'month') {
        renderCalendar(currentMonth, currentYear);
    } else if (currentView === 'week') {
        renderWeek(currentYear, currentMonth, 1);
    } else if (currentView === 'year') {
        renderYear(currentYear);
    }
    openModal(day, month, year);
}

renderCalendar(currentMonth, currentYear);

window.onclick = function(event) {
    if (event.target == taskModal) {
        taskModal.style.display = 'none';
    }
}