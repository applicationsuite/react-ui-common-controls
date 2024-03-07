import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpRequest extends AxiosRequestConfig {}
export interface HttpResponse extends AxiosResponse {}
export interface HttpClient extends AxiosInstance {}
export interface HttpError extends AxiosError {}

export interface HttpResponseData {
  data?: any;
  error?: any;
}

const httpClient = axios.create({}) as HttpClient;

httpClient.interceptors.request.use(
  async (httpRequest: HttpRequest) => ({
    ...httpRequest
  }),
  (error: HttpError) => Promise.reject(error)
);

const handleResponse = (response: HttpResponse) => response;
const handleError = (error: any) => Promise.reject(error);

httpClient.interceptors.response.use(handleResponse, handleError);

export default httpClient;
