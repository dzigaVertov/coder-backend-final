export class RepeatedPasswordError extends Error {
    constructor(description) {
        super();
        this.tipo = 'Repeated Password';
        this.description = description;
    }
}
