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

}