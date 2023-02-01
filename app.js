// Interação
const citySearchInput = document.getElementById('city-search-input')
const citySearchButton = document.getElementById('city-search-button')

//Exibição
const currentDate = document.getElementById('current-date')
const cityName = document.getElementById('city-name')
const weatherIcon = document.getElementById('weather-icon')
const weatherDescription = document.getElementById('weather-description')
const currentTemperature = document.getElementById('current-temperature')
const windSpeed = document.getElementById('wind-speed')
const feelsLikeTemperature = document.getElementById('feels-like-temperature')
const currentHumidity = document.getElementById('current-humidity')
const sunriseTime = document.getElementById('sunrise-time')
const sunsetTime = document.getElementById('sunset-time')

const api_key = "d227c6197c4a61ea7ae37891b4b096d7"

citySearchButton.addEventListener("click", () => {
    let cityName = citySearchInput.value
    getCityWeather(cityName)

})

navigator.geolocation.getCurrentPosition( //Perguntando se posso usar a localização
    (position) => {
        let lat = position.coords.latitude
        let lon = position.coords.longitude

        getCurrentLocationWeather(lat, lon)        
    },
    (err) => {
        if (err.code === 1){
            window.alert("Geolocalização negada, use a barra de pesquisa")
        } else{
            console.log(err)
        }
        
    }
)

function getCurrentLocationWeather (lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`)
            .then((res) => res.json())
            .then((data) => displayWeather(data))
}

function getCityWeather(cityName) {
    
    weatherIcon.src=`./assets/loading-icon.svg`
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${api_key}`) //Estou buscando os dados da API
        .then((res) => res.json()) //.then (ENTÃO) estou convertendo os dados dessa API
        .then((data) => displayWeather(data)) //Então estou executando uma nova função, mandando essas informações que recebi
}

function displayWeather(data){
    let {
        dt,
        name,
        weather: [{ icon, description }],
        main: { temp, feels_like, humidity },
        wind: { speed },
        sys: { sunrise, sunset },
    } = data

    currentDate.textContent = formatDate(dt)
    cityName.textContent = name
    weatherIcon.src=`./assets/${icon}.svg`
    weatherDescription.textContent = description
    currentTemperature.textContent = `${Math.round(temp)}ºC`
    windSpeed.textContent = `${Math.round(speed * 3.6)} Km/h`  
    feelsLikeTemperature.textContent = `${Math.round(feels_like)}ºC` 
    currentHumidity.textContent = `${humidity} %`
    sunriseTime.textContent = formatTime(sunrise)
    sunsetTime.textContent = formatTime(sunset)

}

function formatDate(epochTime) {
    let date = new Date(epochTime * 1000)
    let formattDate = date.toLocaleDateString('pt-BR', {month: "long", day:"numeric"})
    return `Hoje, ${formattDate}`
}

function formatTime (epochTime){
    let date = new Date(epochTime * 1000)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    return `${hours}: ${minutes}`
}