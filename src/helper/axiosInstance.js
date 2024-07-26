import axios from "axios";

const axiosInstance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
	withCredentials: true,
	// timeout: 10000,
	// headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
