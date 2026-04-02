import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.ts";

export const uploadImageService = async (fileBuffer: Buffer) => {
    const imageUrl = await uploadToCloudinary(fileBuffer, "test_cases");
    return { url: imageUrl };
};

export const deleteImageService = async (imageUrl: string) => {
    await deleteFromCloudinary(imageUrl);
    return true;
};
