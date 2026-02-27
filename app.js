function WeatherApp() {
  this.apiKey = "97e26f06cc681025a7aa905fb3c4a10f";

  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.messageDiv = document.getElementById("message");

  this.cityNameEl = document.getElementById("city-name");
  this.tempEl = document.getElementById("temperature");
  this.descEl = document.getElementById("description");
  this.iconEl = document.getElementById("weather-icon");

  this.forecastContainer = document.getElementById("forecast");

  this.recentContainer = document.getElementById("recentSearches");
  this.clearBtn = document.getElementById("clearHistoryBtn");

  this.recentSearches = [];
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") this.handleSearch();
  });
  this.clearBtn.addEventListener("click", this.clearHistory.bind(this));

  this.loadRecentSearches();
  this.loadLastCity();
};

WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();
  if (!city) return this.showError("Please enter a city name.");
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

    const processed = this.processForecastData(forecastRes.data.list);
    this.displayForecast(processed);

    this.saveRecentSearch(weatherRes.data.name);
    localStorage.setItem("lastCity", weatherRes.data.name);

    this.messageDiv.innerHTML = "";
  } catch (error) {
    this.showError("City not found.");
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

WeatherApp.prototype.processForecastData = function (list) {
  const filtered = list.filter(item => item.dt_txt.includes("12:00:00"));
  return filtered.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (data) {
  this.forecastContainer.innerHTML = "";
  data.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    this.forecastContainer.innerHTML += `
      <div class="forecast-card">
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>
        <p>${day.main.temp}°C</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;
  });
};

WeatherApp.prototype.showLoading = function () {
  this.messageDiv.innerHTML = `<div class="spinner"></div>`;
};

WeatherApp.prototype.showError = function (msg) {
  this.messageDiv.innerHTML = `<p class="error">${msg}</p>`;
};

WeatherApp.prototype.loadRecentSearches = function () {
  const saved = JSON.parse(localStorage.getItem("recentSearches")) || [];
  this.recentSearches = saved;
  this.displayRecentSearches();
};

WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(c => c !== city);
  this.recentSearches.unshift(city);
  if (this.recentSearches.length > 5) this.recentSearches.pop();

  localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));
  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
  this.recentContainer.innerHTML = "";
  this.recentSearches.forEach(city => {
    const btn = document.createElement("button");
    btn.className = "recent-btn";
    btn.innerText = city;
    btn.addEventListener("click", () => this.getWeather(city));
    this.recentContainer.appendChild(btn);
  });
};

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) this.getWeather(lastCity);
};

WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches");
  this.recentSearches = [];
  this.displayRecentSearches();
};

const app = new WeatherApp();
app.init();
