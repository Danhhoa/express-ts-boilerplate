export interface IDeleteById {
    id: number;
}

export interface IDetailById {
    id: number;
}

export interface IBaseQueryParams {
    limit: number;
    page: number;
}

export interface IPagination {
    totalPages: number;
    previousPage: number | null;
    currentPage: number;
    nextPage: number | null;
    totalItems: number;
}

export interface IPaginationReq {
    offset: number;
    limit: number;
}
