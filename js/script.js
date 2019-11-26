function search(city, axios) {
    return axios.get("http://api.openweathermap.org/data/2.5/weather", {
        params: {
            q: city,
            lang: "ru",
            units: "metric",
            appid: "3494b8f1c8f596aee028c113d9cf5e78"
        }
    }, {
        timeout: 1000
    })
        .then(response => {
            show.call(this, response.data)
        })
        .catch(error => {
            showError.call(this, error.response);
        });
}

function show(data) {
    let container = this.document.getElementsByClassName("container")[0];

    let source = this.document.getElementById("entry-template").innerHTML;
    let template = Handlebars.compile(source);

    container.innerHTML = template(data);
}

function showError(response) {
    let container = this.document.getElementsByClassName("container")[0];

    let error = "Проблемы с интернет соединением";

    if (response) {
        if (response.status === 404) {
            error = "Город не найден"
        } else {
            error = "Проблемы с сервером"
        }
    }

    let source = this.document.getElementById("error-template").innerHTML;
    let template = Handlebars.compile(source);
    let data = { "error": error };


    container.innerHTML = template(data);

}

module.exports = {search, show, showError};
