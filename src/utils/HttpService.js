import axios from 'axios';
import {BACKEND_INFO} from "../config";
const instance = axios.create({
    baseURL: BACKEND_INFO.address
});
instance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        if (error.response) {
            return Promise.reject(error.response.data);
        }else{
            console.log(BACKEND_INFO);
            console.log(error);
            return Promise.reject(new Error("网络错误，请检查网络连接"))
        }
    }
);
export const HttpService = instance;
