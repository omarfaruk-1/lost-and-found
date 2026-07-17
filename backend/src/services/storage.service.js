import ImageKit from "@imagekit/nodejs";
import appConfig from "../config/appConfig.js";



const imageKitClient= new ImageKit({
     privateKey:appConfig.IMAGE_KIT_PRIVET_KEY,
     publicKey:appConfig.IMAGE_KIT_PUBLIC_KEY,
     endPoint:appConfig.IMAGE_KIT_ENDPOINT
});

async function uploadImage(file,folder){
    const result= await imageKitClient.files.upload({
        file,
        fileName:"image "+Date.now(),
        folderName:"lost and found/"+folder
    });
    return result;
}

async function imageDelete(fileId){
    const result = await imageKitClient.files.delete(fileId);
    return result;
}

export default {uploadImage,imageDelete};