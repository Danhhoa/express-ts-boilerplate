import { BaseModel } from '@/shared/base/base.model';

export class AuthToken extends BaseModel {
    id: number;

    userId: string;

    refreshToken: string;

    constructor(userId: string, refreshToken: string, createdAt: Date, updatedAt: Date, deletedAt: Date) {
        super();
        this.userId = userId;
        this.refreshToken = refreshToken;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
