import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';

describe('passwordMatchValidator', () => {
    const fb = new FormBuilder();

    function createForm(passwordValue: string | null, confirmValue: string | null) {
        return fb.group(
            {
                password: [passwordValue, Validators.required],
                confirmPassword: [confirmValue, Validators.required],
            },
            { validators: passwordMatchValidator('password', 'confirmPassword') }
        );
    }

    it('should not set errors when passwords match', () => {
        const form = createForm('secret123', 'secret123');

        expect(form.valid).toBeTrue();
        expect(form.hasError('passwordMismatch')).toBeFalse();
        expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();
    });

    it('should set passwordMismatch error when passwords differ', () => {
        const form = createForm('secret123', 'different');

        expect(form.hasError('passwordMismatch')).toBeTrue();
        expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();
    });

    it('should remove passwordMismatch error when values become equal', () => {
        const form = createForm('secret123', 'different');

        expect(form.hasError('passwordMismatch')).toBeTrue();

        form.get('confirmPassword')?.setValue('secret123');
        form.updateValueAndValidity();

        expect(form.hasError('passwordMismatch')).toBeFalse();
        expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();
    });

    it('should preserve other errors on confirm control', () => {
        const form = createForm('secret123', '');

        expect(form.get('confirmPassword')?.hasError('required')).toBeTrue();
        expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();

        form.get('confirmPassword')?.setValue('different');
        form.updateValueAndValidity();

        expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();

        form.get('confirmPassword')?.setValue('');
        form.updateValueAndValidity();

        expect(form.get('confirmPassword')?.hasError('required')).toBeTrue();
        expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();
    });
});
