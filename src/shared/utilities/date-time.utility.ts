import dayjs from 'dayjs';

export const getCurrentTimeStamp = () => dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
