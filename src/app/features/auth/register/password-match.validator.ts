import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordControlName: string, confirmControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const passwordControl = group.get(passwordControlName);
        const confirmControl = group.get(confirmControlName);

        if (!passwordControl || !confirmControl) {
            return null;
        }

        const password = passwordControl.value;
        const confirmPassword = confirmControl.value;

        if (!confirmPassword) {
            removePasswordMismatchError(confirmControl);
            return null;
        }

        if (password !== confirmPassword) {
            const existingErrors = confirmControl.errors || {};
            confirmControl.setErrors({ ...existingErrors, passwordMismatch: true });
            return { passwordMismatch: true };
        }

        removePasswordMismatchError(confirmControl);
        return null;
    };
}

function removePasswordMismatchError(control: AbstractControl): void {
    const currentErrors = control.errors;

    if (!currentErrors || !currentErrors['passwordMismatch']) {
        return;
    }

    const { passwordMismatch: _passwordMismatch, ...otherErrors } = currentErrors;
    const hasOtherErrors = Object.keys(otherErrors).length > 0;

    control.setErrors(hasOtherErrors ? otherErrors : null);
}
