import { useQuery } from '@tanstack/react-query'
import { WeatherForecastModel } from "../models/WeatherForecastModel";
import WeatherForecastItem from "./WeatherForecastItem";
import { protectedResources } from "../../msalConfig";
import { axiosInstance } from '../../axiosConfig';

export default function WeatherForecast() {
    const { data } = useQuery<WeatherForecastModel[]>({
        queryKey: ['weatherForecast'],
        queryFn: async () => {
            const response = await axiosInstance.get(protectedResources.api.weatherForecast);
            return response.data;
        }
    })

    return <div>
        Hello From Protected Forecast
        {
            data?.map(d => <WeatherForecastItem forecast={d} />)
        }
    </div>

}