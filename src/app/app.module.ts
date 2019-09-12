import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GenericModule } from './components/v2/generic.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { HomeModule } from './pages/home/home.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule } from '@angular/material';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    NoopAnimationsModule,
    GenericModule,
    HomeModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forRoot([{path: '', component: HomeComponent}]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
