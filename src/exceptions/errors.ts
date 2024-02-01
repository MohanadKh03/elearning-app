export class InvalidInput extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidInput';
        this.message = message;
    }
}
export class NotFound extends Error{
    constructor(message: string) {
        super(message);
        this.name = 'NotFound';
        this.message = message;
    }
}