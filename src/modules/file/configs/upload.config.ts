import { LIMIT_FILE_SIZE, TMP_IMAGE_FOLDER_PATH, WHITE_LIST_IMAGE_TYPE } from '@/shared/constants';
import IRequest from '@/shared/interfaces/request.interface';
import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';

const diskStorage = multer.diskStorage({
    destination(req, file, cb) {
        if (!existsSync(TMP_IMAGE_FOLDER_PATH)) {
            mkdirSync(TMP_IMAGE_FOLDER_PATH);
        }
        cb(undefined, TMP_IMAGE_FOLDER_PATH);
    },
    filename(req: IRequest, file: Express.Multer.File, cb) {
        cb(undefined, `${file.fieldname}-${Date.now()}.${file.originalname.split('.')[1]}`);
    },
});

const memoryStorage = multer.memoryStorage();

const uploadImageWithDiskStorage = multer({
    storage: diskStorage,
    limits: {
        fileSize: LIMIT_FILE_SIZE,
    },
    fileFilter: (req: IRequest, file: Express.Multer.File, cb) => {
        if (!WHITE_LIST_IMAGE_TYPE.includes(file.mimetype)) {
            return cb(null, false);
        }

        return cb(null, true);
    },
});

const uploadFileWithDiskStorage = multer({
    storage: diskStorage,
});

const uploadWithMemoryStorage = multer({ storage: memoryStorage });

export { diskStorage, memoryStorage, uploadFileWithDiskStorage, uploadImageWithDiskStorage, uploadWithMemoryStorage };
