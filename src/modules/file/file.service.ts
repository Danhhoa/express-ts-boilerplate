import config from '@/configs/env.config';
import logger from '@/configs/logger.config';
import { MessageErrorCode } from '@/shared/enums';
import { HTTPError } from '@/shared/errors/http.error';
import s3Service from '@/shared/services/minio/s3/s3.service';

import { TMP_IMAGE_FOLDER_PATH } from '@/shared/constants';
import { readFileSync } from 'fs';
import { StatusCodes } from 'http-status-codes';
import { IUploadImage, IUploadResponse } from './interfaces/file.interface';

class FileService {
    async getFile(url: string) {
        const dataStream = await s3Service.getObject(config.minio.bucketName, url);

        return dataStream;
    }

    async uploadImage({ name, path, mimeType }: IUploadImage): Promise<IUploadResponse> {
        const tmpFilePath = `${TMP_IMAGE_FOLDER_PATH}/${name}`;
        const filePath = `images/${name}`;

        try {
            // Setting up minio upload parameters
            const fileData = readFileSync(tmpFilePath);
            let uploadBuffer = fileData;

            await s3Service.putObject(config.minio.bucketName, filePath, uploadBuffer);

            return {
                uploadPath: filePath,
            };
        } catch (error) {
            logger.error('uploadImage => error: ', error);
            throw new HTTPError({
                code: StatusCodes.BAD_REQUEST,
                message: 'Upload failed. Please try again.',
                messageCode: MessageErrorCode.UPLOAD_IMAGE_ERROR,
            });
        } finally {
            // unlink(tmpFilePath, (err) => {
            //     console.log(`===> unlinks 🥕  => ${path} => result:`, err);
            // });
        }
    }
}

const fileService = new FileService();
export default fileService;
