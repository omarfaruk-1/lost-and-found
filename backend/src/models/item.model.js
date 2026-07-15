import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:[true,"Item name is required"]
    },
    category:{
        type:String,
        enum:["phone","bag","document","wallet","electronics","jewelry","others"],
        required:true
    },
    type:{
        type:String,
        enum:["lost","found"],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    location:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    status:{
        type:String,
        enum:["available","resolved"],
        default:"available"
    }
},{timestamps:true,versionKey: false,})

const itemModel = mongoose.model("items",itemSchema);
export default itemModel;