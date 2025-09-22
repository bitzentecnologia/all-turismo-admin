import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';
import { Partner } from './parceiros.component';
import { PaginatedResponse } from '@shared/models/pagination.model';

export type PartnerResponse = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
};

export type PartnerDetailsResponse = PartnerResponse & {
  description: string;
};

@Injectable({
  providedIn: 'root',
})
export class ParceirosService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getParceiros(page = 1, limit = 10): Observable<PaginatedResponse<Partner>> {
    return this.http.get<PaginatedResponse<Partner>>(
      `${this.apiUrl}/admin/companies?page=${page}&limit=${limit}`
    );
  }

  getPartnerById(id: string): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/admin/companies/${id}`);
  }
}
