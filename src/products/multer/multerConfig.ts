import { UnsupportedMediaTypeException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";


export const multerOptions: MulterOptions = {

    storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
            const fileName = Date.now() + '-' + Math.ceil(Math.random() * 1000) + '-' + file.originalname;
            callback(null, fileName);
        }
    }),
    limits: {
        fileSize: 1048576 // 1 * 1024 * 1024 (1MB),
    },
    fileFilter(req, file, callback) {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            throw new UnsupportedMediaTypeException(`file type ${file.mimetype} is not supported`);
        }
        callback(null, true);
    },

};