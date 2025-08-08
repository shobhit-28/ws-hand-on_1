import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUploaderService {

  constructor() { }

  public async takeFileInput(): Promise<{ file: File; preview: string }> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.jpg,.jpeg,.png';

      input.onchange = () => {
        if (!input.files?.length) return reject(null);

        const file = input.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!allowedTypes.includes(file.type)) {
          console.error('❌ Invalid file type');
          return reject(null);
        }

        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string;
          resolve({ file, preview });
        };

        reader.readAsDataURL(file);
      };

      input.click();
    });
  }
}
