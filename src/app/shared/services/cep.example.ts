/**
 * Exemplo de uso do serviço de CEP
 * 
 * Para usar em outros componentes:
 * 
 * 1. Importe o serviço:
 * import { CepService } from '../../../shared/services/cep.service';
 * 
 * 2. Injete no construtor:
 * constructor(private cepService: CepService) {}
 * 
 * 3. Use no método de formatação de CEP:
 * formatCep(event: any): void {
 *   const value = this.cepService.formatarCep(event.target.value);
 *   this.form.get('cep')?.setValue(value);
 *   
 *   // Consulta automática quando tiver 8 dígitos
 *   const cepLimpo = value.replace(/\D/g, '');
 *   if (cepLimpo.length === 8) {
 *     this.consultarCep(cepLimpo);
 *   }
 * }
 * 
 * 4. Implemente a consulta:
 * private consultarCep(cep: string): void {
 *   this.isConsultingCep = true;
 *   
 *   this.cepService.consultarCep(cep).subscribe({
 *     next: (response) => {
 *       // Preenche automaticamente os campos
 *       this.form.patchValue({
 *         state: response.uf,
 *         city: response.localidade,
 *         neighborhood: response.bairro,
 *         street: response.logradouro
 *       });
 *       this.isConsultingCep = false;
 *     },
 *     error: (error) => {
 *       console.log('CEP não encontrado:', error.message);
 *       this.isConsultingCep = false;
 *     }
 *   });
 * }
 * 
 * 5. Use no template HTML:
 * <div class="cep-input-container">
 *   <input 
 *     formControlName="cep"
 *     (input)="formatCep($event)"
 *     [disabled]="isConsultingCep"
 *   >
 *   <div *ngIf="isConsultingCep" class="cep-loading">
 *     <span>Consultando...</span>
 *   </div>
 * </div>
 */
