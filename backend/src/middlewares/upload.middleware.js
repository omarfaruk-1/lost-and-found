import multer from "multer";

const upload = multer({
    storage:multer.memoryStorage()
})

const uploadImageItem= upload.array("images",5);

export default uploadImageItem;