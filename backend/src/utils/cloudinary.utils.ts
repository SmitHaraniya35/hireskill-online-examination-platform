import cloudinary from "../config/cloudinary.config.ts";

export const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error: any, result: any) => {
        if (error) return reject(error);
        if (result) resolve(result.secure_url as string);
        else reject(new Error("Cloudinary upload failed: No result returned"));
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    // Extract public_id from Cloudinary URL:
    // https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/public_id.jpg
    const parts = imageUrl.split("/");
    const filenameWithExt = parts.pop() || "";
    const publicIdWithFolder = parts.slice(parts.indexOf("upload") + 2).join("/"); // everything after /upload/vxxxx/
    const publicId = `${publicIdWithFolder}/${filenameWithExt.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary deletion failed:", err);
  }
};

