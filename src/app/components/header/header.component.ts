import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { AuthorizationService } from '@services/authorization.service';
import { NavigationEnd, Router, Event } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public isAuth$ = this.authService.isAuth$;
  public userName$ = this.authService.username$;
  public currentUrl!: string;

  constructor(
    private viewportScroller: ViewportScroller,
    private authService: AuthorizationService,
    private router: Router
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url.slice(1) || 'home';
      }
    });
  }

  public toTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  public logOut(): void {
    this.router.navigate(['/authorization']);
    this.authService.logoutUser();
  }

}
