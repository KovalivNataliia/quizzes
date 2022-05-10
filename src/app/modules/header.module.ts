import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '@components/header/header.component';
import { ImagePathPipe } from '@pipes/image-path.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    ImagePathPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }