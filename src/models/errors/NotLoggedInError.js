export class NotLoggedInError extends Error {
    constructor(description) {
        super();
        this.tipo = 'Not logged in';
        this.description = description;
    }
}
