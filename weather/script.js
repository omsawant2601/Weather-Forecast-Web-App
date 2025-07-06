const API_KEY = "2b815237f3a0229f4a8f111d9d7e2b92";

const Input = document.querySelector(".searchbar input");
const searchBtn = document.querySelector(".searchbar button");

const mainTemp = document.querySelector(".main1 span h1")
const conditionImg = document.querySelector(".main1 span img")
const mainCondition = document.querySelector(".main1 span h2")
const mainDisp = document.querySelector(".main1  p");
const wind = document.querySelector(".speed h3");
const mph1 = document.querySelectorAll(".mph h3")[0];
const gust = document.querySelectorAll(".gust h3")[0];
const img = document.querySelector(".main1 span img")
const sunRise = document.querySelector(".sunrise h2")
const sunSet = document.querySelector(".sunset h2")
const minTemp = document.querySelector(".mintemp h3")
const maxTemp = document.querySelector(".maxtemp h3")


const Feel = document.querySelector(".feel span")
const pressure = document.querySelector(".pressure span")
const visibility = document.querySelector(".visibility span")
const humidity = document.querySelector(".humidity span")

const hourlyCards = document.querySelectorAll(".hourly .cardx")
const dailyCards = document.querySelectorAll(".day10 .cardx")


searchBtn.addEventListener("click", () => {
    const city = Input.value.trim();
    if (city) {
        getWeather(city);
        console.log(city)
    }
});

async function getWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        const icon = data.weather[0].icon;
        const sunrisetime = new Date(data.sys.sunrise*1000);
        const sunsettime = new Date(data.sys.sunset*1000);
        const timeline = {hour:'2-digit',minute:'2-digit',hour12:true};

        if (data.cod === 200) {
            mainTemp.innerHTML = `${Math.round(data.main.temp)}&deg;C `;
            mainCondition.innerHTML = `${data.weather[0].main}`;
            mainDisp.innerHTML = data.weather[0].description;
            Feel.innerHTML = `${Math.round(data.main.feels_like)} &deg;C`;
            visibility.innerHTML = `${(data.visibility / 1000)} mi`;
            pressure.innerHTML = data.main.pressure;
            humidity.innerHTML = data.main.humidity;
            wind.innerHTML= data.wind.speed;
            mph1.innerHTML = data.wind.deg;
            gust.innerHTML = data.wind.gust;
            img.src =`https://openweathermap.org/img/wn/${icon}.png`;
            sunRise.innerHTML = sunrisetime.toLocaleTimeString('en-us',timeline);
            sunSet.innerHTML = sunsettime.toLocaleTimeString('en-us',timeline)
            minTemp.innerHTML = `${(data.main.temp_min)}&deg;C `;
            maxTemp.innerHTML = `${(data.main.temp_max)}&deg;C `;
        }   
        const lon = data.coord.lon;
        const lat = data.coord.lat;

        getForecast(lon, lat)

    }
    catch {

    }

}

async function getForecast(lon, lat) {
    try{
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        const response2 = await fetch(url);
        const castdata = await response2.json();

        for (let i = 0; i < 10; i++) {
            const item = castdata.list[i];
            const card = hourlyCards[i];
            if (!item || !card) break;
            const time = new Date(item.dt * 1000).getHours();
            const temp = Math.round(item.main.temp);
            const icon = item.weather[0].icon;

            card.querySelector("h4").innerHTML = `${time}:00`;
            card.querySelectorAll("h4")[1].innerHTML = `${temp} &deg;C`;
            card.querySelector("img").src = `https://openweathermap.org/img/wn/${icon}.png`
        }

         for (let i = 0; i < dailyCards.length; i++) {
      const item = castdata.list[i * 8];
      if (!item) break;
      const day  = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].icon;
      const card = dailyCards[i];
      card.querySelectorAll("h4")[0].textContent = day;
      card.querySelectorAll("h4")[1].innerHTML   = `${temp} °C`;
      card.querySelector("img").src              = `https://openweathermap.org/img/wn/${icon}.png`;
    }
  } catch (err) {
    console.error(err);
  }
}
