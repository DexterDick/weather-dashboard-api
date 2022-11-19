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
      $(".city-date").text(data.name + " " + date);
      $(".temp").text(data.main.temp);
      $(".wind").text(data.wind.speed);

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
      $(".humidity").text(data.list[0].main.humidity);

      let [date, time] = data.list[3].dt_txt.split(" ");
      const fiveDayForecast = {
        date: date,
        temp: 3,
        wind: 3,
        humidity: 4,
      };
      console.log(date, time);
    });
}

$("button").click(getWeather);
