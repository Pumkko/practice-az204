import { WeatherForecastModel } from "../models/WeatherForecastModel";

export interface WeatherForecastItemProps {
    forecast: WeatherForecastModel
}

export default function WeatherForecastItem(props: WeatherForecastItemProps) {

    return <div>
        Forecast
        <ul>
            <li>{props.forecast.date}</li>
            <li>{props.forecast.summary}</li>
            <li>{props.forecast.temperatureC}</li>
            <li>{props.forecast.temperatureF}</li>
        </ul>
    </div>

}