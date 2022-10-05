var pageContentEl = document.querySelector("#page-content");

var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function(event) {

    // event as the argument
    // .preventDefault() prevents the browser from performing its default behavior, automatically refreshing the page after the form is submitted
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
        // check if input values are empty strings
        if (!taskNameInput || !taskTypeInput) {
            alert("You need to fill out the task form dumb bitch!");
            return false;
        }

    formEl.reset();

    // when task is being edited, it has the data-task-id attribute. hasAttribute() checks if it has this.
    var isEdit = formEl.hasAttribute("data-task-id");
        // has data attribute, so get task id and call function to complete edit process
        if (isEdit) {
            var taskId = formEl.getAttribute("data-task-id");
            completeEditTask(taskNameInput, taskTypeInput, taskId);
        }
        // no data attribute, so create object as normal and pass to createTaskEl function
        else {
            var taskDataObj = {
                name: taskNameInput,
                type: taskTypeInput
            };
            
            // send it as an argument to createTaskEl
            createTaskEl(taskDataObj);
        }
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    // remove data-task-id attribute --> ensure that users are able to create new tasks again
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
};

// create variable that will hold the code that creates a new task HTML element
var createTaskEl = function(taskDataObj) {
    
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    
    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);
    // check for appended data (can see it in the children section)
    console.dir(listItemEl);

    // use taskIdCounter as the argument to create buttons that correspond to the current task id
    // createTaskActions returns a DOM element --> store that element in the variable taskActionsEl
    var taskActionsEl = createTaskActions(taskIdCounter);
    // append taskActionsEl to listItemEl
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {

    // create a new div with the class name "task-actions"
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button element and append it to the div
    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button element and append it to the div
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // create status select element and append it to the div
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
    // get target element from event
    // event.target reports the element on which the event occurs (in this case a click event)
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // delete button was clicked
    if (targetEl.matches(".delete-btn")) {
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var editTask = function (taskId) {
    console.log("editing task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    // we van reuse the selectors from before to update the form above
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";

    // add the taskId to a data-task-id attribute on the form itself
        // keeps track of which task we're editing
        // lets us know that a task is being edited in the first place
    formEl.setAttribute("data-task-id", taskId);
};

// taskId is passed as a parameter (a named variable passed into a function)
// parameter variables are used to import arguments into functions
var deleteTask = function(taskId) {
    console.log(taskId);

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    console.log(taskSelected);

    // deleted selected task
    taskSelected.remove();
};

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);