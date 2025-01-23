import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

const tag_name_arr: { name: any }[] = [];
let paths_object = {};
const swaggerPaths = fs.readdirSync(__dirname);
swaggerPaths.forEach((sw_obj) => {
    const sw_obj_file = path.join(__dirname, sw_obj);
    if (_.endsWith(sw_obj_file, '.map')) {
        return;
    }
    const paths_obj = require(path.join(path.join(__dirname, sw_obj)));
    const tag_name = (Object.values(paths_obj)[0] as any)?.tag_name;
    const paths_sub = (Object.values(paths_obj)[0] as any)?.paths;
    if (tag_name) {
        tag_name_arr.push({
            name: tag_name,
        });
    }

    if (paths_sub) {
        paths_object = _.merge(paths_object, paths_sub);
    }
});

export const paths = paths_object;
export const tags_name = tag_name_arr;
