import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { AuthorizationService } from '@services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public isAuth$ = this.authService.isAuth;
  public userName$ = this.authService.username;

  constructor(
    private viewportScroller: ViewportScroller,
    private authService: AuthorizationService,
    private router: Router
  ) { }

  public toTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  public logOut(): void {
    this.router.navigate(['/auth']);
    this.authService.logoutUser();
  }

}
