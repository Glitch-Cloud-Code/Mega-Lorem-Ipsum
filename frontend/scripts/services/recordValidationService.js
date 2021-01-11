import * as CommonValidationSrvice from "./CommonValidationService.js";

export function validateFieldByIndex(fieldIndex, fieldValue) {
    let validationResult;
    switch (fieldIndex) {
        case 1:
            validationResult = validateName(fieldValue);
            break;
        case 2:
            validationResult = validatePhoneNumber(fieldValue);
            break;
        case 3:
            validationResult = validateCountry(fieldValue);
            break;
        case 4:
            validationResult = validateCity(fieldValue);
            break;
        case 5:
            validationResult = validateCompany(fieldValue);
            break;
    }
    return validationResult;
}

export function validateName(name) {
    var minLength = 0;
    var maxLength = 50;

    if (CommonValidationSrvice.isNullOrUndefined(name)) {
        return "Object is not set";
    }
    if (CommonValidationSrvice.hasSpecialSymbols(name)) {
        return "Name is not allowed to have special symbols";
    }
    if (CommonValidationSrvice.hasNumbers(name)) {
        return "Name is not allowed to have numbers";
    }
    if (!CommonValidationSrvice.validateLength(name, minLength, maxLength)) {
        return `Name's length must be between ${minLength} and ${maxLength} symbols`;
    }
    return true;
}

export function validatePhoneNumber(phone) {
    var minLength = 0;
    var maxLength = 50;

    if (CommonValidationSrvice.isNullOrUndefined(phone)) {
        return "Object is not set";
    }
    if (!CommonValidationSrvice.validateLength(phone, minLength, maxLength)) {
        return `Phone's length must be between ${minLength} and ${maxLength} symbols`;
    }
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; //Internation phone number validation
    if (!regex.test(phone)) {
        return `Phone number has incorrect format`;
    } else {
        return true;
    }
}

export function validateCountry (country) {
    var minLength = 0;
    var maxLength = 50;
    if (CommonValidationSrvice.isNullOrUndefined(country)) {
        return "Object is not set";
    }
    if (CommonValidationSrvice.hasNumbers(country)) {
        return "Country is not allowed to have numbers";
    }
    if (!CommonValidationSrvice.validateLength(country, minLength, maxLength)) {
        return `Country's length must be between ${minLength} and ${maxLength} symbols`;
    }
    return true;
}

export function validateCity (city) {
    var minLength = 0;
    var maxLength = 50;
    if (CommonValidationSrvice.isNullOrUndefined(city)) {
        return "Object is not set";
    }
    if (CommonValidationSrvice.hasNumbers(city)) {
        return "City is not allowed to have numbers";
    }
    if (!CommonValidationSrvice.validateLength(city, minLength, maxLength)) {
        return `City's length must be between ${minLength} and ${maxLength} symbols`;
    }
    return true;
}

export function validateCompany (company) {
    var minLength = 0;
    var maxLength = 100;
    if (CommonValidationSrvice.isNullOrUndefined(company)) {
        return "Object is not set";
    }
    if (!CommonValidationSrvice.validateLength(company, minLength, maxLength)) {
        return `Company's length must be between ${minLength} and ${maxLength} symbols`;
    }
    return true;
}
