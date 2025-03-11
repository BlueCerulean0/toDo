import { DateTime } from "luxon";
const now = DateTime.now();

const content = document.querySelector('.content');
const addTodo = document.createElement('div');
const general  = document.createElement('div');
const projectContainer = document.createElement('div');

addTodo.classList.add('addTodo');
general.classList.add('general');
projectContainer.classList.add('projectContainer');

let toDoInfo = [];

function createPop() {

    try {
        toDoInfo = JSON.parse(localStorage.getItem("toDoInfo")) || [];
    } catch (error) {
        console.error("Something went wrong", error);
        toDoInfo = [];
    }

    general.innerHTML =
        `<h1>General</h1>
        <div class="sortAndCreate">
            <button class="sort">All</button>
            <button class="create">+ Create Todo</button>
        </div>`;
    content.appendChild(general);

    addTodo.innerHTML = `
            <form id="todoForm">
                <span><p>Add ToDo</p></span>
                <fieldset>
                    <label for="title">Title:</label>
                    <input type="text" id="title" name="title" placeholder="Enter title" required>

                    <label for="description">Description:</label>
                    <textarea name="description" id="description"></textarea>
                </fieldset>

                <fieldset class="form-fields">
                    <div class="time-container">
                        <label for="time">Time:</label>
                        <input type="time" id="time" name="time">
                    </div>
                    <div class="due-date-container">
                        <label for="date">Due Date:</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    <div class="priority-container">
                        <label for="priority">Priority:</label>
                        <select name="priority" id="priority" required>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset class="form-actions">
                    <button type="button" class="close">Close</button>
                    <button type="submit" class="add">Add</button>
                </fieldset>
            </form>
    `;
    content.appendChild(addTodo)

    const dateInput = document.querySelector('#date');
    const timeInput = document.querySelector('#time');

    dateInput.value = now.toISODate();
    timeInput.value = now.toFormat('hh:mm');


    //adding it to the dom
    general.appendChild(projectContainer);

    renderTodos();

    const todoForm = document.querySelector('#todoForm')

    //Form event listener
    let divToUpdate;
    projectContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit')) {

            const todoDiv = event.target.closest('[data-id]');
            const dataId = todoDiv.dataset.id;
            console.log(dataId);
            console.log(toDoInfo);
            const todoItem = toDoInfo.find(todo => todo.dataId === Number(dataId))
            console.log(todoItem)

            todoForm.title.value = todoItem.title;
            todoForm.description.value = todoItem.description;
            todoForm.time.value = todoItem.time;
            todoForm.date.value = todoItem.date;
            todoForm.priority.value = todoItem.priority;

            divToUpdate = dataId;
            todoForm.dataset.mode = 'edit';
            addTodo.classList.remove('hide');
            addTodo.classList.add('show');

        }
    })

    todoForm.addEventListener('submit', (event) => {
        event.preventDefault()

        let mode = todoForm.dataset.mode;
        const title = todoForm.title.value;
        const description = todoForm.description.value;
        const time = todoForm.time.value;
        const date = todoForm.date.value;
        const priority = todoForm.priority.value;

        if (mode === 'edit') {
            const todoItem = toDoInfo.find(todo => todo.dataId === Number(divToUpdate))

            todoItem.title = title;
            todoItem.description = description;
            todoItem.time = time;
            todoItem.date = date;
            todoItem.priority = priority;

            todoForm.dataset.mode = 'add';
        } else {
            let newTodo = new TodoItem(Date.now(), title, description, time, date, priority)
            toDoInfo.push(newTodo)
        }

        localStorage.setItem('toDoInfo', JSON.stringify(toDoInfo));
        renderTodos()
        todoForm.reset();
        addTodo.classList.remove('show');
        addTodo.classList.add('hide');
    });

    
    projectContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('done')) {
            const todoDiv = event.target.closest('[data-id]');
            const divIdToRemove = todoDiv.dataset.id;

            toDoInfo = toDoInfo.filter(todo => todo.dataId !== Number(divIdToRemove))

            todoDiv.classList.add('hide');
            localStorage.setItem('toDoInfo', JSON.stringify(toDoInfo));
            renderTodos()
        }
    })

    
    // The pop-up window for the add ToDo form
    const create = document.querySelector('.create');
    const close = document.querySelector('.close');

    create.addEventListener('click', (event) => {
        addTodo.classList.remove('hide')
        addTodo.classList.add('show')
    })

    close.addEventListener('click', (event) => {
        todoForm.dataset.mode = 'add';

        addTodo.classList.remove('show')
        addTodo.classList.add('hide')
        todoForm.title.value = "";
        todoForm.description.value = "";
        todoForm.time.value = timeInput.value = now.toFormat('hh:mm');
        todoForm.date.value = now.toISODate();

        todoForm.priority.value = "Low";
    })
}

function TodoItem(dataId, title, description, time, date, priority) {
    this.dataId = dataId;
    this.title = title;
    this.description = description;
    this.time = time;
    this.date = date;
    this.priority = priority;
}

function renderTodos() {
    projectContainer.innerHTML = ''

    toDoInfo.forEach(todo => {
        const todoHTML = `
            <div data-id="${todo.dataId}">
                <span>
                    <span>
                        <h3>${todo.title}</h3>
                        <button class="done">Done</button>
                    </span>
                    <button class="edit">Edit</button>
                </span>
                <p>${todo.description}</p>
                <span>
                    <p><span>Due Date: ${todo.date}</span> </p>
                    <p><span>Priority: ${todo.priority}</span></p>
                </span>
            </div>
        `;
        projectContainer.insertAdjacentHTML('beforeend', todoHTML);
    })
}



export { createPop, toDoInfo };
