import { Component } from '@angular/core';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { filter, take } from 'rxjs';
import { bindTokenToPayload } from 'src/app/core/api/utils';
import { UpdateRequest } from 'src/app/pb/user_pb';
import { AuthFacade } from 'src/app/store/auth';
import validator from 'validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent extends OnDestroyMixin {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  confirmedPassword = '';
  description: string = '';

  invalidData: boolean = false;

  authState$ = this.authFacade.authState$;

  constructor(private authFacade: AuthFacade) {
    super();
  }

  resetProvidedData(): void {
    this.name = '';
    this.surname = '';
    this.email = '';
    this.password = '';
    this.confirmedPassword = '';
    this.description = '';
  }

  submitUpdate(): void {
    if (
      (this.name == '' &&
        this.surname == '' &&
        this.email == '' &&
        this.password == '' &&
        this.confirmedPassword == '' &&
        this.description == '') ||
      (this.email.length > 1 && !validator.isEmail(this.email)) ||
      this.password.length < 7 &&
      this.password !== this.confirmedPassword
    ) {
      this.invalidData = true;
      return;
    }

    this.invalidData = false;

    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<UpdateRequest.AsObject>(
          {
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: this.password,
            description: this.description,
          },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.authFacade.updateUserData(payload);

        this.name = '';
        this.surname = '';
        this.email = '';
        this.password = '';
        this.confirmedPassword = '';
        this.description = '';
      });
  }
}
