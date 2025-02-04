import config from '@/shared/configs/env.config';
import logger from '@/shared/configs/logger.config';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

class S3Service {
    protected s3Client: S3Client;
    constructor() {
        this.s3Client = new S3Client({
            endpoint: config.minio.endpoint,
            credentials: {
                accessKeyId: config.minio.accessKey,
                secretAccessKey: config.minio.secretKey,
            },
            region: config.minio.region,
            forcePathStyle: true,
        });
    }

    async getObject(bucket: string, key: string) {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const result = await this.s3Client.send(command);

        return result;
    }

    async putObject(bucket: string, key: string, data: Buffer, contentType: string = 'image/png'): Promise<any> {
        const command = new PutObjectCommand({
            Body: data,
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
        });

        await this.s3Client.send(command);

        return key;
    }

    async delObject(bucket: string, s3LocationUrl: string): Promise<void> {
        const url = new URL(s3LocationUrl).pathname.substring(1);
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: url,
        });

        try {
            await this.s3Client.send(command);
        } catch (err) {
            logger.error(err);
        }
    }
}

const s3Service = new S3Service();
export default s3Service;
