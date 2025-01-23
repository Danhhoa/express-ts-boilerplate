import { IBaseError } from '@/shared/interfaces/error.interface';

// export class BaseError extends Error {
//     constructor(params: IBaseError) {
//         super();
//     }
// }

export class HTTPError extends Error {
    tupleErrorParams: IBaseError;

    constructor(params: IBaseError) {
        super(params.message);
        this.tupleErrorParams = params;
    }
}
