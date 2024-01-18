import axios from "axios";

const BASE_URL = 'http://expense.localhost:8000/api';


const API = axios.create({
    baseURL: BASE_URL,
    headers:{
        "Content-Type": 'application/json',
        'Authorization': 'token 1438e764b298bac:ecd354c945dd9ba'
    },
    withCredentials: true
});



export default API;