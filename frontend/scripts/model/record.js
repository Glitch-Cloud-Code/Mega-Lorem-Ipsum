export class Record {

    constructor(record) {
        if (record) {
        this.id = record.id;
        this.name = record.name;
        this.number = record.number;
        this.country = record.country;
        this.city = record.city;
        this.company = record.company;
        } else {
            return;
        }
    }

    getId() {
        return this.id;
    }

    setId = function (id) {
        this.id = id;
    }

    getName() {
        return this.name;
    }

    setName = function (name) {
        this.name = name;
    }

    getNumber = function () {
        return this.number;
    }

    setNumber = function (number) {
        this.number = number;
    }

    getCountry = function () {
        return this.country;
    }

    setCountry = function (country) {
        this.country = country;
    }

    getCity = function () {
        return this.city;
    }

    setCity = function (city) {
        this.city = city;
    }

    getCompany = function () {
        return this.company;
    }

    setCompany = function (company) {
        this.company = company;
    }

    setParamsFromInputs(inputPrefix) {
        this.name = document.getElementById("col-1-"+inputPrefix).value;
        this.number = document.getElementById("col-2-"+inputPrefix).value;
        this.country = document.getElementById("col-3-"+inputPrefix).value;
        this.city = document.getElementById("col-4-"+inputPrefix).value;
        this.company = document.getElementById("col-5-"+inputPrefix).value;
    }

    pushParamsToInputs(inputPrefix) {
        document.getElementById("col-1-" + inputPrefix).value = this.name;
        document.getElementById("col-2-" + inputPrefix).value = this.number;
        document.getElementById("col-3-" + inputPrefix).value = this.country;
        document.getElementById("col-4-" + inputPrefix).value = this.city;
        document.getElementById("col-5-" + inputPrefix).value = this.company;
    }

}