import { AbstractControl } from "@angular/forms";

export function passwordMatch(password, confirmPassword){
    return function(form){
        const passwordValue = form.get(password)?.value;
        const confirmPasswordValue = form.get(confirmPassword)?.value;

        if(passwordValue === confirmPasswordValue){
            return null;
        }

        return { passwordMismatchError: true}
    }
}