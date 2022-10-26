async function request(type, url, body) {
    return new Promise((resolve, reject) => {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open(type, url);
        httpRequest.onload = function() {
            let requestJson = {
                status: httpRequest.status,
                response: httpRequest.response
            }
            if (httpRequest.status === 200) resolve(requestJson);
            else reject(requestJson);
        };
        httpRequest.onerror = function() {
            let requestJson = {
                status: httpRequest.status,
                response: httpRequest.response
            }
            reject(requestJson);
        };
        if (body) httpRequest.send(JSON.stringify(body));
        else httpRequest.send();
    });
}