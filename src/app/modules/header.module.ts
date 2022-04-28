import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '@components/header/header.component';
import { ImagePathPipe } from '@pipes/image-path.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    ImagePathPipe
  ],
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }