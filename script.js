// Creating all the required tags
const root = document.querySelector('#root');
const h1 = document.createElement('h1');
const ul = document.createElement('ul');
const form = document.createElement('form');
const label = document.createElement('label');
const inputIdNumber = document.createElement('input');
const inputText = document.createElement('textarea');
const inputButton = document.createElement('input');
// Creating the error node that gets appended only if there is no text input
const error = document.createElement('p');
const errorMsg = document.createTextNode('You cannot add a empty to-do!');
error.appendChild(errorMsg);
// List of all existing li elements
const li = document.querySelectorAll('li');
// Function runs only once the DOM has been loaded
function layout() {
    h1.innerHTML = 'My To-Do\'s';
    form.setAttribute('action', '#');
    // form.setAttribute();
    label.innerHTML = 'To-Do: ';
    inputIdNumber.setAttribute('type', 'text');
    inputText.setAttribute('placeholder', 'Write your next to-do here.');
    inputText.setAttribute('autofocus', 'true');
    inputButton.setAttribute('type', 'submit');
    inputButton.setAttribute('value', 'ADD');
    // Appending the form elements in order of display
    form.appendChild(label);
    form.appendChild(inputIdNumber);
    form.appendChild(inputText);
    form.appendChild(inputButton);
    root.appendChild(h1);
    root.appendChild(form);
    root.appendChild(ul);
    // Load all the todo's from the API
    getDataFromApi();
}
// Helper function that creates a new li element with the input text that gets appened to the ul
function addToList(text, id, owner) {
    // const text = inputText.value.trim().split('\n');
    // text.forEach(text, id, owner => {
    makeAndAppendTodo(text, id, owner);
    fetch('https://cors-anywhere.herokuapp.com/https://fsw62-todos-api.herokuapp.com/api/users', {
        method: 'GET'
    })
    .then(data => data.json())
    .then(res => {
        console.log(res.payload)
    })
    // })
}
// Prevents the form's default behavior which is to refresh the web page on submit
function preventInputRefresh(e) {
    e.preventDefault();
    const id = inputIdNumber.value;
    const text = inputText.value;
    // const owner = inputOwner.value;

    if (text.length > 0) {
        if (root.contains(error)) { // Check if error msg exists on the DOM
            error.parentNode.removeChild(error);
        }
        addToList(text, id);
    } else {
        emptyErrorInput(); // Adds the error node if the user submits a empty input
    }
    inputIdNumber.value = '';
    inputText.value = ''; // Clears the input text box after every submit
}

function emptyErrorInput() {
    ul.parentNode.insertBefore(error, ul); // Adds the error msg to the DOM
}

function deleteItem() {
    this.parentNode.remove(li);
}

function crossOutElement() {
    if (this.style.textDecoration === 'none') {
        this.style.textDecoration = 'line-through';
    } else {
        this.style.textDecoration = 'none';
    }
}

function enterKeySubmit(e) {
    if (e.keyCode === 13) {
        preventInputRefresh(e);
    }
}

document.addEventListener('DOMContentLoaded', layout);
form.addEventListener('keydown', enterKeySubmit);
inputButton.addEventListener('click', preventInputRefresh);

// API Link: https://fsw62-todos-api.herokuapp.com/api


function getDataFromApi() {
    fetch('https://cors-anywhere.herokuapp.com/https://fsw62-todos-api.herokuapp.com/api/todos',
        {method: 'GET'}
            //, {mode: 'no-cors', headers: {'Access-Control-Allow-Origin': '*'}}
        )
        .then((data) => data.json())
        .then(res => {
            console.log(res.payload);
            res.payload.forEach(ele => {
                makeAndAppendTodo(ele.text, ele.id);
            })
        })
        .catch(error => {
            console.log('Error: ', error);
        });
}

function makeAndAppendTodo(text, id, owner) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const idNode = document.createTextNode(id);
    const textNode = document.createTextNode(text);
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.innerText = 'Delete';

    span.appendChild(idNode);
    li.appendChild(span);
    li.appendChild(textNode);
    deleteBtn.addEventListener('click', deleteFromApi);
    deleteBtn.addEventListener('click', deleteItem);
    li.addEventListener('click', crossOutElement);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

function deleteFromApi() {
    const idNumber = this.parentNode.querySelector('span').innerText;
    // console.log(idNumber)
    fetch(`https://fsw62-todos-api.herokuapp.com/api/todos/${idNumber}`,
        {method: 'DELETE'}
    )
    .then(res => {
        console.log('Status: ', res.status)
    })
    .catch(err => {
        console.log(err);
    })
    
}







// const request = new XMLHttpRequest();
// request.open('GET', 'https://fsw62-todos-api.herokuapp.com/api/users', true);
// request.setRequestHeader('Access-Control-Allow-Origin', '*');
// request.addEventListener('load', res => {
//     data = JSON.parse(data);
//     console.log(data);
// })
// request.send();