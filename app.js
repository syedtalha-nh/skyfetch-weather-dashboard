const apiKey = "97e26f06cc681025a7aa905fb3c4a10f";
const city = "London";

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(apiUrl)
  .then(function(response) {
    
    const data = response.data;

    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    document.getElementById("city-name").innerText = cityName;
    document.getElementById("temperature").innerText = `Temperature: ${temperature}°C`;
    document.getElementById("description").innerText = `Condition: ${description}`;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  })
  .catch(function(error) {
    console.error("Error fetching weather data:", error);
  });
