import { Injectable } from '@angular/core';

//   Importerer kamera API, til service.
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
// Her ses en klasse med navnet PhotoService
export class PhotoService {
// Her er vores property/array (liste af fotos).
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  private async savePicture(photo: Photo) { // Convert photo to base64 format, required by Filesystem API to save.
    const base64Data = await this.readAsBase64(photo);
    // Write the file to the data directory
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    //  Blob, konverterer til (Binary Large Object). Typisk brugt til billeder.
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  /* Empty constructor for Dependency Injection. -  
   Even if a service doesn't have its own dependencies to inject, 
   Angular still needs a constructor to inject it correctly when requested by other components or services.*/
  constructor() { }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    // Save the picture and add it to photo collection (måske udkommenter)
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  public async deletePhoto(filepathToDelete: string) {
    try {
      // Remove the photo from the photos array by filtering out the one to delete
      this.photos = this.photos.filter(photo => photo.filepath !== filepathToDelete);

      // Update the stored photos in Preferences
      Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos),
      });

      // Delete the file from the filesystem
      await Filesystem.deleteFile({
        path: filepathToDelete,
        directory: Directory.Data,
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error; // You can handle the error as needed.
    }
  }

  //   this.photos.unshift({
  //     filepath: "soon...",
  //     webviewPath: capturedPhoto.webPath!
  //     });
  //  } 

  //Retrieving Data.
  public async loadSaved() {
    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];
    // more to come...
    // Display the photo by reading into base64 format
    for (let photo of this.photos) {
      // Read each saved photo's data from the Filesystem
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      // Web platform only: Load the photo as base64 data
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }
}


export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
} 
