import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiService } from 'src/app/features/auth/auth.api.service';
import { UserData } from 'src/app/store/auth/auth.model';
import { RegisterData } from './models/register.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  registerForm: FormGroup;
  loginForm: FormGroup;
  showRegister = true;  // Determines which form is shown

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  mustMatch(password: string, confirmPassword: string): ValidationErrors | null {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
  
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
  
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mustMatch']) {
        return null;
      }
  
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
        return { mustMatch: true }; // return an error object here
      } else {
        confirmPasswordControl.setErrors(null);
      }
      
      return null; // explicitly return null here
    };
  }
  

  toggleForm() {
    this.showRegister = !this.showRegister;
  }

  onSubmit() {
    if (this.showRegister) {
        const userData: RegisterData = this.registerForm.value;

        this.apiService.register(userData.name, userData.surname, userData.email, userData.password).subscribe({
            next: (response) => {
              console.log('Registration successful', response);
              // Handle successful registration
            },
            error: (error) => {
              console.error('Registration failed', error);
              // Handle error
            },
            complete: () => console.log('Registration call completed')
          });
          

        // console.log(this.registerForm.value);
      // Implement registration logic
    } else {
    //   console.log(this.loginForm.value);
      // Implement login logic
    }
  }
}
