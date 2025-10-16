import { FormBuilder, FormControl } from '@angular/forms';
import { timeFormatValidator, operatingHoursValidator } from './operating-hours.validators';
import { OperatingHours } from './operating-hours.model';

describe('timeFormatValidator', () => {
  it('should return null for valid time format HH:MM', () => {
    const control = new FormControl('09:30');
    const validator = timeFormatValidator();

    expect(validator(control)).toBeNull();
  });

  it('should return null for valid time format H:MM', () => {
    const control = new FormControl('9:30');
    const validator = timeFormatValidator();

    expect(validator(control)).toBeNull();
  });

  it('should return null for valid time at midnight', () => {
    const control = new FormControl('00:00');
    const validator = timeFormatValidator();

    expect(validator(control)).toBeNull();
  });

  it('should return null for valid time at end of day', () => {
    const control = new FormControl('23:59');
    const validator = timeFormatValidator();

    expect(validator(control)).toBeNull();
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    const validator = timeFormatValidator();

    expect(validator(control)).toBeNull();
  });

  it('should return null for null value', () => {
    const control = new FormControl(null);
    const validator = timeFormatValidator();

    expect(validator(control)).toBeNull();
  });

  it('should return invalidTimeFormat error for hour exceeding 23', () => {
    const control = new FormControl('24:00');
    const validator = timeFormatValidator();
    const result = validator(control);

    expect(result).not.toBeNull();
    expect(result?.['invalidTimeFormat']).toEqual({ value: '24:00' });
  });

  it('should return invalidTimeFormat error for minute exceeding 59', () => {
    const control = new FormControl('12:60');
    const validator = timeFormatValidator();
    const result = validator(control);

    expect(result).not.toBeNull();
    expect(result?.['invalidTimeFormat']).toEqual({ value: '12:60' });
  });

  it('should return invalidTimeFormat error for missing colon', () => {
    const control = new FormControl('1230');
    const validator = timeFormatValidator();
    const result = validator(control);

    expect(result).not.toBeNull();
    expect(result?.['invalidTimeFormat']).toEqual({ value: '1230' });
  });

  it('should return invalidTimeFormat error for single digit minutes', () => {
    const control = new FormControl('12:5');
    const validator = timeFormatValidator();
    const result = validator(control);

    expect(result).not.toBeNull();
    expect(result?.['invalidTimeFormat']).toEqual({ value: '12:5' });
  });

  it('should return invalidTimeFormat error for text input', () => {
    const control = new FormControl('invalid');
    const validator = timeFormatValidator();
    const result = validator(control);

    expect(result).not.toBeNull();
    expect(result?.['invalidTimeFormat']).toEqual({ value: 'invalid' });
  });

  it('should return invalidTimeFormat error for time with seconds', () => {
    const control = new FormControl('12:30:45');
    const validator = timeFormatValidator();
    const result = validator(control);

    expect(result).not.toBeNull();
    expect(result?.['invalidTimeFormat']).toEqual({ value: '12:30:45' });
  });

  it('should return invalidTimeFormat error for negative values', () => {
    const control = new FormControl('-12:30');
    const validator = timeFormatValidator();
    const result = validator(control);

    expect(result).not.toBeNull();
    expect(result?.['invalidTimeFormat']).toEqual({ value: '-12:30' });
  });
});

describe('operatingHoursValidator', () => {
  const fb = new FormBuilder();

  function createOperatingHoursFormArray(hours: Partial<OperatingHours>[]) {
    const formGroups = hours.map(h =>
      fb.group({
        dayOfWeek: [h.dayOfWeek || 'monday'],
        startTime: [h.startTime || ''],
        endTime: [h.endTime || ''],
        isClosed: [h.isClosed || false],
      })
    );
    return fb.array(formGroups, [operatingHoursValidator()]);
  }

  describe('Valid time ranges', () => {
    it('should return null for valid time range within same day', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null for multiple valid days', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', isClosed: false },
        { dayOfWeek: 'tuesday', startTime: '08:00', endTime: '18:00', isClosed: false },
        { dayOfWeek: 'wednesday', startTime: '10:00', endTime: '16:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null when all days are closed', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '', endTime: '', isClosed: true },
        { dayOfWeek: 'tuesday', startTime: '', endTime: '', isClosed: true },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null for mix of open and closed days', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', isClosed: false },
        { dayOfWeek: 'tuesday', startTime: '', endTime: '', isClosed: true },
        { dayOfWeek: 'wednesday', startTime: '10:00', endTime: '18:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null for early morning hours', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '06:00', endTime: '14:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null for late night hours', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '18:00', endTime: '23:59', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null for full day operation', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '00:00', endTime: '23:59', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });
  });

  describe('Midnight crossover (overnight hours)', () => {
    it('should return null for end time before start time (overnight operation)', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'friday', startTime: '22:00', endTime: '02:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null for starting before midnight and ending after midnight', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'saturday', startTime: '23:00', endTime: '01:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null for starting at midnight', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '00:00', endTime: '08:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null for ending at midnight', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '16:00', endTime: '00:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });
  });

  describe('Same start and end times', () => {
    it('should return sameStartAndEndTime error when start equals end', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '09:00', endTime: '09:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['sameStartAndEndTime']).toEqual({
        day: 'Segunda-feira',
        time: '09:00',
      });
    });

    it('should return sameStartAndEndTime error at midnight', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'sunday', startTime: '00:00', endTime: '00:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['sameStartAndEndTime']).toEqual({
        day: 'Domingo',
        time: '00:00',
      });
    });

    it('should return sameStartAndEndTime error for afternoon time', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'wednesday', startTime: '15:30', endTime: '15:30', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['sameStartAndEndTime']).toEqual({
        day: 'Quarta-feira',
        time: '15:30',
      });
    });
  });

  describe('Missing required times', () => {
    it('should return requiredTimes error when startTime is missing for open day', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '', endTime: '17:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['requiredTimes']).toEqual({
        day: 'Segunda-feira',
        missingStart: true,
        missingEnd: false,
      });
    });

    it('should return requiredTimes error when endTime is missing for open day', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'tuesday', startTime: '09:00', endTime: '', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['requiredTimes']).toEqual({
        day: 'Terça-feira',
        missingStart: false,
        missingEnd: true,
      });
    });

    it('should return requiredTimes error when both times are missing for open day', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'friday', startTime: '', endTime: '', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['requiredTimes']).toEqual({
        day: 'Sexta-feira',
        missingStart: true,
        missingEnd: true,
      });
    });

    it('should not return error when times are missing but day is closed', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'sunday', startTime: '', endTime: '', isClosed: true },
      ]);

      expect(formArray.errors).toBeNull();
    });
  });

  describe('Malformed time strings', () => {
    it('should return invalidTimeFormat error for invalid startTime format', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '9:5', endTime: '17:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['invalidTimeFormat']).toEqual({
        day: 'Segunda-feira',
        startTime: '9:5',
        endTime: '17:00',
        invalidStart: true,
        invalidEnd: false,
      });
    });

    it('should return invalidTimeFormat error for invalid endTime format', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'thursday', startTime: '09:00', endTime: '5:3', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['invalidTimeFormat']).toEqual({
        day: 'Quinta-feira',
        startTime: '09:00',
        endTime: '5:3',
        invalidStart: false,
        invalidEnd: true,
      });
    });

    it('should return invalidTimeFormat error when both times are invalid', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'saturday', startTime: '25:00', endTime: '30:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['invalidTimeFormat']).toEqual({
        day: 'Sábado',
        startTime: '25:00',
        endTime: '30:00',
        invalidStart: true,
        invalidEnd: true,
      });
    });

    it('should return invalidTimeFormat error for text in time field', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'wednesday', startTime: 'abc', endTime: '17:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['invalidTimeFormat']).toEqual({
        day: 'Quarta-feira',
        startTime: 'abc',
        endTime: '17:00',
        invalidStart: true,
        invalidEnd: false,
      });
    });

    it('should return invalidTimeFormat error for time with seconds', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '09:00:00', endTime: '17:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['invalidTimeFormat']).toEqual({
        day: 'Segunda-feira',
        startTime: '09:00:00',
        endTime: '17:00',
        invalidStart: true,
        invalidEnd: false,
      });
    });

    it('should return invalidTimeFormat error for missing colon', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'friday', startTime: '0900', endTime: '17:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['invalidTimeFormat']).toEqual({
        day: 'Sexta-feira',
        startTime: '0900',
        endTime: '17:00',
        invalidStart: true,
        invalidEnd: false,
      });
    });
  });

  describe('Weekly schedule validation', () => {
    it('should validate complete weekly schedule with all days', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'sunday', startTime: '', endTime: '', isClosed: true },
        { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', isClosed: false },
        { dayOfWeek: 'tuesday', startTime: '09:00', endTime: '17:00', isClosed: false },
        { dayOfWeek: 'wednesday', startTime: '09:00', endTime: '17:00', isClosed: false },
        { dayOfWeek: 'thursday', startTime: '09:00', endTime: '17:00', isClosed: false },
        { dayOfWeek: 'friday', startTime: '09:00', endTime: '18:00', isClosed: false },
        { dayOfWeek: 'saturday', startTime: '10:00', endTime: '14:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should return first error encountered in weekly schedule', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', isClosed: false },
        { dayOfWeek: 'tuesday', startTime: '', endTime: '17:00', isClosed: false },
        { dayOfWeek: 'wednesday', startTime: '09:00', endTime: '09:00', isClosed: false },
      ]);

      expect(formArray.errors).not.toBeNull();
      expect(formArray.errors?.['requiredTimes']).toEqual({
        day: 'Terça-feira',
        missingStart: true,
        missingEnd: false,
      });
    });

    it('should validate schedule with varied hours per day', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '08:00', endTime: '20:00', isClosed: false },
        { dayOfWeek: 'tuesday', startTime: '07:30', endTime: '15:30', isClosed: false },
        { dayOfWeek: 'wednesday', startTime: '09:15', endTime: '17:45', isClosed: false },
        { dayOfWeek: 'thursday', startTime: '10:00', endTime: '22:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should validate schedule with weekend overnight hours', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'friday', startTime: '18:00', endTime: '02:00', isClosed: false },
        { dayOfWeek: 'saturday', startTime: '20:00', endTime: '04:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should return null for empty form array', () => {
      const formArray = fb.array([], [operatingHoursValidator()]);

      expect(formArray.errors).toBeNull();
    });

    it('should return null when control value is null', () => {
      const control = fb.control(null, [operatingHoursValidator()]);

      expect(control.errors).toBeNull();
    });

    it('should handle getRawValue for disabled controls', () => {
      const formGroups = [
        fb.group({
          dayOfWeek: ['monday'],
          startTime: [{ value: '09:00', disabled: true }],
          endTime: [{ value: '17:00', disabled: true }],
          isClosed: [false],
        }),
      ];
      const formArray = fb.array(formGroups, [operatingHoursValidator()]);

      expect(formArray.errors).toBeNull();
    });

    it('should validate single minute difference', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '09:00', endTime: '09:01', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should handle maximum valid time difference', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '00:01', endTime: '00:00', isClosed: false },
      ]);

      expect(formArray.errors).toBeNull();
    });

    it('should preserve day name in Portuguese for error messages', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'thursday', startTime: '10:00', endTime: '10:00', isClosed: false },
      ]);

      expect(formArray.errors?.['sameStartAndEndTime'].day).toBe('Quinta-feira');
    });

    it('should handle all Portuguese day names correctly', () => {
      const days = [
        { key: 'sunday', name: 'Domingo' },
        { key: 'monday', name: 'Segunda-feira' },
        { key: 'tuesday', name: 'Terça-feira' },
        { key: 'wednesday', name: 'Quarta-feira' },
        { key: 'thursday', name: 'Quinta-feira' },
        { key: 'friday', name: 'Sexta-feira' },
        { key: 'saturday', name: 'Sábado' },
      ];

      days.forEach(day => {
        const formArray = createOperatingHoursFormArray([
          { dayOfWeek: day.key, startTime: '', endTime: '17:00', isClosed: false },
        ]);

        expect(formArray.errors?.['requiredTimes'].day).toBe(day.name);
      });
    });
  });

  describe('Error message structure consistency', () => {
    it('should return error with day context for requiredTimes', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '', endTime: '', isClosed: false },
      ]);

      const error = formArray.errors?.['requiredTimes'];
      expect(error).toBeDefined();
      expect(error.day).toBeDefined();
      expect(typeof error.day).toBe('string');
      expect(error.missingStart).toBeDefined();
      expect(error.missingEnd).toBeDefined();
    });

    it('should return error with day context for invalidTimeFormat', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'tuesday', startTime: 'invalid', endTime: '17:00', isClosed: false },
      ]);

      const error = formArray.errors?.['invalidTimeFormat'];
      expect(error).toBeDefined();
      expect(error.day).toBeDefined();
      expect(typeof error.day).toBe('string');
      expect(error.startTime).toBeDefined();
      expect(error.endTime).toBeDefined();
      expect(error.invalidStart).toBeDefined();
      expect(error.invalidEnd).toBeDefined();
    });

    it('should return error with day context for sameStartAndEndTime', () => {
      const formArray = createOperatingHoursFormArray([
        { dayOfWeek: 'wednesday', startTime: '12:00', endTime: '12:00', isClosed: false },
      ]);

      const error = formArray.errors?.['sameStartAndEndTime'];
      expect(error).toBeDefined();
      expect(error.day).toBeDefined();
      expect(typeof error.day).toBe('string');
      expect(error.time).toBeDefined();
      expect(typeof error.time).toBe('string');
    });

    it('should maintain consistent error structure across different days', () => {
      const formArray1 = createOperatingHoursFormArray([
        { dayOfWeek: 'monday', startTime: '10:00', endTime: '10:00', isClosed: false },
      ]);

      const formArray2 = createOperatingHoursFormArray([
        { dayOfWeek: 'friday', startTime: '15:00', endTime: '15:00', isClosed: false },
      ]);

      const error1 = formArray1.errors?.['sameStartAndEndTime'];
      const error2 = formArray2.errors?.['sameStartAndEndTime'];

      expect(Object.keys(error1).sort()).toEqual(Object.keys(error2).sort());
      expect(error1.day).not.toBe(error2.day);
      expect(error1.time).not.toBe(error2.time);
    });
  });
});
