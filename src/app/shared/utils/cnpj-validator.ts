import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { cnpj } from "cpf-cnpj-validator";

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.replace(/\D/g, '');
    if (!value) {
      return null;
    }
    return cnpj.isValid(value) ? null : { invalidCnpj: true };
  };
}
