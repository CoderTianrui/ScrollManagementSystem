import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8095/api/", // for local testing, run backend first, then frontend
  //baseURL: "http://20.211.46.108:8095/api/"  // for deployment, choose one to use
});

export default axiosInstance;
