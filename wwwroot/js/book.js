const uri = 'api/TodoBooks';
let todos2 = [];
//Pobierz listę elementów do wykonania
function getBooks() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayBooks(data))
        .catch(error => console.error('Unable to get items.', error));
}
//Dodaj element do wykonania
function addItem() {
    const addTitleTextbox = document.getElementById('add-title');
    const addAuthorTextbox = document.getElementById('add-author');
    const item = {
        isAvailable: false,
        title: addTitleTextbox.value.trim(),
        author: addAuthorTextbox.value.trim()
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
            getBooks();
            addTitleTextbox.value = '';
            addAuthorTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}
//Usuń element do wykonania
function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getBooks())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos2.find(item => item.id === id);
    document.getElementById('edit-title').value = item.title;
    document.getElementById('edit-author').value = item.author;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isAvailable').checked = item.isAvailable;
    document.getElementById('editForm').style.display = 'block';
}
//Aktualizowanie elementu do wykonania
function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isAvailable: document.getElementById('edit-isAvailable').checked,
        title: document.getElementById('edit-title').value.trim(),
        author: document.getElementById('edit-author').value.trim()
    };
    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getBooks())
        .catch(error => console.error('Unable to update item.', error));
    closeInput();
    return false;
}
function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}
//Funkcja odpowiedzialna z wyświetlenie numeru pozycji
function _displayCount(itemCount) {
    const name = (itemCount === 0) ? 'Brak danych' : 'Pozycja: ';
    document.getElementById('counter').innerText = `${name} ${itemCount}`;
    return name
}
//Funkcja odpowiedzialna za wygląd tabeli z danymi
function _displayBooks(data) {
    const tBody = document.getElementById('todos2');
    tBody.innerHTML = '';
    _displayCount(data.length);
    const button = document.createElement('button');
    data.forEach(item => {
        let isAvailableCheckbox = document.createElement('input');
        isAvailableCheckbox.type = 'checkbox';
        isAvailableCheckbox.disabled = true;
        isAvailableCheckbox.checked = item.isAvailable;
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edytuj';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);
        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Usuń';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);
        let tr = tBody.insertRow();
        let td1 = tr.insertCell(0);
        td1.appendChild(isAvailableCheckbox);
        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.title);
        td2.appendChild(textNode);
        let td3 = tr.insertCell(2);
        let textNode2 = document.createTextNode(item.author);
        td3.appendChild(textNode2);
        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);
        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });
    todos2 = data;
}