export function hasSpecialSymbols(string) {
    const regex = /[!@#$%^&*(),.?":{}|<>]/g;
    return regex.test(string);
}

export function hasNumbers(string) {
    const regex = /[0-9]/g;
    return regex.test(string);
}

export function isNullOrUndefined(obj) {
    return (obj == null || obj == undefined);
}

export function validateLength(string, minLength, maxLength) {
    return(string.length >= minLength && string.length <= maxLength);
}