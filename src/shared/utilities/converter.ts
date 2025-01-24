import _ from 'lodash';

export const snakeToCamel = (data: Object | Array<Object>) => {
    if (Array.isArray(data)) {
        const arrCamelCaseObj = data.map((item) => {
            const camelCaseObj: any = {};
            Object.keys(item).forEach((key) => {
                const camelCaseKey = _.camelCase(key);
                camelCaseObj[camelCaseKey] = item[key as keyof Object];
            });

            return camelCaseObj;
        });

        return arrCamelCaseObj;
    }

    // single object
    const camelCaseObj: any = {};
    Object.keys(data).forEach((key) => {
        const camelCaseKey = _.camelCase(key);
        camelCaseObj[camelCaseKey] = data[key as keyof Object];
    });

    return camelCaseObj;
};

export const camelToSnake = (data: Object | Array<Object>) => {
    if (Array.isArray(data)) {
        const arrSnakeCaseObj = data.map((item) => {
            const snakeCaseObj: any = {};
            Object.keys(item).forEach((key) => {
                const snakeCaseKey = _.snakeCase(key);
                snakeCaseObj[snakeCaseKey] = item[key as keyof Object];
            });

            return snakeCaseObj;
        });

        return arrSnakeCaseObj;
    }

    // single object
    const snakeCaseObj: any = {};
    Object.keys(data).forEach((key) => {
        const snakeCaseKey = _.snakeCase(key);
        snakeCaseObj[snakeCaseKey] = data[key as keyof Object];
    });

    return snakeCaseObj;
};
