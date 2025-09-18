import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { DropDownItem } from '@shared/models/dropdown.model';
import { RegisterFormData } from './register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: RegisterFormData): Observable<any> {
    const formData = new FormData();

    Object.entries(data.responsible).forEach(([key, value]) => {
      formData.append(`responsible.${key}`, value as string);
    });

    Object.entries(data.address).forEach(([key, value]) => {
      formData.append(`address.${key}`, value as string);
    });

    Object.entries(data.establishment).forEach(([key, value]) => {
      if (key === 'logoFile' && value) {
        formData.append('logo', value as File);
      } else {
        formData.append(`establishment.${key}`, value as string);
      }
    });

    return this.http.post(`${this.apiUrl}/auth/register`, formData);
  }


  getCategories(): Observable<DropDownItem[]> {
    return this.http.get<DropDownItem[]>(`${this.apiUrl}/categories`);
  }

  getSubcategories(categoryId: string): Observable<DropDownItem[]> {
    return this.http.get<DropDownItem[]>(`${this.apiUrl}/categories/${categoryId}/subcategories`);
  }
}
