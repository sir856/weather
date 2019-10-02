function search() {
    let city = document.getElementById("city").value;

    axios.get("http://api.openweathermap.org/data/2.5/weather", {
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
            show(response.data)
        })
        .catch(error => {
            showError(error.response);
        });
}

function show(data) {
    let container = document.getElementsByClassName("container")[0];

    let source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);

    container.innerHTML = template(data);
}

function showError(response) {
    let container = document.getElementsByClassName("container")[0];
    if (response) {
        if (response.status === 404) {
            container.innerText = "Город не найден"
        } else {
            container.innerText = "Проблемы с сервером"
        }
    } else {
        container.innerText = "Проблемы с интернет соединением"
    }

}