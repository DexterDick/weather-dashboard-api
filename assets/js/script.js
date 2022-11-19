const API_KEY = "9de2a989cdaf88ab55b1e8d025ae0186";
let defaultCity = "Toronto";
const date = dayjs().format("MM/DD/YYYY");
const hour = dayjs().format("h");
console.log(hour);

// call get weather to start
init();
function init() {
  getWeather();
  defaultCity = "";
}

function getWeather() {
  let city;

  if (defaultCity === "Toronto") {
    city = defaultCity;
  } else {
    city = $("input[type='text']").val().trim();
  }

  console.log(city);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      // Call display weather function
      displayWeather(data);
      // call fiveDayForecast
      let { lon, lat } = data.coord;
      fiveDayForecast(lon, lat);
    });
}

function fiveDayForecast(lon, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then((data) => {
      let weatherData = data.list;
      let fiveDayForecast = [];
      for (let i = 0; i < weatherData.length; i += 1) {
        let [date, time] = weatherData[i].dt_txt.split(" ");

        const fiveDayOBJ = {
          date: date,
          icon: weatherData[i].weather[0].icon,
          temp: weatherData[i].main.temp,
          wind: weatherData[i].wind.speed,
          humidity: weatherData[i].main.humidity,
        };

        if (time === "12:00:00") {
          console.log("Time");
          fiveDayForecast.push(fiveDayOBJ);
        }
      }
      createForcast(fiveDayForecast);
    });
}

function displayWeather(data) {
  $(".city-date").text(`${data.name} ${date}`);
  $(".temp").text(`Temp: ${data.main.temp} °F`);
  $(".wind").text(`Wind: ${data.wind.speed} MPH`);
  $(".humidity").text(`Humidity: ${data.main.humidity} %`);
}

function createForcast(days) {
  for (let i = 0; i < days.length; i += 1) {
    let articleEL = $("<article>");
    let h5EL = $("<h5>").text(days[i].date);
    let p1EL = $("<p>").text(`Temp: ${days[i].temp} °F`);
    let p2EL = $("<p>").text(`Wind: ${days[i].wind} MPH`);
    let p3EL = $("<p>").text(`Humidity: ${days[i].temp}%`);

    articleEL.append(h5EL, p1EL, p2EL, p3EL);
    $(".grid").append(articleEL);
  }
}

// click to search by city name
$("button").click(getWeather);
