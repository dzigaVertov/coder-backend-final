export class ExpiredTokenError extends Error {
    constructor(description) {
        super();
        this.tipo = 'Expired Token';
        this.description = description;
    }
}
