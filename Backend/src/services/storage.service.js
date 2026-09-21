import Imagekit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new Imagekit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export const uploadFiles = async ({ filename, folder = "Velora", buffer }) => {
  const file = await toFile(buffer, filename);
  const result = await client.files.upload({
    file: file,
    fileName: filename,
    folder: folder,
  });
  return result.url;
};
