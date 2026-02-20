export interface axiosResponse<T = null> {
    success: boolean;
    message: string;
    payload?: T,
    errors?: string[] | null
}