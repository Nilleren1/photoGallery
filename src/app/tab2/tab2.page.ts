import { Component } from '@angular/core';

//  Vi importer vores service mappe for at tilgå den her i Tab 2.
import { PhotoService, UserPhoto } from '../services/photo.service'; 

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  filePathToDelete: string = '';
  
  constructor(public photoService: PhotoService) { } 

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
   } 

   //  Går ind og sletter fra API'ens database. se mere i service.
   deletePhoto(filePathToDelete: string){
    this.photoService.deletePhoto(filePathToDelete);
   }

  //  Vi bruger en metode for at finde det specifikke element vi gerne vil slette.
   selectPhotoToDelete(photo: UserPhoto) {
    this.filePathToDelete = photo.filepath;
  }
  
    //  Asynkron metode som henter metoderne fra photoService som prioritet.
   async ngOnInit() {
    await this.photoService.loadSaved();
   } 

}
