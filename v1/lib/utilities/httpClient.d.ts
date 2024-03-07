import { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
export interface HttpRequest extends AxiosRequestConfig {
}
export interface HttpResponse extends AxiosResponse {
}
export interface HttpClient extends AxiosInstance {
}
export interface HttpError extends AxiosError {
}
export interface HttpResponseData {
    data?: any;
    error?: any;
}
declare const httpClient: HttpClient;
export default httpClient;
