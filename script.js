let weather = {
    apiKey: "aba6ff9d6de967d5eac6fd79114693cc",
    unsplashKey: "GjchfiFloVe92r42-cwdSM58yymaJ_h45EERp1M-0Dc",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
        .then((response) => {
            if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");

        // Fetch and set the background image using Unsplash API
        this.fetchCityImage(name);
    },
    fetchCityImage: function (city) {
        fetch(
            `https://api.unsplash.com/search/photos?query=${city}&client_id=${this.unsplashKey}`
        )
        .then((response) => response.json())
        .then((data) => {
            const imageUrl = data.results[0]?.urls?.regular || 'https://source.unsplash.com/1600x900/?nature';
            document.body.style.backgroundImage = `url('${imageUrl}')`;
        })
        .catch((error) => {
            console.error("Error fetching city image:", error);
            document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?nature')`;
        });
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

/* Fetching Data from OpenCageData Geocoder */
let geocode = {
    reverseGeocode: function (latitude, longitude) {
        var apikey = "90a096f90b3e4715b6f2e536d934c5af";

        var api_url = "https://api.opencagedata.com/geocode/v1/json";

        var request_url =
            api_url +
            "?" +
            "key=" +
            apikey +
            "&q=" +
            encodeURIComponent(latitude + "," + longitude) +
            "&pretty=1" +
            "&no_annotations=1";

        var request = new XMLHttpRequest();
        request.open("GET", request_url, true);

        request.onload = function () {

            if (request.status == 200) {
                var data = JSON.parse(request.responseText);
                weather.fetchWeather(data.results[0].components.city);
                console.log(data.results[0].components.city);
            } else if (request.status <= 500) {

                console.log("unable to geocode! Response code: " + request.status);
                var data = JSON.parse(request.responseText);
                console.log("error msg: " + data.status.message);
            } else {
                console.log("server error");
            }
        };

        request.onerror = function () {
            console.log("unable to connect to server");
        };

        request.send();
    },
    getLocation: function () {
        function success(data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, console.error);
        } else {
            weather.fetchWeather("Lucknow");  // Default city changed to Lucknow
        }
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

// Fetch weather for Lucknow by default
weather.fetchWeather("Lucknow");

geocode.getLocation();
