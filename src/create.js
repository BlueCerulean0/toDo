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
                        <button class="done" type="button">
                            <svg 
                                fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
    \t width="40px" height="40px" viewBox="0 0 305.002 305.002"
    \t xml:space="preserve">
    <g>
    \t<g>
    \t\t<path d="M152.502,0.001C68.412,0.001,0,68.412,0,152.501s68.412,152.5,152.502,152.5c84.089,0,152.5-68.411,152.5-152.5
    \t\t\tS236.591,0.001,152.502,0.001z M152.502,280.001C82.197,280.001,25,222.806,25,152.501c0-70.304,57.197-127.5,127.502-127.5
    \t\t\tc70.304,0,127.5,57.196,127.5,127.5C280.002,222.806,222.806,280.001,152.502,280.001z"/>
    \t\t<path d="M218.473,93.97l-90.546,90.547l-41.398-41.398c-4.882-4.881-12.796-4.881-17.678,0c-4.881,4.882-4.881,12.796,0,17.678
    \t\t\tl50.237,50.237c2.441,2.44,5.64,3.661,8.839,3.661c3.199,0,6.398-1.221,8.839-3.661l99.385-99.385
    \t\t\tc4.881-4.882,4.881-12.796,0-17.678C231.269,89.089,223.354,89.089,218.473,93.97z"/>
    \t</g>
    </g>
                            </svg>
                            
                        </button>
                    </span>
                    <button class="edit">
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"/></svg>
                        
                    </button>
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
