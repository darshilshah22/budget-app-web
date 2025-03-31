interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  error?: any;
  data?: T;
}

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  status: 'success',
  message,
  data
});

export const errorResponse = (message: string, error?: any): ApiResponse => ({
  status: 'error',
  message,
  error
}); 