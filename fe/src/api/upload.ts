import { privateClient } from "./client";
import type { UploadImageResponse } from "../models";


export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
   const response = await privateClient.post<UploadImageResponse>("upload/image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const deleteImageByKey = async (key: string) => {
    return privateClient.delete("upload/image", {
        data: { key },
    });
};
