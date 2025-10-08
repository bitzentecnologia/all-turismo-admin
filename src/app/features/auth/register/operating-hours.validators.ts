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
    // Use getRawValue para incluir campos desabilitados
    const rawValue = (control as any).getRawValue?.() || control.value;
    if (!rawValue) return null;

    const hours = rawValue;
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dayKeys: { [key: string]: string } = {
      'sunday': 'Domingo',
      'monday': 'Segunda-feira',
      'tuesday': 'Terça-feira',
      'wednesday': 'Quarta-feira',
      'thursday': 'Quinta-feira',
      'friday': 'Sexta-feira',
      'saturday': 'Sábado'
    };

    for (const dayHours of hours) {
      const dayName = dayKeys[dayHours.dayOfWeek] || dayHours.dayOfWeek;

      if (!dayHours.isClosed) {
        // Se não está fechado, deve ter horário de início e fim
        if (!dayHours.startTime || !dayHours.endTime) {
          return {
            requiredTimes: {
              day: dayName,
              missingStart: !dayHours.startTime,
              missingEnd: !dayHours.endTime
            }
          };
        }

        // Validar formato dos horários
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const startValid = timeRegex.test(dayHours.startTime);
        const endValid = timeRegex.test(dayHours.endTime);

        if (!startValid || !endValid) {
          return {
            invalidTimeFormat: {
              day: dayName,
              startTime: dayHours.startTime,
              endTime: dayHours.endTime,
              invalidStart: !startValid,
              invalidEnd: !endValid
            }
          };
        }

        // Validar se horário de fim é diferente do início (permitir horários overnight)
        const startTime = new Date(`2000-01-01T${dayHours.startTime}:00`);
        const endTime = new Date(`2000-01-01T${dayHours.endTime}:00`);

        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
        const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

        // Apenas falhar se horário de início e fim são exatamente iguais (0 horas de operação)
        // Permitir casos onde endTime < startTime (indica que fecha depois da meia-noite)
        if (startMinutes === endMinutes) {
          return {
            sameStartAndEndTime: {
              day: dayName,
              time: dayHours.startTime
            }
          };
        }
      }
    }

    return null;
  };
}
