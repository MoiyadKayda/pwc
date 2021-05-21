import axios from "axios";

const instance = axios.create({
    baseURL: "https://pwc-backend.herokuapp.com/"
});

export default instance;
