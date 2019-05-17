/**
 * Class that represents a task.
 */
class Task {
    constructor(id, description) {
        this.id = id;
        this.status = "todo";
        this.description = description;
    }
}

let Tasks = (function () {
    // Array used to store "Task" type object.
    let taskList = [];

    /**
     * Check if provided attribute is null or undifined.
     * 
     * @param {*} attr Attribute provided by user.
     * @return {boolean} Returns true if attribute is populated.
     */
    function _checkValid(attr) {
        return (attr === null || attr === undefined || attr === "") ? false : true;
    }

    /**
     * Get only the objects with the provided status.
     * 
     * @param {*} status Attribute that indicate the status of the task (todo, done, deleted).
     * @return {array} Subarray that contain only the tasks of the provided status.
     */
    function _getTasks(status) {
        return taskList.filter(function(item) { return item.status === status });
    }

    /**
     * Count how many time the status appears in the array.
     * 
     * @param {*} status Attribute that indicate the status of the task (todo, done, deleted).
     * @return {number} How many objects have the given status.
     */
    function _countTasks(status) {
        return (_getTasks(status)).length;
    }

    /**
     * Get the possition of an object inside the array provided the id.
     * 
     * @param {*} id Attribute that indicate the id of the object.
     * @return {number} Returns the possition of the object that was found using provided id.
     */
    function _getTaskPossition(id) {
        return taskList.findIndex(function(item) { return item.id === id });
    }

    /**
     * Function used to change the status of task given its id.
     * 
     * @param {*} id Attribute that indicate the od of the object;
     * @param {*} status The new value of status.
     */
    function _changeTaskStatus(id, status) {
        taskList[_getTaskPossition(id)].status = status;
    }

    /**
     * Function used to show/hide message/tasks in ToDo and Done lists depending the size of the array that store the objects.
     */
    function _hideShowListContents() {
        if (_countTasks("todo") !== 0) {
            document.getElementById("todo_list_label_no_tasks").style.display = "none";
            document.getElementById("todo_list_tasks").style.display = "block";
        } else {
            document.getElementById("todo_list_label_no_tasks").style.display = "block";
            document.getElementById("todo_list_tasks").style.display = "none";
        }

        if (_countTasks("done") !== 0) {
            document.getElementById("done_list_label_no_tasks").style.display = "none";
            document.getElementById("done_list_tasks").style.display = "block";
        } else {
            document.getElementById("done_list_label_no_tasks").style.display = "block";
            document.getElementById("done_list_tasks").style.display = "none";
        }
    }

    /**
     * Function that execute all necessary UI functions.
     * This function is called after each action.
     * e.g. after adding a task, completing a task in order to refresh the UI.
     */
    function _executeFunctions() {
        _hideShowListContents();
        _printTasks();
    }

    function _createTable(tasks, status) {
        // Delete body of table <status>_body e.g. done_body.
        let tbody = document.getElementById(status + "_body");
        while (tbody.firstChild !== null && tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        // Loop tasks (array contain objects of the same type) and recreate table body
        for (let i = 0; i < tasks.length; i++) {
            let tr = document.createElement("tr");
            tr.id = status + "_tr_" + i;
            tbody.appendChild(tr);

            let tr_new = document.getElementById(tr.id);
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");

            td1.style = "width: 80%;";
            td1.className = "text-left";
            td1.innerHTML = tasks[i].description;

            let color = "success";
            let title = "Complete";
            let funct = "complete";
            let icon = "check";

            if (status === "done") {
                color = "danger";
                title = "Delete";
                funct = "delete"
                icon = "x";
            }
            td2.innerHTML = `<button class="btn btn-sm btn-outline-${color} w-100" id="${tasks[i].id}" onclick="Tasks.${funct}Task('${tasks[i].id}');" title="${title} task"><i data-feather="${icon}"></i></button>`;

            tr_new.appendChild(td1);
            tr_new.appendChild(td2);
        }
    }

    /**
     * FUnction used to print the reaming/completed tasks counters and the ToDo/Done lists.
     */
    function _printTasks() {
        document.getElementById("remaining_tasks").innerHTML = "Remaining tasks: " + _countTasks("todo");
        document.getElementById("completed_tasks").innerHTML = "Completed tasks: " + _countTasks("done");
        
        _createTable(_getTasks("todo"), "todo");
        _createTable(_getTasks("done"), "done");
        feather.replace();
    }




    
    function initialize() {
        // Add listener to "description" input in order to add task by pressing the "Enter" keyboard key.
        // *** This was found on the internet. ***
        document.getElementById("form_task_description").addEventListener("keypress", function(event) {
            var key = event.which;
            if (key === 13) {
                addTask();
            }
        });
        _hideShowListContents();
    }

    /**
     * Add task to "taskList" array.
     */
    function addTask() {
        const description = document.getElementById("form_task_description").value.trim();
        if (_checkValid(description)) {
            taskList.push(new Task("task_" + taskList.length, description));
            document.getElementById("form_task_description").value = "";
        }
        _executeFunctions();
    }

    /**
     * Move task from ToDo to Done.
     * 
     * @param {*} id The id of the task to move.
     * 
     * To move the task, the status is changed from "todo" to "done".
     */
    function completeTask(id) {
        _changeTaskStatus(id, "done");
        _executeFunctions();
    }

    /**
     * Move tasks from ToDo to Done
     */
    function completeAllTasks() {
        for (let i = 0; i < taskList.length; i++)
            if (taskList[i].status === "todo") taskList[i].status = "done";
        _executeFunctions();
    }

    /**
     * Move task from Done to Delete.
     * 
     * @param {*} id The id of the task to delete.
     * 
     * To delete a task, the status is changed to "deleted" thus keeping it stil but not showing to the end user.
     */
    function deleteTask(id) {
        _changeTaskStatus(id, "deleted");
        _executeFunctions();
    }

    /**
     * Move tasks from Done to Deleted
     */
    function deleteAllTasks() {
        for (let i = 0; i < taskList.length; i++)
            if (taskList[i].status === "done") taskList[i].status = "deleted";
        _executeFunctions();
    }


    // Public functions
    return {
        initialize: initialize,
        addTask: addTask,
        completeTask: completeTask,
        completeAllTasks: completeAllTasks,
        deleteTask: deleteTask,
        deleteAllTasks: deleteAllTasks,
    }
})();

(function() {
    Tasks.initialize();
})();