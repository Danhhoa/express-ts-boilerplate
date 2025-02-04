import { UploadType } from '../enums/file.enum';

export interface IUploadImage {
    name: string;
    mimeType: string;
    path: string;
    type?: UploadType;
}

export interface IUploadResponse {
    previewUrl?: string | null;
    uploadPath: string;
}
