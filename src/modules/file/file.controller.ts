import fileService from './file.service';
import { BaseController } from '@/shared/base/base.controller';
import { IUploadImage, IUploadResponse } from './interfaces/file.interface';

class FileController extends BaseController<typeof fileService> {
    constructor() {
        super(fileService);
    }

    async getFile(path: string) {
        const streamData = await this.service.getFile(path);

        return streamData;
    }

    async uploadImage(params: IUploadImage): Promise<IUploadResponse> {
        return this.service.uploadImage(params);
    }
}

export const fileController = new FileController();
