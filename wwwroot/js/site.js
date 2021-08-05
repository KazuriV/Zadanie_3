﻿const uri = 'api/TodoItems';
let todos = [];
//Pobierz listę elementów do wykonania
function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}
//Dodaj element do wykonania
function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const addSurnameTextbox = document.getElementById('add-surname');
    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim(),
        surname: addSurnameTextbox.value.trim()
    };
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
            addSurnameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}
//Usuń element do wykonania
function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-surname').value = item.surname;
    document.getElementById('edit-id').value = item.id;
    //document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}
//Aktualizowanie elementu do wykonania
function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        //isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        surname: document.getElementById('edit-surname').value.trim()
    };
    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));
    closeInput();
    return false;
}
function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}
//Funkcja odpowiedzialna z wyświetlenie numeru pozycji
function _displayCount(itemCount) {
    const name = (itemCount === 0) ? 'Brak danych' : 'Pozycji: ';
    document.getElementById('counter').innerText = `${name} ${itemCount}`;
    return name;
}
//Funkcja odpowiedzialna za wygląd tabeli z danymi
function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';
    _displayCount(data.length);
    const button = document.createElement('button');
    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edytuj';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);
        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Usuń';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);
        let tr = tBody.insertRow();
        let td1 = tr.insertCell(0);
        //td1.appendChild(_displayCount(data.length)); 
        let textNodes = document.createTextNode("Pozycja:");
        td1.appendChild(textNodes);
        //td1.appendChild(isCompleteCheckbox);
        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);
        let td3 = tr.insertCell(2);
        let textNode2 = document.createTextNode(item.surname);
        td3.appendChild(textNode2);
        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);
        let td5= tr.insertCell(4);
        td5.appendChild(deleteButton);
    });
    todos = data;
}