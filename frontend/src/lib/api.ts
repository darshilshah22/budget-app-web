// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// interface ApiResponse<T> {
//   data: T;
//   error?: string;
// }

// async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: 'An error occurred' }));
//     throw new Error(error.message || 'An error occurred');
//   }

//   const data = await response.json();
//   return { data };
// }

// export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   return handleResponse<T>(response);
// }

// export async function post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(body),
//   });
//   return handleResponse<T>(response);
// }

// export async function put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(body),
//   });
//   return handleResponse<T>(response);
// }

// export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   return handleResponse<T>(response);
// }

// // API endpoints
// export const api = {
//   auth: {
//     signIn: (email: string, password: string) => post('/auth/signin', { email, password }),
//     signUp: (email: string, password: string, name: string) => post('/auth/signup', { email, password, name }),
//     signOut: () => post('/auth/signout'),
//   },
//   transactions: {
//     list: () => get('/transactions'),
//     create: (data: any) => post('/transactions', data),
//     update: (id: string, data: any) => put(`/transactions/${id}`, data),
//     delete: (id: string) => del(`/transactions/${id}`),
//   },
//   budgets: {
//     list: () => get('/budgets'),
//     create: (data: any) => post('/budgets', data),
//     update: (id: string, data: any) => put(`/budgets/${id}`, data),
//     delete: (id: string) => del(`/budgets/${id}`),
//   },
//   categories: {
//     list: () => get('/categories'),
//     create: (data: any) => post('/categories', data),
//     update: (id: string, data: any) => put(`/categories/${id}`, data),
//     delete: (id: string) => del(`/categories/${id}`),
//   },
// }; 