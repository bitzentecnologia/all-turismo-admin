import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UploadError {
  type: 'size' | 'format' | 'network' | 'timeout' | 'server' | 'unknown';
  message: string;
  details?: any;
}

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private apiUrl = environment.apiUrl;
    private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
    private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    private readonly UPLOAD_TIMEOUT = 30000;

    constructor(private http: HttpClient) { }

    /**
     * Upload de arquivo para o servidor
     * @param file Arquivo a ser enviado
     * @returns Observable com o ID do arquivo enviado
     */
    uploadFile(file: File): Observable<{ id: string }> {
        const validationError = this.validateFile(file);
        if (validationError) {
            return throwError(() => validationError);
        }

        const formData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post<any>(`${this.apiUrl}/file-uploads`, formData).pipe(
            timeout(this.UPLOAD_TIMEOUT),
            map(response => ({ id: response.file.id })),
            catchError(error => this.handleUploadError(error))
        );
    }

    private validateFile(file: File): UploadError | null {
        if (file.size > this.MAX_FILE_SIZE) {
            return {
                type: 'size',
                message: `O arquivo excede o tamanho máximo permitido de ${this.MAX_FILE_SIZE / (1024 * 1024)}MB. Tamanho atual: ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
            };
        }

        if (!this.ALLOWED_TYPES.includes(file.type)) {
            return {
                type: 'format',
                message: `Tipo de arquivo não suportado. Use apenas: ${this.ALLOWED_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')}.`,
            };
        }

        return null;
    }

    private handleUploadError(error: any): Observable<never> {
        let uploadError: UploadError;

        if (error instanceof TimeoutError) {
            uploadError = {
                type: 'timeout',
                message: 'O tempo limite para upload foi excedido. Verifique sua conexão e tente novamente.',
            };
        } else if (error.name === 'TimeoutError') {
            uploadError = {
                type: 'timeout',
                message: 'O tempo limite para upload foi excedido. Verifique sua conexão e tente novamente.',
            };
        } else if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
                uploadError = {
                    type: 'network',
                    message: 'Erro de conexão. Verifique sua internet e tente novamente.',
                };
            } else if (error.status >= 400 && error.status < 500) {
                const serverMessage = error.error?.message || error.error?.error;
                uploadError = {
                    type: 'server',
                    message: serverMessage || `Erro ao validar o arquivo (código ${error.status}). Verifique o arquivo e tente novamente.`,
                    details: error.error,
                };
            } else if (error.status >= 500) {
                uploadError = {
                    type: 'server',
                    message: 'Erro no servidor. Tente novamente em alguns instantes.',
                    details: error.error,
                };
            } else {
                uploadError = {
                    type: 'unknown',
                    message: 'Erro desconhecido ao fazer upload. Tente novamente.',
                    details: error,
                };
            }
        } else {
            uploadError = {
                type: 'unknown',
                message: 'Erro desconhecido ao fazer upload. Tente novamente.',
                details: error,
            };
        }

        return throwError(() => uploadError);
    }
}
