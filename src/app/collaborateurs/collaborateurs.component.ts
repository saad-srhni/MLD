import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { Collaborateur } from '../dto/collaborateur';
import { ApiCollaborateurService } from '../shared/api-collaborateur.service';

@Component({
  selector: 'app-collaborateurs',
  templateUrl: './collaborateurs.component.html',
  styleUrls: ['./collaborateurs.component.css']
})
export class CollaborateursComponent implements OnInit {

  constructor(
    private collaborateurService: ApiCollaborateurService,
    private formBuilder: FormBuilder,
    private iziToast: NgxIzitoastService,
    private router: Router
  ) { }

  modal: boolean = false;
  modalForm!: FormGroup;
  // 0 ajouter,1 modifier
  operation!: number;
  progress: boolean = false;
  @ViewChild("matricule") matricule!: ElementRef;


  listCollaborateur: Collaborateur[] = [];

  settings = {
    columns: {
      nom: {
        title: 'Nom'
      },
      prenom: {
        title: 'Prenom'
      },
      datenaissance: {
        title: 'Date naissance',
      },
      matricule: {
        title: 'Matricule'
      },
      salaire: {
        title: 'Salaire'
      },
      siuationfamille: {
        title: 'Siuation famille'
      }
    },
    actions: {
      edit: false,
      delete: false,
      add: false,
      position: 'right',
      custom: [
        {
          name: 'onEdit',
          title: '<span class="btn btn-success"><img src="assets/images/update.svg" class="action" /></span>'
        },
        {
          name: 'onDelete',
          title: '<span class="btn btn-danger"><img src="assets/images/delete.svg" class="action"/></span>'
        },
        {
          name: 'absences',
          title: '<span class="btn btn-info"><img src="assets/images/share.svg" class="action"/></span>'
        }
      ]
    }
  };

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
      nom: ['', Validators.compose([Validators.required])],
      prenom: ['', Validators.compose([Validators.required])],
      datenaissance: ['', Validators.compose([Validators.required])],
      matricule: [0, Validators.compose([Validators.required])],
      salaire: [0, Validators.compose([Validators.required])],
      siuationfamille: ['', Validators.compose([Validators.required])]
    });
    this.init();
  }

  get errorControl() {
    return this.modalForm.controls;
  }

  init() {
    this.progress = true;
    this.collaborateurService.getAllCollaborateurs().subscribe((res) => {
      if (res.responseCode == 200)
        this.listCollaborateur = res['results'].map((data) => {
          data.datenaissance = this.reverse(data.datenaissance, 0);
          return data;
        });
      else this.iziToast.warning({ title: "Avertissement", message: res['responseMessage'] });
      this.progress = false;
    }, (err) => {
      this.iziToast.error({ title: "Erreur", message: err['error'] });
      this.progress = false;
    });
  }

  initForm() {
    this.modalForm.controls['nom'].setValue("");
    this.modalForm.controls['prenom'].setValue("");
    this.modalForm.controls['datenaissance'].setValue("");
    this.modalForm.controls['matricule'].setValue(0);
    this.modalForm.controls['salaire'].setValue(0);
    this.modalForm.controls['siuationfamille'].setValue("");
  }

  onCostumAction(event: any) {
    switch (event.action) {
      case 'onDelete':
        this.progress = true;
        this.collaborateurService.deleteCollaborateur(event.data.matricule).subscribe(res => {
          if (res.responseCode == 200) this.init();
          else this.iziToast.warning({ title: "Avertissement", message: res['responseMessage'] });
          this.progress = false;
        }, (err) => {
          this.progress = false;
          this.iziToast.error({ title: "Erreur", message: err['error'] });
        });
        break;
      case 'onEdit':
        this.operation = 1;
        this.matricule.nativeElement.disabled = true;
        this.modalForm.controls['nom'].setValue(event.data.nom);
        this.modalForm.controls['prenom'].setValue(event.data.prenom);
        this.modalForm.controls['datenaissance'].setValue(event.data.datenaissance);
        this.modalForm.controls['matricule'].setValue(event.data.matricule);
        this.modalForm.controls['salaire'].setValue(event.data.salaire);
        this.modalForm.controls['siuationfamille'].setValue(event.data.siuationfamille);
        this.toggleModal();
        break;
      case 'absences':
        this.router.navigateByUrl("/absences/" + event.data.matricule);
        break;
    }
  }

  sendForm() {
    if (!this.modalForm.valid) {
      return false;
    } else {
      let collaborateur: Collaborateur = this.modalForm.value;
      collaborateur.datenaissance = this.reverse(this.modalForm.value.datenaissance, 1);
      if (this.operation == 0) {
        this.progress = true;
        this.collaborateurService.createCollaborateur(collaborateur).subscribe(res => {
          if (res.responseCode == 200) this.init();
          else this.iziToast.warning({ title: "Avertissement", message: res['responseMessage'] });
          this.toggleModal();
          this.progress = false;
        }, err => {
          this.toggleModal();
          this.progress = false;
          this.iziToast.error({ title: "Erreur", message: err['error'] });
        });
      } else {
        this.progress = true;
        console.log(this.modalForm.value)
        this.collaborateurService.updateCollaborateur(this.modalForm.value,
          this.modalForm.value.matricule).subscribe((res) => {
            if (res.responseCode == 200) this.init();
            else this.iziToast.warning({ title: "Avertissement", message: res['responseMessage'] });
            this.toggleModal();
            this.progress = false;
          }, err => {
            this.toggleModal();
            this.progress = false;
            this.iziToast.error({ title: "Erreur", message: err['error'] });
          })
      }
      return;
    }
  }


  reverse(value: string, type: number) {
    let date, str = "";
    switch (type) {
      case 0:
        date = value.split("/").reverse();
        for (let i = 0; i < date.length; i++) {
          if (i != date.length - 1) str += date[i] + "-";
          else str += date[i];
        }
        return str;
      case 1:
        date = value.split("-").reverse()
        for (let i = 0; i < date.length; i++) {
          if (i != date.length - 1) str += date[i] + "/";
          else str += date[i];
        }
        return str;
      default:
        return "";
    }
  }

  toggleModal() {
    this.modal = !this.modal;
    if (!this.modal) this.initForm();
  }

  addElement() {
    this.toggleModal();
    this.operation = 0;
    this.matricule.nativeElement.disabled = false;
  }

}
