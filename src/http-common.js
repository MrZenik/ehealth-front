import axios from "axios";

export default axios.create({
    baseURL: "https://ehealth-back-tz.herokuapp.com/api",
    headers: {
        "Content-type": "application/json"
    }
});