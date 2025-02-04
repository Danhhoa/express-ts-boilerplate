import { uploadImageWithDiskStorage } from '@/modules/file/configs/upload.config';
import { BaseRouter } from '@/shared/base/base.router';
import { MessageErrorCode } from '@/shared/enums';
import { HTTPError } from '@/shared/errors/http.error';
import IRequest from '@/shared/interfaces/request.interface';
import { Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fileController } from './file.controller';

class FileRouter extends BaseRouter {
    router: Router;
    constructor() {
        super();
        this.router = Router();

        this.router.get('/', this.route(this.getFile));
        this.router.post('/upload_image', uploadImageWithDiskStorage.single('image'), this.route(this.uploadImage));
    }

    async getFile(req: IRequest, res: Response) {
        const { path, type } = req.query;

        const file = await fileController.getFile(path as string);

        const buffer = await file.Body.transformToByteArray();

        res.setHeader('Content-Type', file.ContentType);
        res.setHeader('Content-Length', file.ContentLength);
        res.setHeader('ETag', file.ETag);
        res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31557600'); //1 year
        res.setHeader('Content-Disposition', 'inline');

        if (file.LastModified) {
            res.setHeader('Last-Modified', new Date(file.LastModified).toUTCString());
        }

        return res.end(buffer);
    }

    async uploadImage(req: IRequest, res: Response) {
        console.log(req?.file);

        if (!req?.file) {
            throw new HTTPError({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: 'Image file is missing or invalid, accept images with extensions: png, jpg, jpeg, webp, gif',
                messageCode: MessageErrorCode.INVALID_IMAGE,
            });
        }

        const imageUploaded = await fileController.uploadImage({
            name: req.file.filename,
            mimeType: req.file.mimetype,
            path: req.file.path,
            type: req.body.type || 'avatar',
        });

        return this.onSuccess(res, imageUploaded);
    }
}

const fileRouter = new FileRouter().router;

export default fileRouter;
