import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function timeFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const isValid = timeRegex.test(value);

    return isValid ? null : { invalidTimeFormat: { value: value } };
  };
}

export function operatingHoursValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = (control as any).getRawValue?.() || control.value;

    if (!rawValue || (Array.isArray(rawValue) && rawValue.length === 0)) {
      return null;
    }

    const hours = Array.isArray(rawValue) ? rawValue : [rawValue];

    const dayKeys: { [key: string]: string } = {
      sunday: 'Domingo',
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
    };

    for (const dayHours of hours) {
      if (!dayHours || typeof dayHours !== 'object') {
        continue;
      }

      const dayName = dayKeys[dayHours.dayOfWeek] || dayHours.dayOfWeek;

      if (!dayHours.isClosed) {
        const hasStartTime = dayHours.startTime && dayHours.startTime.trim() !== '';
        const hasEndTime = dayHours.endTime && dayHours.endTime.trim() !== '';

        if (!hasStartTime || !hasEndTime) {
          return {
            requiredTimes: {
              day: dayName,
              missingStart: !hasStartTime,
              missingEnd: !hasEndTime,
            },
          };
        }

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
              invalidEnd: !endValid,
            },
          };
        }

        const parseTime = (timeStr: string): number => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const startMinutes = parseTime(dayHours.startTime);
        const endMinutes = parseTime(dayHours.endTime);

        if (startMinutes === endMinutes) {
          return {
            sameStartAndEndTime: {
              day: dayName,
              time: dayHours.startTime,
            },
          };
        }
      }
    }

    return null;
  };
}
