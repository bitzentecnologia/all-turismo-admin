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

  constructor(private http: HttpClient) {}

  register(data: RegisterFormData): Observable<any> {
    const formData = new FormData();

    formData.append('companyName', data.establishment.name);
    formData.append('description', data.establishment.description || '');
    formData.append('cnpj', data.establishment.cnpj);
    formData.append('contact_phone', data.establishment.phone);
    formData.append('instagram', data.establishment.instagram || '');
    formData.append('categoryId', data.establishment.categoryId || '');
    formData.append('subCategoryId', data.establishment.subcategoryId || '');

    formData.append('street', data.address.street);
    formData.append('number', data.address.number);
    formData.append('complement', data.address.complement || '');
    formData.append('neighborhood', data.address.neighborhood);
    formData.append('city', data.address.city);
    formData.append('state', data.address.state);
    formData.append('zip_code', data.address.cep);

    formData.append('partnerName', data.responsible.name);
    formData.append('email', data.responsible.email);
    formData.append('password', data.responsible.password);
    formData.append('phone_whatsapp', data.responsible.phone);

    if (data.establishment.logoFile) {
      formData.append('logo', data.establishment.logoFile);
    }

    return this.http.post(`${this.apiUrl}/companies`, formData);
  }

  getCategories(): Observable<DropDownItem[]> {
    return this.http.get<DropDownItem[]>(`${this.apiUrl}/categories`);
  }

  getSubcategories(categoryId: string): Observable<DropDownItem[]> {
    return this.http.get<DropDownItem[]>(`${this.apiUrl}/categories/${categoryId}/subcategories`);
  }
}
