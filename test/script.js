const mocha = require('mocha');
const chai = require('chai');
const {show, showError, search, setListener} = require('../js/script');
const {JSDOM} = require('jsdom');
Handlebars = require('../libs/handlebars-v4.4.0');
const sinon = require('sinon');
const expect = chai.expect;
const {assert} = require('chai');


let dom;
let window;

let data = {
    "coord": {
        "lon": 30.32,
        "lat": 59.94
    },
    "weather": [
        {
            "id": 804,
            "main": "Clouds",
            "description": "overcast clouds",
            "icon": "04d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 276.91,
        "pressure": 1016,
        "humidity": 80,
        "temp_min": 276.48,
        "temp_max": 277.15
    },
    "visibility": 10000,
    "wind": {
        "speed": 6,
        "deg": 140
    },
    "clouds": {
        "all": 90
    },
    "dt": 1573626054,
    "sys": {
        "type": 1,
        "id": 8926,
        "country": "RU",
        "sunrise": 1573624204,
        "sunset": 1573652158
    },
    "timezone": 10800,
    "id": 498817,
    "name": "Saint Petersburg",
    "cod": 200
};


describe('Test functions', () => {
    beforeEach(() => {
        const options = {
            contentType: 'text/html',
        };
        return JSDOM.fromFile("index.html", options).then((x) => {
            dom = x;
            window = x.window;
        });
    });

    it('show', () => {
        show.call(window, data);
        // console.log(window.document.getElementsByClassName("container")[0].innerHTML);
        let weatherData = [];
        window.document.getElementById("container").querySelectorAll("li").forEach(li => {
            weatherData.push(li.querySelector("em").innerHTML);
        });


        assert(weatherData.indexOf(data.main.temp + " °С") > -1, "wrong temp");
        assert(weatherData.indexOf(data.main.pressure + " гПа") > -1, "wrong pressure");
        assert(weatherData.indexOf(data.main.humidity + " %") > -1, "wrong humidity");
        assert(weatherData.indexOf(data.wind.speed + " м/с") > -1, "wrong wind speed");
        assert(weatherData.indexOf(data.weather[0].description) > -1, "wrong description");

    });

    describe('showError', () => {
        it("network error", () => {
            let response = undefined;

            showError.call(window, response);

            expect(window.document.getElementById("container").querySelector("p").innerHTML).to.equal("Проблемы с интернет соединением")
        });

        it("server error", () => {
            let response = {
                status: 400
            };

            showError.call(window, response);

            expect(window.document.getElementById("container").querySelector("p").innerHTML).to.equal("Проблемы с сервером")
        });

        it("not found error", () => {
            let response = {
                status: 404
            };

            showError.call(window, response);

            expect(window.document.getElementById("container").querySelector("p").innerHTML).to.equal("Город не найден")

        })
    });

    describe('find', () => {
        it('response', async () => {
            let axios = {
                get: (url, params, timeout) => {
                    return Promise.resolve({
                        data: data
                    });
                }
            };

            let response = sinon.spy();
            let error = sinon.spy();

            await search.call(window, "", axios, response, error);

            assert(response.calledOnce);
            assert(!error.called);
            expect(response.getCall(0).args[0]).equal(data);

        });

        it('error', async () => {

            let axios = {
                get: (url, params, timeout) => {
                    return Promise.reject({
                        response: {
                            status: 400
                        }
                    });
                }
            };

            let response = sinon.spy();
            let error = sinon.spy();

            await search.call(window, "", axios, response, error);

            assert(error.calledOnce);
            assert(!response.called);
            expect(error.getCall(0).args[0].status).equal(400);

        });
    });


});

