window.addEventListener('load', getUsers);

document.getElementById('productSubmit').addEventListener('click', event => putNewUserTask(event));

const userContainer = document.getElementById('products');

async function putNewUserTask(event) {
    event.preventDefault();
    const userId = document.getElementById('userSelector').value;
    const newTaskToAdd = document.getElementById('new-task').value;

    // Hämta ToDo-listan för användaren
    const response = await fetch('https://todolist-2f9b1-default-rtdb.europe-west1.firebasedatabase.app/' + userId + '/to-dos.json');
    const toDos = await response.json();

    // Beräkna index för den nya uppgiften
    const index = toDos ? Object.keys(toDos).length : 0;

    // Skapa en ny uppgift och lägg till den i ToDo-listan
    const header = {
        "Content-type": "application/json; charset=UTF-8"
    }
    const option = {
        method: "PUT",
        body: JSON.stringify({done: false, task: newTaskToAdd}),
        headers: header
    };
    const URL = 'https://todolist-2f9b1-default-rtdb.europe-west1.firebasedatabase.app/' + userId + '/to-dos/' + index + '.json';
    await fetch(URL, option);

    // Uppdatera ToDo-listan på sidan
    userContainer.innerHTML = '';
    await getUsers();
}


function addEventlistenersToTasks() {
    const taskStatus = document.querySelectorAll('.done-false, .done-true');
    taskStatus.forEach(task => task.addEventListener('click', checkTask));
}

function updateTaskInCard(eventTarget, data) {
    
    eventTarget.innerHTML = data.task;
    eventTarget.classList.toggle('done-true')
    eventTarget.classList.toggle('done-false')
}

function checkTask(event) {

    const [usID,tskID]  = event.target.id.split(':');

    const taskStatus = event.target.getAttribute('class').includes('false') ? 'true' : 'false';

    updateTaskStatus(taskStatus, usID, tskID)
        .then(() => getUpdatedTask(event, usID, tskID));

}

async function updateTaskStatus(taskStatus, userId, taskId) {


    const header = {

        "Content-type": "application/json; charset=UTF-8"
    }

    const option = {
        method: "PATCH",
        body: JSON.stringify({done: taskStatus}),
        headers: header
    };

    const URL = 'https://todolist-2f9b1-default-rtdb.europe-west1.firebasedatabase.app/' + userId + '/to-dos/' + taskId + '.json';
    await fetch(URL, option)
        .then(resp => resp.json())

}

async function getUsers() {

    await fetch('https://todolist-2f9b1-default-rtdb.europe-west1.firebasedatabase.app/.json')
        .then(resp => resp.json())
        .then(data => displayProducts(data))
}

async function getUpdatedTask(event, usId, tskId) {

    await fetch('https://todolist-2f9b1-default-rtdb.europe-west1.firebasedatabase.app/' + usId + '/to-dos/' + tskId + '.json')
        .then(resp => resp.json()).then(data => updateTaskInCard(event.target, data));

}

function displayProducts(data) {

    let name, userId;
    let title;
    let toDos, taskId;

    for (const entry of Object.entries(data)) {

        let textContainer = setUserDescriptionContainer();
        let produktKort = setUserCard();

        Object.keys(entry[1]).map(key => {


            const value = Object.getOwnPropertyDescriptor(entry[1], key).value;

            switch (key) {

                case 'name': {
                    name = value;
                    userId = entry[0];
                    break;
                }
                case 'title': {
                    title = value;
                    break;
                }
                case 'to-dos': {
                    toDos = Object.values(value);
                    break;
                }

            }
        })

        const br1 = document.createElement('br');
        const br2 = document.createElement('br');

        textContainer.append(setUserName(name, userId));
        textContainer.append(br1);
        textContainer.append(setUserTitle(title));
        textContainer.append(br2);
        textContainer.append('Users ToDo-list: ');

        taskId = 0;

        toDos.forEach(toDo => {

            textContainer.append(document.createElement('br'));
            textContainer.append(setUsersToDos(toDo, userId, taskId));
            taskId++;

        })

        produktKort.append(textContainer)

        document.getElementById('products').append(produktKort);

    }

    addEventlistenersToTasks();
}

function setUserName(name, userId) {

    const p = document.createElement('p');
    p.setAttribute('id', 'user-id:' + userId)
    p.innerText += name;

    return p;
}

function setUserTitle(title) {

    const p = document.createElement('p');
    p.innerText += title;

    return p;
}

function setUsersToDos(toDo, userId, taskId) {

    if (!toDo) {
        return null;
    }

    const toDoContainer = document.createElement('div');
    toDoContainer.setAttribute('class', 'todo-container');

    const pTask = document.createElement('p');
    pTask.setAttribute('id', userId + ':' + taskId)

    if ('task' in toDo) {
        pTask.innerText += toDo.task;
    } else {
        pTask.innerText += 'No task provided';
    }

    toDo.done === 'true' ? pTask.setAttribute('class', 'done-true') : pTask.setAttribute('class', 'done-false');

    toDoContainer.append(pTask);

    return toDoContainer;
}

function setUserDescriptionContainer() {

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    return container;
}

function setUserCard() {

    const productCard = document.createElement('div');
    productCard.setAttribute('class', 'card');

    return productCard;
}
