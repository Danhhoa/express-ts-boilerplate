export class BaseController<T> {
    protected service: T;
    constructor(service: T) {
        this.service = service;
    }
}
