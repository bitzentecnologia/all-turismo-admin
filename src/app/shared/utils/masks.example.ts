/**
 * Exemplo de uso das funções de máscara
 * 
 * Para usar em outros componentes:
 * 
 * 1. Importe as funções:
 * import { formatCnpj, formatCep, formatPhone, validateNumbersOnly } from '../../../shared/utils/masks';
 * 
 * 2. Use no template HTML:
 * <input 
 *   type="text" 
 *   [(ngModel)]="cnpj" 
 *   (input)="formatCnpjInput($event)"
 *   (keypress)="validateNumbersOnly($event)"
 *   placeholder="00.000.000/0001-00"
 * >
 * 
 * 3. No componente TypeScript:
 * formatCnpjInput(event: any): void {
 *   this.cnpj = formatCnpj(event.target.value);
 * }
 * 
 * validateNumbersOnly(event: any): boolean {
 *   return validateNumbersOnly(event);
 * }
 * 
 * 4. Ou use diretamente passando apenas o valor:
 * const cnpjFormatado = formatCnpj('12345678901234'); // Retorna: 12.345.678/9012-34
 * const cepFormatado = formatCep('12345678'); // Retorna: 12345-678
 * const telefoneFormatado = formatPhone('11987654321'); // Retorna: (11) 98765-4321
 */
