// import { Response, NextFunction } from 'express';
// import httpStatusCodes from 'http-status-codes';

// // Interfaces
// import IRequest from '../interfaces/request.interface';

// // Utilities
// import ApiResponse from '../utilities/api-response.utility';

// export const isAdmin = () => {
//     return async (req: IRequest, res: Response, next: NextFunction) => {
//         if (req.user.role !== 'ADMIN') {
//             return ApiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
//         }
//         next();
//     };
// };
