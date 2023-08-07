export class InvalidOperationError extends Error {
    constructor(description) {
        super();
        this.tipo = 'Invalid Operation';
        this.description = description;
    }
}
