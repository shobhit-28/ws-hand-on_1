import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePicHandlerService {
  private imageFile: {
    img: File | null,
    preview: string | null
  } = {
      img: null,
      preview: null
    }

  constructor(
    private http: HttpClient
  ) { }

  private async takeFileInput(): Promise<{ file: File; preview: string }> {
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

  uploadFile(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('profile_pic', file);

    return this.http.put<ApiResponse<string>>('/rchat/user/uploadProfilePic', formData)
  }

  public async triggerFileUpload() {
    const { file, preview } = await this.takeFileInput()

    this.imageFile = { img: file, preview }

    return this.imageFile
  }

  public getImg(): {
    img: File | null,
    preview: string | null
  } {
    return this.imageFile
  }

  updateLatestProfilePic(): void {
    this.http.get<ApiResponse<null>>('/rchat/user/updateProfilePic').subscribe({
      error: (err) => console.error(err)
    })
  }
  
  updateLatestProfileDetails(): void {
    this.http.get<ApiResponse<null>>('/rchat/user/updateProfileDetails').subscribe({
      error: (err) => console.error(err)
    })
  }
}
