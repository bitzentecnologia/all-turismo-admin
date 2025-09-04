/**
 * Utilitários para formatação de máscaras
 */

/**
 * Formata CNPJ brasileiro no formato XX.XXX.XXX/XXXX-XX
 * @param value - Valor a ser formatado (apenas números)
 * @returns CNPJ formatado
 */
export function formatCnpj(value: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara baseada no comprimento
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 5) {
    return numbers.replace(/(\d{2})(\d{0,3})/, '$1.$2');
  } else if (numbers.length <= 8) {
    return numbers.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (numbers.length <= 12) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
  } else {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
  }
}

/**
 * Formata CEP brasileiro no formato XXXXX-XXX
 * @param value - Valor a ser formatado (apenas números)
 * @returns CEP formatado
 */
export function formatCep(value: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara
  if (numbers.length <= 5) {
    return numbers;
  } else {
    return numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2');
  }
}

/**
 * Formata telefone brasileiro (fixo ou celular) no formato (XX) XXXXX-XXXX
 * @param value - Valor a ser formatado (apenas números)
 * @returns Telefone formatado
 */
export function formatPhone(value: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara baseada no comprimento
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return numbers.replace(/(\d{2})(\d{0,4})/, '($1) $2');
  } else if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
}

/**
 * Valida se o caractere digitado é um número
 * @param event - Evento de tecla
 * @returns true se for número, false caso contrário
 */
export function validateNumbersOnly(event: any): boolean {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}
