class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError