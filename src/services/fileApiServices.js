import axiosInstance from "@/helper/axiosInstance";

class fileService {
	createFile = async (data) =>
		await axiosInstance.post("/files", data, {
			headers: { "Content-Type": "multipart/form-data" },
		});

	getSingleFile = async (id) => await axiosInstance.get(`/files/${id}`);

	downloadFile = async (id, password) =>
		await axiosInstance({
			url: `/files/download/${id}?password=${password}`,
			method: "GET",
			responseType: "blob",
		});

	deleteFile = async (id) => await axiosInstance.delete(`/files/${id}`);
}

const fileServices = new fileService();

export default fileServices;
