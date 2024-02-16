
import axios from 'axios'
import { msalInstance, protectedResources } from './msalConfig';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_ROOT
})

axiosInstance.interceptors.request.use(async (config) => {
    const response = await msalInstance.acquireTokenSilent({
        scopes: protectedResources.api.scopes.read
    });
    const bearer = `Bearer ${response.accessToken}`;
    config.headers.setAuthorization(bearer)

    return config;
}, function (error) {
    console.log(error)
    return Promise.reject(error);
});