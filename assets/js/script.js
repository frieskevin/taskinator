var pageContentEl = document.querySelector('#page-content');
var taskIdCounter = 0;
var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector('#tasks-to-do');
var tasksInProgressEl = document.querySelector('#tasks-in-progress');
var tasksCompletedEl = document.querySelector('#tasks-completed');
var tasks = [];

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }
    formEl.reset();
    var isEdit = formEl.hasAttribute('data-task-id');
    if (isEdit) {
        var taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: 'to do'
        };
        createTaskEl(taskDataObj);
    }
};
var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    saveTasks();
    alert('Task Updated!');
    formEl.removeAttribute('data-task-id');
    document.querySelector('#save-task').textContent = "Add Task";
}

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute('data-task-id');
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var createTaskEl = function (taskDataObj) {
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    listItemEl.setAttribute('data-task-id', taskIdCounter);

    var taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);
    saveTasks();
    taskIdCounter++;
};

var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';
    var editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ['To do', 'In Progress', 'Completed'];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};

var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    var updatedTaskArr = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    tasks = updatedTaskArr;    
    saveTasks();
};

var editTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    var taskName = taskSelected.querySelector('h3.task-name').textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    var taskType = taskSelected.querySelector('span.task-type').textContent;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector('#save-task').textContent = "Save Task";
    formEl.setAttribute('data-task-id', taskId);
}

var saveTasks = function() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

var loadTasks = function() {
    tasks = localStorage.getItem('tasks');
    if (tasks === null) {
        tasks = [];
        return false;
    }
    tasks = JSON.parse(tasks);
    console.log(tasks);
    /* iterate through a tasks array and create task elemnets on the page from it */
    for ( var i = 0; i < tasks.length; i++) {
        tasks.id = taskIdCounter;
        var listItemEl = document.createElement('li');
        listItemEl.className = 'task-item';
        listItemEl.setAttribute('data-task-id', tasks[i].id);
        var taskInfoEl = document.createElement('div');
        taskInfoEl.className = 'task-info';
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);
        var taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);
        if (tasks[i].status === 'to do') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0
            tasksToDoEl.appendChild(listItemEl);
        } else if (tasks[i].status === 'in progress') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1
            tasksInProgressEl.appendChild(listItemEl);
        } else if (tasks[i].status === 'complete') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2
            tasksCompletedEl.appendChild(listItemEl);
        }
        taskIdCounter = (taskIdCounter + 1);
        console.log(listItemEl);
    }
}

formEl.addEventListener('submit', taskFormHandler);

var taskButtonHandler = function (event) {
    var targetEl = event.target;
    if (targetEl.matches('.edit-btn')) {
        var taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);
    } else if (targetEl.matches('.delete-btn')) {
        var taskId = targetEl.getAttribute('data-task-id');
        deleteTask(taskId);
    }
};
pageContentEl.addEventListener('click', taskButtonHandler);

pageContentEl.addEventListener('change', taskStatusChangeHandler);

loadTasks();