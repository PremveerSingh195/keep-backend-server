import { v2 as cloudinary} from "cloudinary";
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localfilepath : string) => {
    try {
        if (!localfilepath) return null
        // uploading the file on cloudinary
       const response = await cloudinary.uploader.upload(localfilepath , {
            resource_type : "auto"
        })

        //file uploaded succesfully

        console.log("file is uploaded on cloudinary" , response.url);
        fs.unlinkSync(localfilepath)

        return response 
        
    } catch (error) {
      fs.unlinkSync(localfilepath)
      console.log("Error while uploading file to cloudinary");
      
      //remove the temporary saved local file as the upload operation got failed
      return null
    }
}

export {uploadOnCloudinary}

