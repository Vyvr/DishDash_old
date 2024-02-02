import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiService } from 'src/app/features/auth/auth.api.service';
import { UserData } from 'src/app/store/auth/auth.model';
import { LoginData, RegisterData } from './models/auth.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  registerForm: FormGroup;
  loginForm: FormGroup;
  showRegister = false;
  registrationSuccessful = false;

  loginErrors: Array<string> = [];
  registrationErrors: Array<string> = [];

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  private submitLogin() {
    this.loginErrors = [];
    this.registrationSuccessful = false;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginErrors.push('Invalid credentials');
      return;
    }

    const userData: LoginData = this.loginForm.value;

    this.apiService.login(userData.email, userData.password).subscribe({
      next: (response) => {
        console.log('Logging in successfull', response);
      },
      error: (error: string) => {
        this.loginErrors.push(error)
        return;
      },
      complete: () => {
        console.log('Logging in compleeted');
      }
    })
  }

  private submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registrationErrors.push('Invalid data passed');
      return;
    }

      const userData: RegisterData = this.registerForm.value;

      this.apiService.register(userData.name, userData.surname, userData.email, userData.password).subscribe({
          next: (response) => {
            console.log('Registration successful', response);
          },
          error: (error) => {
            this.registrationErrors.push(error);
            return;
          },
          complete: () => {
            console.log('Registration call completed');
            this.registrationSuccessful = true;
            this.toggleForm();
          }
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
      this.submitRegister();
    } else {
      this.submitLogin();
    }
  }
}
