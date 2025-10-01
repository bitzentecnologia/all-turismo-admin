import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { DropDownItem } from '@shared/models/dropdown.model';
import { RegisterFormData } from './register.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    // Enviar dados como JSON (não mais FormData)
    // Os arquivos já foram enviados separadamente via upload service
    return this.http.post(`${this.apiUrl}/companies`, data);
  }

  getCategories(): Observable<DropDownItem[]> {
    return this.http.get<DropDownItem[]>(`${this.apiUrl}/categories`);
  }

  getSubcategories(categoryId: string): Observable<DropDownItem[]> {
    return this.http.get<DropDownItem[]>(`${this.apiUrl}/categories/${categoryId}/subcategories`);
  }

  getInformationals(categoryId: string, is_delivery: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories/${categoryId}/informationals`, {
      params: { is_delivery: is_delivery.toString() },
    });
  }

  getRulesTemplates(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories/${categoryId}/rules-templates`);
  }

  getDeliveryRulesTemplates(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories/${categoryId}/rules-templates-delivery`);
  }
}
