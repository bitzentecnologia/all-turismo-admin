import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CepResponse, CepError } from '../models/cep.model';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly VIA_CEP_URL = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  /**
   * Consulta CEP na API ViaCEP
   * @param cep - CEP a ser consultado (apenas números)
   * @returns Observable com os dados do endereço
   */
  consultarCep(cep: string): Observable<CepResponse> {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return throwError(() => new Error('CEP deve ter 8 dígitos'));
    }

    const url = `${this.VIA_CEP_URL}/${cepLimpo}/json`;

    return this.http.get<CepResponse | CepError>(url).pipe(
      map(response => {
        // Verifica se a API retornou erro
        if ('erro' in response && response.erro) {
          throw new Error('CEP não encontrado');
        }
        return response as CepResponse;
      }),
      catchError(error => {
        console.error('Erro ao consultar CEP:', error);
        return throwError(() => new Error('Erro ao consultar CEP. Tente novamente.'));
      })
    );
  }

  /**
   * Formata CEP para exibição
   * @param cep - CEP em formato numérico
   * @returns CEP formatado (00000-000)
   */
  formatarCep(cep: string): string {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
  }

  /**
   * Valida se o CEP tem formato válido
   * @param cep - CEP a ser validado
   * @returns true se o CEP é válido
   */
  validarCep(cep: string): boolean {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
  }
}
