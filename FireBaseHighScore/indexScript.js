window.addEventListener('load', getScores);
document.querySelectorAll('#clear-high-score-submit, #high-score-submit').forEach(element =>
    element.addEventListener('click',  addScoreToBoard));
const scoreBoardElement =  document.getElementById('scoreboard');
let scoreboard;

async function setBodyContent() {
    return {
        name: document.getElementById('name').value,
        score: parseInt(document.getElementById('score').value)
    }
}

async function addScoreToBoard(event) {
    event.preventDefault();
    
    if(event.target.id === 'clear-high-score-submit'){
        scoreboard.forEach(index => {
            index.name = 'undefined'
            index.score = 0
        });
    } else {

        scoreboard.push(await setBodyContent());
        scoreboard.sort((a, b) => b.score - a.score);

    }


    scoreboard.splice(5);
    console.log(scoreboard)


//Header-objektet, egenskaperna är bestämda
       const header = {
    //Egenskapsnamnet Content-type behöver citattecken eftersom det innehåller ett bindestreck.
            "Content-type": "application/json; charset=UTF-8"
        }


        const option = {
            method: "PUT", //Metoden som ska användas
            body: JSON.stringify(scoreboard), //Gör om datan till json
            headers: header //Header-objektet
        };

        const URL = 'https://highscore-41a5e-default-rtdb.europe-west1.firebasedatabase.app/.json';
        await fetch(URL, option)
            .then(resp => resp.json())
            .then(() => {
                scoreBoardElement.innerHTML = '';
                getScores();
            });

}

async function getScores() {

    await fetch('https://highscore-41a5e-default-rtdb.europe-west1.firebasedatabase.app/.json')
        .then(resp => resp.json())
        .then(data => {
            scoreboard = data;
            displayScores(data);
        });

}

function displayScores(data) {

    Object.keys(data).map(key => {

        const textContainer = setProductDescriptionContainer();
        const produktKort = setProductCard();
        const value = Object.getOwnPropertyDescriptor(data, key).value;
        textContainer.append(createScoreParagraph(value));
        produktKort.append(textContainer);
        scoreBoardElement.append(produktKort);
    })

}

function createScoreParagraph(value) {

    const p = document.createElement('p');
    p.innerText += value.name + ': ' + value.score;

    return p;
}


function setProductDescriptionContainer() {

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    return container;
}

function setProductCard() {
    const productCard = document.createElement('div');
    productCard.setAttribute('class', 'card');

    return productCard;
}
