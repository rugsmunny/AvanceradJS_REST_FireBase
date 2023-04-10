window.addEventListener('load', getUsers);

document.getElementById('productSubmit').addEventListener('click', event => putNewUserTask(event));

const userContainer = document.getElementById('products');

async function putNewUserTask(event) {
    event.preventDefault();
    const userId = document.getElementById('userSelector').value;
    console.log("userid: "+ userId)
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

function checkTask(event) {

    const userId = event.target.parentElement.parentElement.firstChild.id;
    const taskId = event.target.id;
    if (event.target.getAttribute('class').includes('false')) {
        event.target.setAttribute('class', 'done-true');
        updateTaskStatus('true', userId, taskId).then(r => console.log(r))
            .then(() => userContainer.innerHTML = '').then(getUsers);
    } else {
        event.target.setAttribute('class', 'done-false');
        updateTaskStatus('false', userId, taskId).then(r => console.log(r))
            .then(() => userContainer.innerHTML = '').then(getUsers);
    }

}

async function updateTaskStatus(taskStatus, userId, taskId) {

//Header-objektet, egenskaperna är bestämda
    const header = {
//Egenskapsnamnet Content-type behöver citattecken eftersom det innehåller ett bindestreck.
        "Content-type": "application/json; charset=UTF-8"
    }

    const option = {
        method: "PATCH", //Metoden som ska användas
        body: JSON.stringify({done: taskStatus}), //Gör om datan till json
        headers: header //Header-objektet
    };

    const URL = 'https://todolist-2f9b1-default-rtdb.europe-west1.firebasedatabase.app/' + userId + '/to-dos/' + taskId + '.json';
    await fetch(URL, option)
        .then(resp => resp.json())
        .then(data => console.log(data));

}

async function getUsers() {


    await fetch('https://todolist-2f9b1-default-rtdb.europe-west1.firebasedatabase.app/.json')
        .then(resp => resp.json())
        .then(data => displayProducts(data))


}

function displayProducts(data) {

    for (const entry of Object.entries(data)) {

        let name, userId;
        let title;
        let toDos, taskId;
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
        toDos.forEach(i => {

            textContainer.append(document.createElement('br'));
            textContainer.append(setUsersToDos(i, userId, taskId));
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

function setUsersToDos(toDoList, userId, taskId) {
    if (!toDoList) {
        return null;
    }
    const toDoContainer = document.createElement('div');
    toDoContainer.setAttribute('class', 'todo-container');

    const pTask = document.createElement('p');
    pTask.setAttribute('id', userId+taskId)

    if ('task' in toDoList) {
        pTask.innerText += toDoList.task;
    } else {
        pTask.innerText += 'No task provided';
    }

    toDoList.done === 'true' ? pTask.setAttribute('class', 'done-true') : pTask.setAttribute('class', 'done-false');

    pTask.innerText += ': ' + toDoList.done;
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
