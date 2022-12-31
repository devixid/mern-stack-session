export default class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
    }

    getMessage() {
        return {
            statusCode: this.statusCode,
            message: this.message,
        };
    }
}
