export const addRecord = async (data) => {
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

export const deleteRecord = async (id) => {
    fetch("http://localhost:8080/data/" + id, {
        method: "DELETE",
        headers: new Headers({
            'content-type': 'application/json'
        }),
    }).then(() => {
        load();
    });
}

export const updateRecord = async (id, data) => {
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

export const getAllRecords = async () => {
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