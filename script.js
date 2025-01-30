// Data store object
const todoData = {
    tasks: [],
    addTask: function(text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date()
        };
        this.tasks.push(task);
        return task;
    },
    deleteTask: function(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    },
    toggleComplete: function(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            // Remove the task after marking it complete
            if (task.completed) {
                setTimeout(() => {
                    this.deleteTask(id);
                }, 800); // Match this with animation duration
            }
        }
    },
    editTask: function(id, newText) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.text = newText;
        }
    }
};

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text) {
        todoData.addTask(text);
        input.value = '';
        renderTasks();
    }
}

function deleteTask(id) {
    todoData.deleteTask(id);
    renderTasks();
}

function toggleComplete(id) {
    const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
    
    if (taskElement) {
        taskElement.classList.add('task-completed-animation');
        
        // Create and show completion message
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.textContent = '✨ Task Completed!';
        document.body.appendChild(message);
        
        // Remove the message after animation
        setTimeout(() => {
            message.remove();
        }, 2000);
        
        // Update the data
        todoData.toggleComplete(id);
        
        // Wait for animation to finish, then re-render
        setTimeout(() => {
            renderTasks();
        }, 800);
    }
}

function editTask(id) {
    const task = todoData.tasks.find(task => task.id === id);
    if (task) {
        task.isEditing = true;
        renderTasks();
    }
}

function saveTask(id) {
    const task = todoData.tasks.find(task => task.id === id);
    if (task) {
        const input = document.getElementById(`edit-${id}`);
        const newText = input.value.trim();
        if (newText) {
            task.text = newText;
            task.isEditing = false;
            renderTasks();
        }
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    todoData.tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.setAttribute('data-id', task.id);
        
        if (task.isEditing) {
            taskElement.innerHTML = `
                <input type="text" id="edit-${task.id}" class="task-editing" value="${task.text}">
                <div class="task-actions">
                    <button class="btn btn-complete" onclick="saveTask(${task.id})">
                        Save
                    </button>
                </div>
            `;
        } else {
            taskElement.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="btn btn-complete" onclick="toggleComplete(${task.id})">
                        ✓
                    </button>
                    <button class="btn btn-edit" onclick="editTask(${task.id})">
                        ✎
                    </button>
                    <button class="btn btn-delete" onclick="deleteTask(${task.id})">
                        ×
                    </button>
                </div>
            `;
        }
        
        taskList.appendChild(taskElement);
    });
}

// Add keyboard event listener for the input
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});