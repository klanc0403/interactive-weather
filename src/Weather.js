import React, { useEffect, useState } from "react";

export default function Weather(){
    const apiKey = "0232oa2bd084ect6f17c5fee93b97744";
    const [city, setCity] = useState("New York");
    const [searchCity, setSearchCity] = useState("New York");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [unit, setUnit] = useState("fahrenheit");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadWeather() {
            setIsLoading(true);
            setError("");

            try {
                const encodedCity = encodeURIComponent(city);
                const currentUrl = `https://api.shecodes.io/weather/v1/current?query=${encodedCity}&key=${apiKey}&units=imperial`;
                const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${encodedCity}&key=${apiKey}&units=imperial`;
                const [currentResponse, forecastResponse] = await Promise.all([
                    fetch(currentUrl),
                    fetch(forecastUrl),
                ]);

                if (!currentResponse.ok || !forecastResponse.ok) {
                    throw new Error("Unable to load weather data.");
                }

                const currentData = await currentResponse.json();
                const forecastData = await forecastResponse.json();

                setWeather(currentData);
                setForecast(forecastData.daily.slice(0, 6));
                setSearchCity(currentData.city);
            } catch (error) {
                setError(error.message);
                setWeather(null);
                setForecast([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadWeather();
    }, [city]);

    function search(event) {
        event.preventDefault();

        if (searchCity.trim()) {
            setCity(searchCity.trim());
        }
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const day = days[date.getDay()];
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day} ${hours}:${minutes}`;
    }

    function formatDay(timestamp) {
        const date = new Date(timestamp * 1000);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        return days[date.getDay()];
    }

    function convertToCelsius(fahrenheit) {
        return ((fahrenheit - 32) * 5) / 9;
    }

    function formatTemperature(fahrenheit) {
        if (unit === "celsius") {
            return Math.round(convertToCelsius(fahrenheit));
        }

        return Math.round(fahrenheit);
    }

    function toggleUnit(event) {
        event.preventDefault();
        setUnit(unit === "fahrenheit" ? "celsius" : "fahrenheit");
    }

    return (
        <section className="weather-app">
            <header>
                <h1 className="weather-title">Interactive Weather Forecast</h1>

                <form id="search-form" className="search-form" onSubmit={search}>
                    <input
                        id="search-input"
                        className="search-input"
                        type="search"
                        placeholder="Enter a city..."
                        required
                        value={searchCity}
                        onChange={(event) => setSearchCity(event.target.value)}
                    />
                    <input type="submit" value="Search" className="search-button" />
                </form>
            </header>

            {error && <p className="weather-error">{error}</p>}
            {isLoading && <p className="weather-status">Loading weather...</p>}

            {weather && !isLoading && (
                <main>
                    <div className="current-weather">
                        <div>
                            <h1 id="current-city" className="current-city">{weather.city}</h1>
                            <p className="current-details">
                                <span id="time">{formatDate(weather.time)}</span>,{" "}
                                <span id="description">{weather.condition.description}</span>
                                <br />
                                Humidity: <strong id="humidity">{weather.temperature.humidity}%</strong>,{" "}
                                Wind: <strong id="wind">{weather.wind.speed} mph</strong>
                            </p>
                        </div>

                        <div className="current-temperature">
                            <img
                                id="icon"
                                src={weather.condition.icon_url}
                                alt={weather.condition.description}
                                className="current-temperature-icon"
                            />
                            <span id="current-temperature" className="current-temperature-value">
                                {formatTemperature(weather.temperature.current)}
                            </span>
                            <span className="current-temperature-unit">
                                <a href="/" onClick={toggleUnit}>
                                    {unit === "fahrenheit" ? "°F" : "°C"}
                                </a>
                            </span>
                        </div>
                    </div>

                    <div id="forecast" className="weather-forecast">
                        {forecast.map((day) => (
                            <div className="weather-forecast-day" key={day.time}>
                                <div className="weather-forecast-date">{formatDay(day.time)}</div>
                                <img
                                    src={day.condition.icon_url}
                                    alt={day.condition.description}
                                    className="weather-forecast-icon"
                                />
                                <div className="weather-forecast-temperatures">
                                    <div className="weather-forecast-temperature">
                                        <strong>{formatTemperature(day.temperature.maximum)}°</strong>
                                    </div>
                                    <div className="weather-forecast-temperature">
                                        {formatTemperature(day.temperature.minimum)}°
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            )}

            <footer>
                <p>
                    This project was coded by Kelly S. Lançon 
                    and is{" "}
                    <a
                        href="https://github.com/kellyisasinger17/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        on GitHub
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://interactiveweather.netlify.app"
                        target="_blank"
                        rel="noreferrer"
                    >
                        hosted on Netlify
                    </a>
                </p>
            </footer>
        </section>
    );
}
