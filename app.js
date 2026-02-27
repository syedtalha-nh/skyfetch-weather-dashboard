const apiKey = "97e26f06cc681025a7aa905fb3c4a10f";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const messageDiv = document.getElementById("message");

const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("weather-icon");

/* 🌦 Get Weather Function */
async function getWeather(city) {
  try {
    showLoading();
    searchBtn.disabled = true;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    cityNameEl.innerText = data.name;
    tempEl.innerText = `Temperature: ${data.main.temp}°C`;
    descEl.innerText = `Condition: ${data.weather[0].description}`;
    iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    messageDiv.innerHTML = "";

  } catch (error) {
    showError("City not found. Please enter a valid city name.");
  } finally {
    searchBtn.disabled = false;
  }
}

/* ❌ Show Error */
function showError(msg) {
  messageDiv.innerHTML = `<p class="error">${msg}</p>`;
}

/* ⏳ Show Loading */
function showLoading() {
  messageDiv.innerHTML = `<div class="spinner"></div>`;
}

/* 🔍 Search Button Click */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  getWeather(city);
  cityInput.value = "";
  cityInput.focus();
});

/* ⌨ Enter Key Support */
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

/* 🌍 Initial Load */
getWeather("London");
