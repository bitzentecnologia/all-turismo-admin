import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function timeFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const isValid = timeRegex.test(control.value);
    
    return isValid ? null : { invalidTimeFormat: { value: control.value } };
  };
}

export function operatingHoursValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const hours = control.value;
    
    for (const dayHours of hours) {
      if (!dayHours.isClosed) {
        // Se não está fechado, deve ter horário de início e fim
        if (!dayHours.startTime || !dayHours.endTime) {
          return { requiredTimes: { value: control.value } };
        }
        
        // Validar formato dos horários
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(dayHours.startTime) || !timeRegex.test(dayHours.endTime)) {
          return { invalidTimeFormat: { value: control.value } };
        }
        
        // Validar se horário de fim é depois do início
        const startTime = new Date(`2000-01-01T${dayHours.startTime}:00`);
        const endTime = new Date(`2000-01-01T${dayHours.endTime}:00`);
        
        if (endTime <= startTime) {
          return { endTimeBeforeStart: { value: control.value } };
        }
      }
    }
    
    return null;
  };
}
