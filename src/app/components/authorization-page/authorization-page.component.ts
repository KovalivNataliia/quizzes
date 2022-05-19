import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '@services/authorization.service';
import { StatisticService } from '@services/statistic.service';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss']
})
export class AuthorizationPageComponent implements OnInit, OnDestroy {

  public hidePassword = true;
  public hideRepeatPassword = true;
  public isRegistration = true;
  public title = 'Registration';
  public buttonText = 'Register';
  public form!: FormGroup;
  private _subscriptions = new Subscription();
  private _usernamePattern = '[a-zA-Z]{8,20}';
  private _emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$';
  private _passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthorizationService,
    private statisticService: StatisticService
  ) { }

  ngOnInit(): void {
    this._buildPage();
    this._buildForm();
  }

  public onSubmit(): void {
    let sub: Subscription;
    if (this.isRegistration) {
      sub = this.authService.registerUser(this.form.value).subscribe(data => {
        if (data.message === 'Success') {
          this.router.navigate(['/authorization']);
        }
      })
    } else {
      sub = this.authService.loginUser(this.form.value).pipe(
        tap(data => {
          this.authService.storeUser(data);
        }),
        switchMap(() => this.statisticService.getUserStatistic()),
      ).subscribe(statistic => {
        statistic = statistic || [];
        this.statisticService.setStatistic(statistic);
        this.router.navigate(['/home']);
      })
    }
    this._subscriptions.add(sub);
  }

  private _checkPasswords(control: AbstractControl): ValidationErrors | null {
    if (control.get('password')!.value !== control.get('repeatPassword')!.value) {
      control.get('repeatPassword')!.setErrors({ notSame: true });
    }
    return null;
  }

  private _buildForm(): void {
    if (this.isRegistration) {
      this.form = this.formBuilder.group({
        username: ['', [Validators.required, Validators.pattern(this._usernamePattern)]],
        email: ['', [Validators.required, Validators.pattern(this._emailPattern)]],
        password: ['', [Validators.required, Validators.pattern(this._passwordPattern)]],
        repeatPassword: [''],
      }, { validators: this._checkPasswords });
    } else {
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern(this._emailPattern)]],
        password: ['', [Validators.required, Validators.pattern(this._passwordPattern)]]
      });
    }
  }

  private _buildPage(): void {
    if (this.router.url === '/authorization') {
      this.isRegistration = false;
      this.title = 'Log In';
      this.buttonText = 'Login';
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
