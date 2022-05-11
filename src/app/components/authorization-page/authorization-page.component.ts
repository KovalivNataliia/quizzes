import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '@services/authorization.service';

@Component({
  selector: 'app-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss']
})
export class AuthorizationPageComponent implements OnInit {

  public hidePassword = true;
  public hideRepeatPassword = true;
  public isRegistration = true;
  public title = 'Registration';
  public buttonText = 'Register';
  public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthorizationService
  ) {
    if (this.router.url === '/auth') {
      this.isRegistration = false;
      this.title = 'Log In';
      this.buttonText = 'Login';
    }
  }

  ngOnInit(): void {
    this._buildForm();
  }

  public onSubmit(): void {
    if (this.isRegistration) {
      this.authService.registerUser(this.form.value).subscribe(data => {
        if (data.message === 'Success') {
          this.router.navigate(['/auth']);
        }
      });
    } else {
      this.authService.loginUser(this.form.value).subscribe(data => {
        if (data.message === 'Success') {
          const { token, username } = data;
          this.authService.storeUser(token, username);
          this.router.navigate(['/home']);
        }
      });
    }
  }

  private _checkPasswords(control: AbstractControl): ValidationErrors | null {
    if (control.get('password')!.value !== control.get('repeatPassword')!.value) {
      control.get('repeatPassword')!.setErrors({ notSame: true });
    }
    return null;
  }

  private _buildForm() {
    if (this.isRegistration) {
      this.form = this.formBuilder.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        repeatPassword: [''],
      }, { validators: this._checkPasswords });
    } else {
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });
    }
  }

}
