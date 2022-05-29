import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollaborateursComponent } from './collaborateurs/collaborateurs.component';
import { AbsencesComponent } from './absences/absences.component';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIziToastModule } from 'ngx-izitoast';

@NgModule({
  declarations: [
    AppComponent,
    AbsencesComponent,
    CollaborateursComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIziToastModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
