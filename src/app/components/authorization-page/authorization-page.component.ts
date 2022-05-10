import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss']
})
export class AuthorizationPageComponent {

  public hidePassword = true;
  public hideRepeatPassword = true;
  public isRegistration = true;
  public title = 'Registration';
  public buttonText = 'Register';

  public form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatPassword: [''],
  }, { validators: this._checkPasswords });

  constructor(private formBuilder: FormBuilder, private router: Router) {
    if (this.router.url === '/auth') {
      this.isRegistration = false;
      this.title = 'Log In';
      this.buttonText = 'Login';
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });
    }
  }

  public onSubmit(): void { }

  private _checkPasswords(control: AbstractControl): ValidationErrors | null {
    if (control.get('password')!.value !== control.get('repeatPassword')!.value) {
      control.get('repeatPassword')!.setErrors({ notSame: true });
    }
    return null;
  }

}
