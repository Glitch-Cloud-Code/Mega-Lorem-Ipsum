import { Record } from "./model/record.js";
import * as RecordService from "./services/recordService.js";

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

    row.insertCell(0).innerHTML = record.getId();
    row.insertCell(1).innerHTML = record.getName();
    row.insertCell(2).innerHTML = record.getNumber();
    row.insertCell(3).innerHTML = record.getCountry();
    row.insertCell(4).innerHTML = record.getCity();
    row.insertCell(5).innerHTML = record.getCompany();
    row.insertCell(6).innerHTML = "<button onclick=openModal(" + record.id + ",'DELETE')>Delete</button>" +
        "<button onclick=enableEdit(" + record.id + ")>Edit</button>";
}

const load = function () {

    //Load data
    RecordService.getAllRecords().then((data) => {
        populateData(data);
    });

    setModalGlobalVariables();
    stopModalEventPropagation();
    openModalIfRequired();
    addEventListeners();
}

//Adds functions to the global scope for them to be callable from the HTML 
const setGlobalFunctions = function() {
    window.load = load;
    window.enableEdit = enableEdit;
    window.cancelEdit = cancelEdit;
    window.enableAddMode = enableAddMode;
    window.confirmAdd = confirmAdd;
    window.cancelAdd = cancelAdd;
    window.openModal = openModal;
    window.confirmAction = confirmAction;
    window.closeModal = closeModal;
}

//Check for params in URL and open modal if required
const openModalIfRequired = function () {
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

//Initiates event listeners on the document
const addEventListeners = function () {
    //Check for outside click on the modal
    document.addEventListener('click', function (event) {
        if (modal_visible) {
            let isClickInside = modal.contains(event.target);

            if (!isClickInside) {
                closeModal();
            }
        }
    });
}

//Sets global variables for modal window
const setModalGlobalVariables = function () {
    modal = document.getElementById("modal");
    modal_message = document.getElementById("modal-message");
}

//Stop event propagation of click on modal so user can't click through the modal
const stopModalEventPropagation = function () {
    modal.onclick = function (event) {
        event.stopPropagation();
    }
}

//Reloads table. 
//Erases old table body, creates new one and populates it with provided data
const populateData = function (data) {
    let new_tbody = document.createElement('tbody');
    new_tbody.id = "table-body";
    for (let record of data) {
        addRecordIntoTheTable(new Record(record), new_tbody);
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

    let record = new Record ();
    record.setName(document.getElementById("col-1-edit").value);
    record.setNumber(document.getElementById("col-2-edit").value);
    record.setCountry(document.getElementById("col-3-edit").value);
    record.setCity(document.getElementById("col-4-edit").value);
    record.setCompany(document.getElementById("col-5-edit").value);

    RecordService.updateRecord(id, record);
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
const confirmAdd = function () {
    if (!add_mode) {
        return;
    }
    let record = new Record;
    record.setName(document.getElementById("col-1-add").value);
    record.setNumber(document.getElementById("col-2-add").value);
    record.setCountry(document.getElementById("col-3-add").value);
    record.setCity(document.getElementById("col-4-add").value);
    record.setCompany(document.getElementById("col-5-add").value);
    RecordService.addRecord(record);
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
            RecordService.deleteRecord(awaiting_action_id);
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

setGlobalFunctions();