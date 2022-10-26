async function request(type, url, body) {
    return new Promise((resolve, reject) => {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open(type, url);
        httpRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        httpRequest.onload = function() {
            if (httpRequest.status === 200) resolve(JSON.parse(httpRequest.response));
            else reject(JSON.parse(httpRequest.response));
        };
        httpRequest.onerror = function() {
            reject(JSON.parse(httpRequest.response));
        };
        if (body) httpRequest.send(body);
        else httpRequest.send();
    });
}