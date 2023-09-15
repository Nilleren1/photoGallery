import { Component } from '@angular/core';

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

   deletePhoto(filePathToDelete: string){
    this.photoService.deletePhoto(filePathToDelete);
   }

   selectPhotoToDelete(photo: UserPhoto) {
    this.filePathToDelete = photo.filepath;
  }
  

   async ngOnInit() {
    await this.photoService.loadSaved();
   } 

}
