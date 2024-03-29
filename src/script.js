function formatDate(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let data = date.getDate();

  return `${day}, ${month} ${data}`;
}
let fullDate = document.querySelector("#date");
let currentDate = new Date();
fullDate.innerHTML = formatDate(currentDate);

function formatTime(time) {
  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}
let currentTime = document.querySelector("#time");
currentTime.innerHTML = formatTime(currentDate);

function getPosition(position) {
  let apiKey = "e80f735c22f9cc78cdfe65b74bebba0a";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiLink = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiLink).then(showWeather);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener("click", getLocation);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", getInput);

function getInput(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let city = `${searchInput.value}`;
  searchCity(city);
}

function searchCity(city) {
  let apiKey = "e80f735c22f9cc78cdfe65b74bebba0a";
  let units = "metric";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiURL}`).then(showWeather);
}

function getDaysForecast(coordinates) {
  let apiDaysURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=96771e971243152d6b8948878c26adde&units=metric`;
  axios.get(apiDaysURL).then(displayDaysWeather);
}

let celciusTemperature = null;
let feelsLikeTemperature = null;
let windKmH = null;
let tempDay2 = null;

function showWeather(response) {
  document.querySelector("#current-city").innerHTML = response.data.name;
  celciusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML =
    Math.round(celciusTemperature);
  feelsLikeTemperature = response.data.main.feels_like;
  document.querySelector("#feels-like-temperature").innerHTML =
    Math.round(feelsLikeTemperature);
  document.querySelector(
    "#humidity"
  ).innerHTML = ` ${response.data.main.humidity}%`;
  windKmH = response.data.wind.speed;
  document.querySelector("#wind").innerHTML = ` ${Math.round(windKmH)}`;
  document.querySelector("#sky").innerHTML =
    response.data.weather[0].description;
  document
    .querySelector("#current-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#current-icon")
    .setAttribute("alt", `${response.data.weather[0].description}`);

  getDaysForecast(response.data.coord);
}

function formatDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayDaysWeather(response) {
  let forecast = response.data.daily;
  let daysWeather = document.querySelector("#days-weather");
  let daysWeatherHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      daysWeatherHTML =
        daysWeatherHTML +
        `         <div class="col">
              <div class="daysWeatherDate">${formatDays(forecastDay.dt)}</div>
              <img class="daysImg" alt="${
                forecastDay.weather[0].description
              }" src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" />
              <p class="daysTemperature">
                <span class="daysTempMax" id="day2-temp">${Math.round(
                  forecastDay.temp.max
                )}°</span>
                <span class="daysTempMin">${Math.round(
                  forecastDay.temp.min
                )}°</span>
              </p>
              </div>`;
    }
  });

  daysWeatherHTML = daysWeatherHTML + `</div>`;
  daysWeather.innerHTML = daysWeatherHTML;
}

function displayCitiesLink(city) {
  let citiesLinks = document.querySelector("#cities-link");
  let cities = ["Lisbon", "Paris", "London", "Warsaw", "Prague"];
  let citiesLinksHTML = `<div class="row">`;
  cities.forEach(function (city) {
    citiesLinksHTML =
      citiesLinksHTML +
      `                   <div class="col">
            <a id=${city} href="">${city}</a></div>`;
  });

  citiesLinksHTML = citiesLinksHTML + `</div>`;
  citiesLinks.innerHTML = citiesLinksHTML;

  cities.forEach(function (city) {
    function searchCities(event) {
      event.preventDefault();
      searchCity(city);
      document.querySelector("#search-input").setAttribute("value", `${city}`);
    }
    document.querySelector(`#${city}`).addEventListener("click", searchCities);
  });
}
searchCity("Kyiv");
displayCitiesLink();
