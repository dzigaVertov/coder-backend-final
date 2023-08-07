export class InvalidArgumentError extends Error {
    constructor(description){
        super();
        this.tipo = 'Invalid Argument';
        this.description = description;
    }
}
