export class AuthorizationError extends Error {
    constructor(description) {
        super();
        this.tipo = 'Not authorized';
        this.description = description;
    }
}
