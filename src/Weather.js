import React, { useEffect } from "react";
import axios from "axios";

export default function Weather(){
    let city = "New York";

    useEffect(() => {
        function handleResponse(response){
            alert(`The weather in ${city} is ${response.data.temperature.current}ºF`)
        }

        let apiKey = "0232oa2bd084ect6f17c5fee93b97744";
        let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
        axios.get(apiUrl).then(handleResponse);
    }, [city]);

    return <h2>Hello from New York!</h2>
}
