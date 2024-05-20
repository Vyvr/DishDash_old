import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { LoginRequest, RegisterRequest } from 'src/app/pb/auth_pb';
import { AuthFacade } from 'src/app/store/auth';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent extends OnDestroyMixin {
  authState$ = this.authFacade.authState$;

  registerForm: FormGroup;
  loginForm: FormGroup;
  showRegister = false;
  registrationSuccessful = false;

  loginErrors: Array<string> = [];
  registrationErrors: Array<string> = [];
  isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authFacade: AuthFacade
  ) {
    super();

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

  ngOnInit(): void {
    this.loginErrors = [];
    this.registrationErrors = [];
    this.registrationSuccessful = false;

    this.authState$
      .pipe(untilComponentDestroyed(this))
      .subscribe(({ error }) => {
        if (this.showRegister) {
          if (error) {
            this.registrationErrors.push(error);
          } else {
            this.registrationSuccessful = true;
            this.toggleForm();
          }
        }

        if (!this.showRegister && error) {
          this.loginErrors.push(error);
          return;
        }
      });
  }

  toggleForm(): void {
    this.showRegister = !this.showRegister;
  }

  onSubmit(): void {
    if (this.showRegister) {
      this._submitRegister();
    } else {
      this._submitLogin();
    }
  }

  private _submitLogin(): void {
    this.loginErrors = [];
    this.registrationSuccessful = false;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginErrors.push('Invalid credentials');
      return;
    }

    const payload: LoginRequest.AsObject = this.loginForm.value;
    this.authFacade.login(payload);

    this.authState$
      .pipe(untilComponentDestroyed(this))
      .subscribe((authState) => {
        if (isNil(authState.data) || authState.loading) {
          return;
        }

        if (!isNil(authState.data.token)) {
          this.router.navigate(['/dashboard/posts']);
          return;
        }
      });
  }

  private _submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registrationErrors.push('Invalid data passed');
      return;
    }

    const payload: RegisterRequest.AsObject = this.registerForm.value;
    this.authFacade.register(payload);
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
        confirmPasswordControl.setErrors({ mustMatch: false });
      }

      return null;
    };
  }
}
