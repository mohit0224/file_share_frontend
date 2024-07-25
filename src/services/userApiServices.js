import axiosInstance from "@/helper/axiosInstance";

class authService {
	signupUser = async (data) => await axiosInstance.post("/users", data);

	loginUser = async (data) =>
		await axiosInstance.post("/users/login", data, {
			headers: {
				Cookie: context.req.headers.cookie || "",
			},
		});

	changePassword = async (data) =>
		await axiosInstance.post("/users/change-password", data);

	logoutUser = async () =>
		await axiosInstance.post("/users/logout", {
			headers: {
				Cookie: context.req.headers.cookie || "", // Pass cookies from server to the API request
			},
		});

	getUser = async () => await axiosInstance.get("/users");

	updateProfileImage = async (data) =>
		await axiosInstance.post("/users/update-user-image", data, {
			headers: { "Content-Type": "multipart/form-data" },
		});
}

const authServices = new authService();

export default authServices;
