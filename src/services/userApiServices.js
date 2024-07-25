import axiosInstance from "@/helper/axiosInstance";

class authService {
	signupUser = async (data) => await axiosInstance.post("/users", data);

	loginUser = async (data) => await axiosInstance.post("/users/login", data);

	changePassword = async (data) =>
		await axiosInstance.post("/users/change-password", data);

	logoutUser = async () => await axiosInstance.post("/users/logout");

	getUser = async () => await axiosInstance.get("/users");

	updateProfileImage = async (data) =>
		await axiosInstance.post("/users/update-user-image", data, {
			headers: { "Content-Type": "multipart/form-data" },
		});
}

const authServices = new authService();

export default authServices;
