class ApiResponse {
    constructor(status = 200, message = 'Succeed', data = null) {
        this.success = status >= 200 && status < 300;
        this.status = status;
        this.message = message;
        this.data = data;
    }

}

export default ApiResponse;