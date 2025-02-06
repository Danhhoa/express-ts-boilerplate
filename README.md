# NodeJS Sample

#### ExpressJS, Typescript, TypeORM, MySQL

## 1. Running project

### Stable environment

1. Node version: `18.0.0`
2. Yarn version: `1.22.4`
3. NPM version: `10.2.4`

#### 1.1. Setup

1. Install packages

`$ npm i`

2. Create .env file in the root folder and update some variables

`Create .env from .env.example`

3. Install minio for image/file management

- Minio: `https://min.io/`
- Downloads: [Minio For Window](https://dl.min.io/server/minio/release/windows-amd64/minio.exe).
- Set env for root user/password:

```
setx MINIO_ROOT_USER <your_root_username>
setx MINIO_ROOT_PASSWORD <your_root_password>
```

- Run Minio server: `.\minio.exe server C:\minio --console-address :9001`

#### 1.2. Running

`$ npm run dev`
