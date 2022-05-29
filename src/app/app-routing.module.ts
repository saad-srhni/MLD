import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbsencesComponent } from './absences/absences.component';
import { CollaborateursComponent } from './collaborateurs/collaborateurs.component';

const routes: Routes = [
  {
    path: '',
    component: CollaborateursComponent
  },
  {
    path: 'collaborateurs',
    component: CollaborateursComponent
  },
  {
    path: 'absences/:id',
    component: AbsencesComponent
  },
  {
    path: 'absences',
    component: AbsencesComponent
  },
  {
    path: "**",
    component: CollaborateursComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
