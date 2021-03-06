import {
    Record
} from "./model/record.js";
import * as RecordRESTService from "./services/recordRESTService.js";
import * as RecordValidationService from "./services/RecordValidationService.js";

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

let validationResults = {
    name: true,
    number: true,
    country: true,
    city: true,
    company: true
};

let inputIndexes = {
    1: "name",
    2: "number",
    3: "country",
    4: "city",
    5: "company"
};

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
    row.insertCell(6).innerHTML = "<div class='button-wrapper'><button class='svg-btn' onclick=openModal(" + record.id + ",'DELETE')><img class='red-filter' src='./assets/svg/delete-button.svg'></button>" +
        "<button class='svg-btn' onclick=enableEditMode(" + record.id + ")><img class='blue-filter' src='./assets/svg/edit-button.svg'></img></button></div>";
}

//Sets up everything needed on the initial load of the page
const load = function () {
    //Load data from the backend
    RecordRESTService.getAllRecords().then((data) => {
        populateData(data);
    }).then(() => {
        openModalIfRequired();
    });

    setModalGlobalVariables();
    stopModalEventPropagation();
    addEventListeners();
}

//Adds functions to the global scope for them to be callable from the HTML 
const setGlobalFunctions = function () {
    window.load = load;
    window.enableEditMode = enableEditMode;
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
            if (action === "EDIT") {
                var record = new Record();
                record.setName(urlParams.get("col-1"));
                record.setNumber(urlParams.get("col-2"));
                record.setCountry(urlParams.get("col-3"));
                record.setCity(urlParams.get("col-4"));
                record.setCompany(urlParams.get("col-5"));
            }
            openModal(id, action, record);
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
    //Checks for the escape button press
    document.addEventListener('keydown', function (event) {
        if (modal_visible) {
            if (event.key == "Escape") {
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
const enableEditMode = function (id) {
    if (edit_mode) {
        cancelEdit(edit_id);
    }
    edit_id = id;
    edit_mode = true;
    let old_row = document.getElementById("row-" + id);
    saved_edit_row = old_row.innerHTML;
    for (let i = 1; i < old_row.cells.length - 1; i++) {
        old_row.cells[i].innerHTML = "<div class='form__group field'><input type='input' placeholder=" + inputIndexes[i] + " name=" + inputIndexes[i] + " class='form__field' id='col-" + i + "-edit' value='" + old_row.cells[i].innerHTML + "'><label for='col-" + i + "-edit' class='form__label'>" + inputIndexes[i] + "</label><div class='error-message' id='col-" + i + "-error'></div>";
        //"<input id='col-" + i + "-edit' value='" + old_row.cells[i].innerHTML + "'><div id='col-" + i + "-error'>";
    }
    old_row.cells[old_row.cells.length - 1].innerHTML = "<div class='button-wrapper'><button class='svg-btn' id='confirm-btn' onclick=openModal(" + id + ",'EDIT')><img class='green-filter' src='./assets/svg/confirm-button.svg'></img></button>" +
        "<button class='svg-btn'  onclick=cancelEdit(" + id + ")><img class='red-filter' src='./assets/svg/cancel-button.svg'></img></button></div>";
    setEventListenersForInputs("edit");
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
    let record = new Record();
    record.setParamsFromInputs("edit");
    RecordRESTService.updateRecord(id, record);
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
        row.insertCell(i).innerHTML = "<div class='form__group field'><input type='input' placeholder=" + inputIndexes[i] + " name=" + inputIndexes[i] + " class='form__field' id='col-" + i + "-add'><label for='col-" + i + "-add' class='form__label'>" + inputIndexes[i] + "</label><div class='error-message' id='col-" + i + "-error'></div>";
    }
    row.insertCell(6).innerHTML = "<div class='button-wrapper'><button id='confirm-btn' class='svg-btn' onclick=confirmAdd('add-row')><img class='green-filter' src='./assets/svg/confirm-button.svg'></img></button>" +
        "<button class='svg-btn' onclick=cancelAdd('add-row')><img class='red-filter' src='./assets/svg/cancel-button.svg'></img></button></div>";
    setEventListenersForInputs("add");
    window.scrollTo(0, document.body.scrollHeight);
}

//Takes data from the inputs in the "add" row and sends add request to the backend
const confirmAdd = function () {
    if (!add_mode) {
        return;
    }
    let record = new Record;
    record.setParamsFromInputs("add");
    RecordRESTService.addRecord(record);
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
const openModal = function (id, action, record) {
    modal.classList.add("slide-in");
    modal_message.innerHTML = "Do you really want to <b>" + action + "</b> row with ID <b>" + id + "</b>?";
    awaiting_action = action;
    awaiting_action_id = id;

    if (action == "EDIT") {
        if (!record) {
            let record = new Record();
            record.setParamsFromInputs("edit");
            pushParamsToState(id, action, record);
        } else {
            let changeEvent = new Event("change");
            enableEditMode(id);
            record.pushParamsToInputs("edit");
            for (let i = 1; i <= 5; i++) {
                document.getElementById("col-" + i + "-edit").dispatchEvent(changeEvent);
            }
            if (!checkFormStatus()) {
                cancelEdit(id);
                awaiting_action = null;
                awaiting_action_id = null;
                modal_message.innerHTML = "Looks like you have been messing around with the values in the URL. If you wanna break the application and add invalidated data to the database - just send a POST request to the backend, it has no validations.";
            }
        }
    } else {
        pushParamsToState(id, action);
    }

    //Delay modal visible to avoid instant closing by click outside
    setTimeout(() => {
        modal_visible = true;
    }, 10)
}

//Pushes parameters to adress bar
const pushParamsToState = function (id, action, record) {
    if (record) {
        window.history.pushState("Lorem", "Ipsum",
            "?id=" + id +
            "&action=" + action +
            "&col-1=" + record.getName() +
            "&col-2=" + record.getNumber() +
            "&col-3=" + record.getCountry() +
            "&col-4=" + record.getCity() +
            "&col-5=" + record.getCompany());
    } else {
        window.history.pushState("Lorem", "Ipsum", "?id=" + id + "&action=" + action);
    }
}

//Called on modal confirmation
const confirmAction = function () {
    switch (awaiting_action) {
        case "DELETE":
            RecordRESTService.deleteRecord(awaiting_action_id);
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

//Sets event listeners for the inputs
const setEventListenersForInputs = function (actionType) {
    for (let i = 1; i <= 5; i++) {
        document.getElementById("col-" + i + "-" + actionType).addEventListener('change', (event) => {
            validateInput(i, event.target.value);
            checkFormStatus();
        });
    }
}

//Validates input and sets error message for a corresponding input
const validateInput = function (inputIndex, inputValue) {
    let result = RecordValidationService.validateFieldByIndex(inputIndex, inputValue);

    if (result != true) {
        const colErrorMessage = document.getElementById("col-" + inputIndex + "-error");
        colErrorMessage.textContent = result;
        validationResults[inputIndexes[inputIndex]] = false;
    } else {
        const colErrorMessage = document.getElementById("col-" + inputIndex + "-error");
        colErrorMessage.textContent = "";
        validationResults[inputIndexes[inputIndex]] = true;
    }
}

//If any of the form fields didn't pass validation - form status will be set to false
const checkFormStatus = function () {
    let formStatus = true;
    for (const key in validationResults) {
        if (Object.hasOwnProperty.call(validationResults, key)) {
            if (validationResults[key] == false) {
                formStatus = false;
            }
        }
    }
    setConfirmButtonStatus(formStatus);
    return formStatus;
}

//Enables or disables confirmation button depending on the validation status
const setConfirmButtonStatus = function (formStatus) {
    if (formStatus) {
        document.getElementById("confirm-btn").disabled = false;
    } else {
        document.getElementById("confirm-btn").disabled = true;
    }
}

setGlobalFunctions();