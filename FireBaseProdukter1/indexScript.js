window.addEventListener('load', getProducts);
document.getElementById('productSubmit').addEventListener('click', postProduct);
async function setBodyContent(){
    return {
        beskrivning: document.getElementById('description').value,
        bildUrl: document.getElementById('img-url').value,
        namn: document.getElementById('titel').value,
        pris: document.getElementById('price').value
    }
}
async function postProduct() {

//Datan vi vill posta, egenskaperna väljer vi


//Header-objektet, egenskaperna är bestämda
    const header = {
//Egenskapsnamnet Content-type behöver citattecken eftersom det innehåller ett bindestreck.
        "Content-type": "application/json; charset=UTF-8"
    }


    const option = {
        method: "POST", //Metoden som ska användas
        body: JSON.stringify(await setBodyContent()), //Gör om datan till json
        headers: header //Header-objektet
    };

    const URL = 'https://avancerad-js-produkter-1-default-rtdb.europe-west1.firebasedatabase.app/produkter.json';
    await fetch(URL, option)
        .then(resp => resp.json())
        .then(data => console.log(data));

}

async function getProducts() {

    await fetch('https://avancerad-js-produkter-1-default-rtdb.europe-west1.firebasedatabase.app/produkter.json')
        .then(resp => resp.json())
        .then(data => displayProducts(data));

}

function displayProducts(data) {

    for (const produkt of Object.entries(data)) {

        let beskrivning;
        let namn;
        let pris;
        let textContainer = setProductDescriptionContainer();
        let produktKort = setProductCard();

        Object.keys(produkt[1]).map(key => {

            const value = Object.getOwnPropertyDescriptor(produkt[1], key).value;

            switch (key) {

                case 'beskrivning': {
                    beskrivning = setProductDescription(value);
                    break;
                }
                case 'bildUrl': {
                    imgUrl = setProductImg(value);
                    break;
                }
                case 'namn': {
                    namn = setProductTitel(value);
                    break;
                }
                case 'pris': {
                    pris = setProductPrice(value);
                    break;
                }

            }
        })

        produktKort.append(imgUrl)

        textContainer.append(namn);
        textContainer.append(beskrivning);
        textContainer.append(pris);

        produktKort.append(textContainer)

        document.getElementById('products').append(produktKort);

    }

}

function setProductDescription(description) {

    const p = document.createElement('p');
    p.innerText += description;

    return p;
}

function setProductImg(src) {

    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('class', 'product-img');

    return img;
}

function setProductTitel(titel) {

    const h3 = document.createElement('h3');
    h3.innerText += titel;

    return h3;
}

function setProductPrice(price) {

    const p = document.createElement('p');
    p.setAttribute('class', 'pris');
    p.innerText += price + ':-';

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
