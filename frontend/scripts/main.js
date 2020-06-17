//Rest calls
const addRecord = async (data) => {
    fetch("http://localhost:8080/data", {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            'content-type': 'application/json'
        }),
    }).then(() => {
        load();
    });
}

const deleteRecord = async (id) => {
    fetch("http://localhost:8080/data/" + id, {
        method: "DELETE",
        headers: new Headers({
            'content-type': 'application/json'
        }),
    }).then(() => {
        load();
    });
}

const updateRecord = async (id, data) => {
    fetch("http://localhost:8080/data/" + id, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: new Headers({
            'content-type': 'application/json'
        }),
    }).then(() => {
        load();
    });
}

const getAllRecords = async () => {
    return fetch("http://localhost:8080/data", {
        method: "GET",
        headers: new Headers({
            'content-type': 'application/json'
        }),
    }).then(res => {
        return res.json();
    }).then((data) => {
        return data;
    });
}

//Global variables
let saved_edit_row = "";
let add_mode = false;
let edit_mode = false;
let edit_id;
let modal;
let modal_message;
let modal_visible = false;
let awaiting_action;
let awaiting_action_id;

//Adds one row of data to the table
function addRecordIntoTheTable(record, table) {
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    row.id = "row-" + record.id;

    row.insertCell(0).innerHTML = record.id;
    row.insertCell(1).innerHTML = record.name;
    row.insertCell(2).innerHTML = record.number;
    row.insertCell(3).innerHTML = record.country;
    row.insertCell(4).innerHTML = record.city;
    row.insertCell(5).innerHTML = record.company;
    row.insertCell(6).innerHTML = "<button onclick=openModal(" + record.id + ",'DELETE')>Delete</button>" +
        "<button onclick=enableEdit(" + record.id + ")>Edit</button>";
}

//On page load function.
//Loads data and checks if we need to open confirmation modal straight away.
const load = function () {
    getAllRecords().then((data) => {
        populateData(data);
    });
    modal = document.getElementById("modal");
    modal_message = document.getElementById("modal-message");
    modal.onclick = function (event) {
        event.stopPropagation();
    }

    //Check for outside click on the modal
    document.addEventListener('click', function (event) {
        if (modal_visible) {
            var isClickInside = modal.contains(event.target);

            if (!isClickInside) {
                closeModal();
            }
        }
    });

    //Check for params in URL and open modal if required
    const queryString = window.location.search;
    if (queryString != "" || queryString != "?") {
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get("id");
        const action = urlParams.get("action");
        if (action && id && (action === "DELETE" || action === "EDIT")) {
            openModal(id, action);
        }
    }
}


//Reloads table. 
//Erases old table body, creates new one and populates it with provided data
const populateData = function (data) {
    let new_tbody = document.createElement('tbody');
    new_tbody.id = "table-body";
    for (let record of data) {
        addRecordIntoTheTable(record, new_tbody);
    }
    let old_tbody = document.getElementById("table-body");
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
}

//Enables edit mode for the given record in the table
const enableEdit = function (id) {
    if (edit_mode) {
        cancelEdit(edit_id);
    }
    edit_id = id;
    edit_mode = true;
    let old_row = document.getElementById("row-" + id);
    saved_edit_row = old_row.innerHTML;
    for (let i = 1; i < old_row.cells.length - 1; i++) {
        old_row.cells[i].innerHTML = "<input id='col-" + i + "-edit' value='" + old_row.cells[i].innerHTML + "'>";
    }
    old_row.cells[old_row.cells.length - 1].innerHTML = "<button onclick=openModal(" + id + ",'EDIT')>Confirm</button>" +
        "<button onclick=cancelEdit(" + id + ")>Cancel</button>";
}

//Disables edit mode for the given record in the table
const cancelEdit = function (id) {
    if (!edit_mode) {
        return;
    }
    let old_row = saved_edit_row;
    let row = document.getElementById("row-" + id);
    saved_edit_row = "";
    edit_id = "";
    edit_mode = false;
    row.innerHTML = old_row;
}

//Confirms changes to the given row in the table and sends update request to the backend
const confirmEdit = function (id) {
    if (!edit_mode) {
        return;
    }
    edit_obj = {};
    edit_obj.name = document.getElementById("col-1-edit").value;
    edit_obj.number = document.getElementById("col-2-edit").value;
    edit_obj.country = document.getElementById("col-3-edit").value;
    edit_obj.city = document.getElementById("col-4-edit").value;
    edit_obj.company = document.getElementById("col-5-edit").value;
    updateRecord(id, edit_obj);
    cancelEdit(id);
}

//Enables add mode
const enableAddMode = function () {
    if (add_mode) {
        window.scrollTo(0, document.body.scrollHeight);
        return;
    }
    add_mode = true;
    let table = document.getElementById("table-body");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    row.id = "add-row";

    row.insertCell(0).innerHTML = "<td>#</td>";
    for (let i = 1; i <= 5; i++) {
        row.insertCell(i).innerHTML = "<input id='col-" + i + "-add' value=''>";
    }
    row.insertCell(6).innerHTML = "<button onclick=confirmAdd('add-row')>Confirm</button>" +
        "<button onclick=cancelAdd('add-row')>Cancel</button>";
    window.scrollTo(0, document.body.scrollHeight);
}

//Takes data from the populated(or not so populated) inputs in the "add" row and sends add request to the backend
const confirmAdd = function (id) {
    let row = document.getElementById(id);
    if (!add_mode) {
        return;
    }
    add_obj = {};
    add_obj.name = document.getElementById("col-1-add").value;
    add_obj.number = document.getElementById("col-2-add").value;
    add_obj.country = document.getElementById("col-3-add").value;
    add_obj.city = document.getElementById("col-4-add").value;
    add_obj.company = document.getElementById("col-5-add").value;
    addRecord(add_obj);
    add_mode = false;
}

//Discards all changes in the add row and disables add mode
const cancelAdd = function (id) {
    let row = document.getElementById(id);
    if (!add_mode) {
        return;
    }
    row.remove();
    add_mode = false;
}

//Open modal
const openModal = function (id, action) {
    modal.classList.add("slide-in");
    modal_message.innerHTML = "Do you really want to <b>" + action + "</b> row with ID <b>" + id + "</b>";
    awaiting_action = action;
    awaiting_action_id = id;

    //Push parameters to the address bar
    window.history.pushState("Lorem", "Ipsum", "?id=" + id + "&action=" + action);

    //Delay modal visible to avoid instant closing by click outside
    setTimeout(() => {
        modal_visible = true;
    }, 10)
}

//Called on modal confirmation
const confirmAction = function () {
    switch (awaiting_action) {
        case "DELETE":
            deleteRecord(awaiting_action_id);
            break;
        case "EDIT":
            confirmEdit(awaiting_action_id);
    }
    closeModal();
}

//Closes modal
const closeModal = function () {
    modal.classList.remove("slide-in");
    modal_visible = false;
    awaiting_action = "";
    awaiting_action_id = null;
    window.history.pushState("Lorem", "Ipsum", "?");
}