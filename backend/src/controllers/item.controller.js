import appError from "../errors/appError.js";
import itemModel from "../models/item.model.js";
import uploadImage from "../services/storage.service.js";


async function items(req,res,next){
    try {
        const {itemName,category,type,description,location,date}=req.body;
        const files=req.files;  
        console.log(itemName)
        if(!files || !itemName || !category || !type || !description || !location || !date) return next(new appError("Image is required",400));
        const folder= type==="lost"? "lost": "found"
        const result = await Promise.all(files.map((file)=>uploadImage(file.buffer.toString("base64"),folder)));
        const imageUrl=result.map((urls)=>urls.url);
        const item = await itemModel.create({
            itemName,
            category,
            type,
            description,
            images:imageUrl,
            location,
            date,
            postedBy:req.user._id
        })

        res.status(201).json({
            message:"Item posted successfully",
            data:item
        })
    } catch (error) {
        next(error)
    }
}



export default {items}