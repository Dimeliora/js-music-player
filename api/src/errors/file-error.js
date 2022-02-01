module.exports = class FileError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'FileError';
        this.status = status;
    }
};
