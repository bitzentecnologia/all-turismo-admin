import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Upload de arquivo para o servidor
     * @param file Arquivo a ser enviado
     * @returns Observable com o ID do arquivo enviado
     */
    uploadFile(file: File): Observable<{ id: string }> {
        const formData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post<any>(`${this.apiUrl}/file-uploads`, formData).pipe(
            map(response => ({ id: response.file.id }))
        );
    }
}
