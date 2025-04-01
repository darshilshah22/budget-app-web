export class ApiError{
  statusCode: number;
  message: string;
  data?: any;
  error?: any;

  constructor(statusCode: number, message: string, data?: any, error?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = message;
  }
}