export interface IAuthLogin {
    email: string;
    password: string;
}

export interface IAuthLogout {
    refreshToken: string;
}

export interface IRefreshToken {
    refreshToken: string;
}
