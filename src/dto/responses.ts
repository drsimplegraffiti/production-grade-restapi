export class SuccessResponse {
  status = "success";
  statusCode: number;
  message: string;

  constructor(statuscode: number, message: string) {
    this.statusCode = statuscode;
    this.message = message;
  }

  static create(statusCode: number, message: string): SuccessResponse {
    return new SuccessResponse(statusCode, message);
  }
}

export class DataResponse<T> {
  status = "success";
  statusCode: number;
  message: string;
  data: T;

  constructor(statuscode: number, message: string, data: T) {
    this.statusCode = statuscode;
    this.message = message;
    this.data = data;
  }

  static create<T>(
    statusCode: number,
    message: string,
    data: T
  ): DataResponse<T> {
    return new DataResponse(statusCode, message, data);
  }
}

export class ErrorResponse {
  status = "error";
  statusCode: number;
  message: string;

  constructor(statuscode: number, message: string) {
    this.statusCode = statuscode;
    this.message = message;
  }

  static create(statusCode: number, message: string): ErrorResponse {
    return new ErrorResponse(statusCode, message);
  }
}
