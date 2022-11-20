const API_KEY = "9de2a989cdaf88ab55b1e8d025ae0186";
let defaultCity = "Toronto";
const date = dayjs().format("MM/DD/YYYY");
let cityArr = [];
let storedCities = [];
let uniqueCityNames = [];
let city;

// call get weather to start
init();
function init() {
  getWeather(defaultCity);
  // load citys stored in local storage
  storedCities = JSON.parse(localStorage.getItem("cities"));
  if (storedCities !== null) {
    cityArr = storedCities;
  }

  defaultCity = "";
}

function getWeather(city) {
  if (city === "") {
    return;
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log("Not Successful");
      }
    })
    .then((data) => {
      // Call display weather function
      displayWeather(data);
      // call fiveDayForecast
      let { lon, lat } = data.coord;
      fiveDayForecast(lon, lat);

      // saves city name to city array
      cityArr.push(city);
      $.each(cityArr, function (i, el) {
        if ($.inArray(el, uniqueCityNames) === -1) uniqueCityNames.push(el);
      });
      // saves to local storange
      saveCityLocal();
      // display history data stored in local storage
      displayCities();
    })
    .catch((error) => $("input[type='text']").val(""));
}

function fiveDayForecast(lon, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((data) => {
      let weatherData = data.list;
      let fiveDayForecast = [];
      for (let i = 0; i < weatherData.length; i += 1) {
        let [date, time] = weatherData[i].dt_txt.split(" ");
        // saves five day weather
        const fiveDayOBJ = {
          date: date,
          icon: weatherData[i].weather[0].icon,
          temp: weatherData[i].main.temp,
          wind: weatherData[i].wind.speed,
          humidity: weatherData[i].main.humidity,
        };

        if (time === "12:00:00") {
          fiveDayForecast.push(fiveDayOBJ);
        }
      }
      createForcast(fiveDayForecast);
    });
}

function saveCityLocal() {
  localStorage.setItem("cities", JSON.stringify(uniqueCityNames));
}

function displayCities() {
  // clears li elements
  $("li").remove();

  for (let i = 0; i < uniqueCityNames.length; i++) {
    const liEL = $("<li >").addClass("list-group-item");
    const aEL = $("<a>").attr("href", "#").text(uniqueCityNames[i]);
    liEL.append(aEL);
    $("ul").append(liEL);
  }
}

function displayWeather(data) {
  $(".city-date").text(`${data.name} (${date})`);
  $("img").attr(
    `src`,
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  $(".temp").text(`Temp: ${data.main.temp} °F`);
  $(".wind").text(`Wind: ${data.wind.speed} MPH`);
  $(".humidity").text(`Humidity: ${data.main.humidity} %`);
}

function createForcast(days) {
  // clears article elements and creates new ones.
  $("article").remove();
  for (let i = 0; i < days.length; i += 1) {
    let articleEL = $("<article>");
    let h5EL = $("<h5>").text(days[i].date);

    let iconEL = $("<img>").attr(
      `src`,
      ` http://openweathermap.org/img/wn/${days[i].icon}.png`
    );
    let p1EL = $("<p>").text(`Temp: ${days[i].temp} °F`);
    let p2EL = $("<p>").text(`Wind: ${days[i].wind} MPH`);
    let p3EL = $("<p>").text(`Humidity: ${days[i].temp}%`);

    articleEL.append(h5EL, iconEL, p1EL, p2EL, p3EL);
    $(".grid").append(articleEL);
  }
}

// click to search by city name
$("button").click(function () {
  let strCity = $("input[type='text']").val().trim();
  city = strCity.charAt(0).toUpperCase() + strCity.slice(1);
  getWeather(city);
  // clear input
  $("input[type='text']").val("");
});
$(document).on("click", "a", function () {
  city = this.text;
  getWeather(city);
});
