const DEFAULT_SALT_ROUNDS = 10;
const DEFAULT_PAGE_SIZE = 10;

const TMP_IMAGE_FOLDER_PATH = 'uploads';

const WHITE_LIST_IMAGE_TYPE = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'application/octet-stream',
];
const LIMIT_FILE_SIZE = 10000000; //10MB

export { DEFAULT_SALT_ROUNDS, DEFAULT_PAGE_SIZE, TMP_IMAGE_FOLDER_PATH, WHITE_LIST_IMAGE_TYPE, LIMIT_FILE_SIZE };
