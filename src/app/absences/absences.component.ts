import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxIzitoastService } from 'ngx-izitoast';
import { Absence } from '../dto/absence';
import { MotifAbsence } from '../dto/motif-absence';
import { ActivatedRoute } from '@angular/router';
import { ApiAbsenceService } from '../shared/api-absence.service';
import { ApiMotifService } from '../shared/api-motif.service';

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent implements OnInit {

  constructor(
    private absenceService: ApiAbsenceService,
    private motifService: ApiMotifService,
    private formBuilder: FormBuilder,
    private iziToast: NgxIzitoastService,
    private route: ActivatedRoute

  ) { }

  modal: boolean = false;
  modalForm!: FormGroup;
  // 0 ajouter,1 modifier
  operation!: number;
  progress: boolean = false;

  motifs: MotifAbsence[] = [];


  listAbsences: Absence[] = [];

  settings = {
    columns: {
      collaborateur: {
        title: 'Collaborateur'
      },
      datedebut: {
        title: 'Date debut'
      },
      datefin: {
        title: 'Date fin',
      },
      identifiant: {
        title: 'Identifiant'
      },
      motifDetail: {
        title: 'Motif'
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
        }
      ]
    }
  };


  onCostumAction(event: any) {
    switch (event.action) {
      case 'onDelete':
        this.progress = true;
        this.absenceService.deleteAbsence(event.data.identifiant).subscribe(res => {
          if (res.responseCode == 200) this.init();
          else this.iziToast.warning({ title: "Avertissement", message: res['responseMessage'] });
        }, (err) => {
          this.progress = false;
          this.iziToast.error({ title: "Erreur", message: err['error'] });
        });
        break;
      case 'onEdit':
        console.log(event.data)
        this.operation = 1;
        this.modalForm.controls['collaborateur'].setValue(event.data.collaborateur);
        this.modalForm.controls['datedebut'].setValue(event.data.datedebut);
        this.modalForm.controls['datefin'].setValue(event.data.datefin);
        this.modalForm.controls['identifiant'].setValue(event.data.identifiant);
        this.modalForm.controls['motif'].setValue(event.data.motif);
        this.toggleModal();
        break;
    }
  }

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
      collaborateur: [0, Validators.compose([Validators.required])],
      datedebut: ['', Validators.compose([Validators.required])],
      datefin: ['', Validators.compose([Validators.required])],
      identifiant: [0, Validators.compose([Validators.required])],
      motif: ['', Validators.compose([Validators.required])],
    });
    this.init();
  }

  getAllMotifs() {
    return new Promise<string>((resolve, reject) => {
      this.motifService.getAllmotif().subscribe((motifs) => {
        if (motifs.responseCode == 200) {
          this.motifs = motifs.results;
          resolve("ok");
        }
        reject(motifs['responseMessage']);
      }, (err) => {
        this.progress = false;
        reject(err['error']);
      });
    });
  }

  init() {
    this.progress = true;
    let id = this.route.snapshot.paramMap.get('id');
    let motif: MotifAbsence;
    if (!id) {
      this.absenceService.getAllAbsences().subscribe((absences) => {
        if (absences.responseCode == 200) {
          this.getAllMotifs().then(motifs => {
            console.log(this.motifs)
            absences.results.map((absence) => {
              absence.datedebut = this.reverse(absence.datedebut, 0);
              absence.datefin = this.reverse(absence.datefin, 0);
              motif = this.motifs.filter((motif) => {
                return motif.code == absence.motif.toString();
              })[0];
              console.log(motif)
              absence.motifDetail = motif.libelle;
            });
            this.listAbsences = [...absences.results];
          }).catch(err => {
            this.iziToast.error({ title: "Erreur", message: err });
          });
        } else this.iziToast.warning({ title: "Avertissement", message: absences['responseMessage'] });
        this.progress = false;
      }, (err) => {
        this.progress = false;
        this.iziToast.error({ title: "Erreur", message: err['error'] });
      });
    } else {
      this.absenceService.getAllAbsencesByid(parseInt(id!)).subscribe((absences) => {
        if (absences.responseCode == 200) {
          this.getAllMotifs().then(motifs => {
            absences.results.map((absence) => {
              absence.datedebut = this.reverse(absence.datedebut, 0);
              absence.datefin = this.reverse(absence.datefin, 0);
              motif = this.motifs.filter((motif) => {
                return motif.code == absence.motif.toString();
              })[0];
              absence.motifDetail = motif.libelle;
            });
            this.listAbsences = [...absences.results];
          }).catch(err => {
            this.iziToast.error({ title: "Erreur", message: err });
          });
        } else this.iziToast.warning({ title: "Avertissement", message: absences['responseMessage'] });
        this.progress = false;
      }, (err) => {
        this.progress = false;
        this.iziToast.error({ title: "Erreur", message: err['error'] });
      });
    }
  }

  initForm() {
    this.modalForm.controls['collaborateur'].setValue(0);
    this.modalForm.controls['datedebut'].setValue("");
    this.modalForm.controls['datefin'].setValue("");
    this.modalForm.controls['identifiant'].setValue(0);
    this.modalForm.controls['motif'].setValue("");
  }


  toggleModal() {
    this.modal = !this.modal;
    if (!this.modal) this.initForm();
  }


  addElement() {
    this.toggleModal();
    this.operation = 0;
  }

  sendForm() {
    if (!this.modalForm.valid) {
      return false;
    } else {
      let absence: Absence = this.modalForm.value;
      absence.datedebut = this.reverse(absence.datedebut, 1);
      absence.datefin = this.reverse(absence.datefin, 1);
      if (this.operation == 0) {
        this.progress = true;
        this.absenceService.createAbsence(this.modalForm.value).subscribe(res => {
          if (res.responseCode == 200) this.init();
          else this.iziToast.warning({ title: "Avertissement", message: res['responseMessage'] });
          this.toggleModal();
          this.progress = false;
        }, err => {
          this.toggleModal();
          this.progress = false;
          this.iziToast.error({ title: "Erreur", message: err['error'] });
        });
      }
      else {
        this.progress = true;
        this.absenceService.updateAbsence(this.modalForm.value, this.modalForm.value.identifiant).subscribe((res) => {
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

}
