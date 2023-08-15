export class AuthenticationError extends Error {
    constructor(description) {
        super();
        this.tipo = 'Not authenticated';
        this.description = description;
    }
}
