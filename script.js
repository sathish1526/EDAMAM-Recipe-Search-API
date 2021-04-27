document.body.classList.add('container');
let title = createDomElement('h1', document.body, [['style', 'text-align:center; color:#808000;margin-top:50px;']], [['textContent', 'RECIPE SEARCH']])
let form = createDomElement('form', document.body, [['class', 'form-inline'], ['style', 'padding-top: 50px']], [['onsubmit', (event) => processInput(event)]]);
let ingredient = createDomElement('div', form, [['class', 'form-group']]);
createDomElement('label', ingredient, [['for', 'ingredient'],['style','font-weight: bold; margin-left:160px; font-size: 22px;']], [['innerHTML', 'Enter ingredient to search for:&nbsp;&nbsp;']]);
createDomElement('input', ingredient, [['type', 'text'], ['id', 'ingredient'], ['class', 'mr-2']]);
let submit = createDomElement('button', form, [['class', "btn btn-primary"], ['type', 'submit']], [['textContent', 'Submit']]);
createDomElement('hr', document.body, [['style', 'height:2px; background:gray;']]);
let recipesDisplay = createDomElement('div', document.body);

async function processInput(event) {
    event.preventDefault();
    while (recipesDisplay.firstChild) {
        recipesDisplay.removeChild(recipesDisplay.lastChild);
    }
    try {
        let fetchUrl = 'https://api.edamam.com/search?q=' + form.elements[0].value + '&app_id=09f0585c&app_key=1abec35ccb404fd8ff5b0918543f63f9';
        let resp = await fetch(fetchUrl);
        let data = await resp.json();
        displayRecipes(data);

    } catch (error) {
        console.log(error);
    }
    form.reset();
}

function displayRecipes(data) {
    data.hits.forEach((val) => {
        renderRecipeCard(val.recipe);
    })
}

function renderRecipeCard(data) {
    let recipeRow = createDomElement('div', recipesDisplay, [['class', 'row bg-light'], ['style', 'border: 1px solid gray']]);
    let title = createDomElement('h4', recipeRow, [['class', 'col-12 text-success'],['style','margin-top:4px']], [['textContent', data.label]]);
    let left = createDomElement('div', recipeRow, [['class', 'col-md-4 mt-2 mb-2 pl-2']]);
    let middle = createDomElement('div', recipeRow, [['class', 'col-md-4 mt-2 mb-2']]);
    let right = createDomElement('div', recipeRow, [['class', 'col-md-4 mt-2 mb-2']]);
    let calories = createDomElement('h6', right, [['style', 'color:blue;text-align:center']], [['textContent', 'Calories: ' + Math.floor(data.calories)]]);
    let img = createDomElement('img', right, [['class', 'img-thumbnail'], ['src', data.image]]);
    createDomElement('p', right, [['class', 'text-info']], [['textContent', data.healthLabels.join(' ')]]);
    createDomElement('a', right, [['href', data.url]], [['textContent', 'Visit site for more...']])
    let ingreList = createDomElement('ul', left, [['class', 'list-group']]);
    createDomElement('span', ingreList, [['style', 'color:blue;text-align:center']], [['textContent', 'INGREDIENTS']]);
    data.ingredientLines.forEach((val) => {
        createDomElement('li', ingreList, [['class', 'list-group-item']], [['textContent', val]]);
    });
    let vitaList = createDomElement('ul', middle, [['class', 'list-group']]);
    createDomElement('span', vitaList, [['style', 'color:blue;text-align:center']], [['textContent', 'VITAMINS']]);
    for (let j = 11; j < 24; j++) {
        let vita = data.digest[j];
        let amount = Math.round((vita.total + Number.EPSILON) * 100) / 100;
        createDomElement('li', vitaList, [['class', 'list-group-item']], [['textContent', vita.label + ": " + amount + vita.unit]]);
    }



}

function createDomElement(elemType, parent, attributes = [], properties = []) {
    let elements = document.createElement(elemType);
    attributes.forEach((val) => {
        elements.setAttribute(val[0], val[1]);
    })
    properties.forEach((val) => {
        elements[val[0]] = val[1];
    })
    parent.append(elements);
    return elements;
}