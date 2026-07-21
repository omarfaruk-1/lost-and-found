import mongoose from "mongoose";
import appError from "../errors/appError.js";
import itemModel from "../models/item.model.js";
import storageService from "../services/storage.service.js";


async function items(req,res,next){
    try {
        const {itemName,category,type,description,location,date}=req.body;
        const files=req.files;  
        if(!itemName || !category || !type || !description || !location || !date) return next(new appError("All required fields must be provided",400));
        if(!files || files.length===0) return next(new appError("At least one image is required",400));
        const folder= type;
        
        const result = await Promise.all(files.map((file)=>storageService.uploadImage(file.buffer.toString("base64"),folder)));
        const images =result.map(image=>({
            url:image.url,
            fileId:image.fileId
        }))
        const item = await itemModel.create({
            itemName,
            category,
            type,
            description,
            images,
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

async function getItems(req,res,next){
    try {
        const {itemName,type,category,location,sort,page,limit}=req.query;
        const query={};

        if(itemName) query.itemName={$regex:itemName,$options:"i"};
        if(type) query.type=type;
        if(category) query.category=category;
        if(location) query.location=location;

        let sortOption={createdAt:-1}
        if(sort==="latest") sortOption={createdAt:-1}
        if(sort==="oldest") sortOption={createdAt:1};
        if(sort==="az") sortOption={itemName:1};
        if(sort==="za") sortOption={itemName:-1};
        
        const pageNumber = Number(page)||1;
        const limitNumber = Math.min(Number(limit) ||10,30);// joto item dekhte chai
        const skip = (pageNumber-1)* limitNumber;
    
        const items= await itemModel.find(query).sort(sortOption).skip(skip).limit(limitNumber);
        
        const totalItems= await itemModel.countDocuments(query);
        
        if(items.length===0) return res.status(200).json({
            message:"Items not found",
            count:items.length,
            page:pageNumber,
            limit:limitNumber,
            totalItems:totalItems,
            totalPage:Math.ceil(totalItems/limitNumber),
            items: [],
        });

        res.status(200).json({
            message:"Items fetched successfully",
            count:items.length,
            page:pageNumber,
            limit:limitNumber,
            totalItems:totalItems,
            totalPage:Math.ceil(totalItems/limitNumber),
            items:items
        })
        
    } catch (error) {
        next(error)
    }
}

async function myItems(req,res,next){
    try {
        const {itemName,type}=req.query;

        const query={postedBy:req.user._id};
        if(itemName) query.itemName={$regex:itemName,$options:"i"};
        if(type) query.type=type;

        const myItem= await itemModel.find(query).sort({createdAt:-1});
        if(myItem.length===0) return res.status(200).json({
            message:"Items not found",
            count:0,
            items:[]
        })
        
        res.status(200).json({
            message:"My items fetched successfully",
            count:myItem.length,
            items:myItem
        })
    } catch (error) {
        next(error)
    }
}

async function getItemById(req,res,next){
    try {
        const{itemId} = req.params;
        if(!mongoose.isValidObjectId(itemId)) return next(new appError("Invalid item id",400))
        const item = await itemModel.findById(itemId);
        if(!item) return next(new appError("Item not found",404));
        res.status(200).json({
            message:"Item fetched successfully",
            item
        })
    } catch (error) {
        next(error)
    }
}

async function updateItem(req,res,next){
    try {
        const {itemId} = req.params;
        if(!mongoose.isValidObjectId(itemId)) return next(new appError("Invalid item id",400));
        
        const allowedUpdate = ["itemName","category","type","description","location","date","contact"];

        const item = await itemModel.findById(itemId);
        if(!item) return next(new appError("Item not found",404));
        
        if(req.user._id.toString() !== item.postedBy.toString() && req.user.role!=="admin") return next(new appError("You are not allowed to update",403));

        allowedUpdate.forEach((field)=>{
            if(req.body[field]!==undefined){
                item[field]=req.body[field];
            }
        })

        let oldImages=null;
        if(req.files&&req.files.length>0){
            oldImages=[...item.images];
            const result = await Promise.all(req.files.map((file)=>storageService.uploadImage(file.buffer.toString("base64"),item.type)));

            item.images= result.map(image=>({
                url: image.url,
                fileId: image.fileId
            }))
        }

        await item.save();

        if(oldImages){
            await Promise.all(oldImages.map(image=>storageService.imageDelete(image.fileId)))
        }
        
        res.status(200).json({
            message:"Item updated successfully",
            item
        })
    } catch (error) {
        next(error);
    }
}

async function deleteItem(req,res,next){
    try {
        const {itemId}=req.params;
        if(!mongoose.isValidObjectId(itemId)) return next(new appError("Invalid item id",400));
        
        const item = await itemModel.findById(itemId);
        if(!item) return next(new appError("Item not found",404));

        if(req.user._id.toString()!==item.postedBy.toString() && req.user.role!=="admin"){
            return next(new appError("You are not allowed to delete this item",403));
        }

        if(item.images.length>0){
            await Promise.all(item.images.map(image=>storageService.imageDelete(image.fileId)));
        }
        await item.deleteOne();
        res.status(200).json({
            message:"Item deleted successfully",
            itemId
        })
    } catch (error) {
        next(error)
    }
}


export default {items,getItems,myItems,getItemById,updateItem,updateItem,deleteItem}