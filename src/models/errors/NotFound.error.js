export class NotFoundError extends Error {
    constructor(description){
        super();
        this.tipo = 'Not Found';
        this.description = description;
    }
}
