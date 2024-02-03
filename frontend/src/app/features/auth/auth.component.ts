import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { LoginRequest, RegisterRequest } from 'src/app/proto/auth_pb';
import { AuthFacade } from 'src/app/store/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  // authState$ = this.authFacade.authState$;

  registerForm: FormGroup;
  loginForm: FormGroup;
  showRegister = false;
  registrationSuccessful = false;

  loginErrors: Array<string> = [];
  registrationErrors: Array<string> = [];

  constructor(private fb: FormBuilder, private authFacade: AuthFacade) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        surname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(7)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this._mustMatch('password', 'confirmPassword'),
      }
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  toggleForm() {
    this.showRegister = !this.showRegister;
  }

  onSubmit() {
    if (this.showRegister) {
      this._submitRegister();
    } else {
      this._submitLogin();
    }
  }

  private _submitLogin() {
    this.loginErrors = [];
    this.registrationSuccessful = false;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginErrors.push('Invalid credentials');
      return;
    }

    const payload: LoginRequest.AsObject = this.loginForm.value;
    this.authFacade.login(payload);
  }

  private _submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registrationErrors.push('Invalid data passed');
      return;
    }

    const payload: RegisterRequest.AsObject = this.registerForm.value;
    // this.authFacade.register(payload);
  }

  private _mustMatch(
    password: string,
    confirmPassword: string
  ): ValidationErrors | null {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['mustMatch']
      ) {
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
}
