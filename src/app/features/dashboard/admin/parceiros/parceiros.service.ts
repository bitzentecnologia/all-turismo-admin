import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';
import { Partner } from './parceiros.component';
import { PaginatedResponse } from '@shared/models/pagination.model';
import { DropDownItem } from '@shared/models/dropdown.model';

export interface InformationalData {
  id: string;
  text: string;
  icon: string;
  category_id: string;
}

export type PartnerResponse = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  created_at: string;
  contact_phone: string;
};

export type PartnerDetailsResponse = PartnerResponse & {
  description?: string;
  cnpj?: string;
  contact_phone?: string;
  instagram?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  logo?: {
    id: string;
  };
  address?: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  category?: {
    id: string;
    name: string;
    description?: string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class ParceirosService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getParceiros(page = 1, limit = 10): Observable<PaginatedResponse<PartnerResponse>> {
    return this.http.get<PaginatedResponse<PartnerResponse>>(
      `${this.apiUrl}/admin/companies?page=${page}&limit=${limit}`
    );
  }

  getPartnerById(id: string): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/admin/companies/${id}`);
  }

  getCategories(): Observable<DropDownItem[]> {
    return this.http.get<DropDownItem[]>(`${this.apiUrl}/categories`);
  }

  getSubcategories(categoryId: string): Observable<DropDownItem[]> {
    return this.http.get<DropDownItem[]>(`${this.apiUrl}/categories/${categoryId}/subcategories`);
  }

  approvePartner(id: string): Observable<PartnerDetailsResponse> {
    return this.http.post<PartnerDetailsResponse>(
      `${this.apiUrl}/admin/companies/approve/${id}`,
      {}
    );
  }

  updatePartner(id: string, data: any): Observable<PartnerDetailsResponse> {
    return this.http.put<PartnerDetailsResponse>(`${this.apiUrl}/admin/companies/${id}`, data);
  }

  getInformationals(): Observable<InformationalData[]> {
    return this.http.get<InformationalData[]>(`${this.apiUrl}/categories/informationals`);
  }
}
