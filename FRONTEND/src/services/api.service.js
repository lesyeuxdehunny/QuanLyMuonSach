import axios from "axios";

const createAPI = axios.create({
  baseURL: "http://localhost:2511",
  headers: {
    "Content-Type": "application/json",
  },
});

export default createAPI;