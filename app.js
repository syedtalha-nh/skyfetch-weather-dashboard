function WeatherApp() {
  this.apiKey = "97e26f06cc681025a7aa905fb3c4a10f";

  // DOM references
  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.messageDiv = document.getElementById("message");

  this.cityNameEl = document.getElementById("city-name");
  this.tempEl = document.getElementById("temperature");
  this.descEl = document.getElementById("description");
  this.iconEl = document.getElementById("weather-icon");

  this.forecastContainer = document.getElementById("forecast");
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  });

  this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
  this.messageDiv.innerHTML = "<p>Search for a city to see weather forecast 🌍</p>";
};

WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();

  if (!city) {
    this.showError("Please enter a city name.");
    return;
  }

  this.getWeather(city);
  this.cityInput.value = "";
};

WeatherApp.prototype.getWeather = async function (city) {
  try {
    this.showLoading();
    this.searchBtn.disabled = true;

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherURL),
      axios.get(forecastURL)
    ]);

    this.displayWeather(weatherRes.data);

    const processedForecast = this.processForecastData(forecastRes.data.list);
    this.displayForecast(processedForecast);

    this.messageDiv.innerHTML = "";

  } catch (error) {
    this.showError("City not found. Please try again.");
  } finally {
    this.searchBtn.disabled = false;
  }
};

WeatherApp.prototype.displayWeather = function (data) {
  this.cityNameEl.innerText = data.name;
  this.tempEl.innerText = `Temperature: ${data.main.temp}°C`;
  this.descEl.innerText = `Condition: ${data.weather[0].description}`;
  this.iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

WeatherApp.prototype.processForecastData = function (forecastList) {
  const filtered = forecastList.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  return filtered.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (forecastData) {
  this.forecastContainer.innerHTML = "";

  forecastData.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    const card = `
      <div class="forecast-card">
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
        <p>${day.main.temp}°C</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;

    this.forecastContainer.innerHTML += card;
  });
};

WeatherApp.prototype.showLoading = function () {
  this.messageDiv.innerHTML = `<div class="spinner"></div>`;
};

WeatherApp.prototype.showError = function (msg) {
  this.messageDiv.innerHTML = `<p class="error">${msg}</p>`;
};

const app = new WeatherApp();
app.init();
