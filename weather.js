const API_KEY = "8c900f3e949f21d5afdab9d2e89ea5e4";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".icon");

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

async function checkWeather(city) {
    const response = await fetch(`${BASE_URL}&q=${city}&appid=${API_KEY}`);

    if(response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        return;
    }else {
        var data = await response.json();
    }
    
    document.querySelector(".error").style.display = "none";

   

   
    
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    if(data.weather[0].main === "Clouds") {
        document.querySelector(".icon").src = "clouds.png";
    } else if(data.weather[0].main === "Clear") {
        document.querySelector(".icon").src = "clear.png";
    } else if(data.weather[0].main === "Rain") {
        document.querySelector(".icon").src = "rain.png";
    } else if(data.weather[0].main === "Drizzle") {
        document.querySelector(".icon").src = "drizzle.png";
    } else if(data.weather[0].main === "Mist") {
        document.querySelector(".icon").src = "mist.png";
    }

    document.querySelector(".weather").style.display = "block";


}

checkWeather();
