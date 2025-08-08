import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { Observable } from 'rxjs';
import { ImageUploaderService } from '../image-uploader/image-uploader.service';

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
    private http: HttpClient,
    private imgUploader: ImageUploaderService
  ) { }

  uploadFile(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('profile_pic', file);

    return this.http.put<ApiResponse<string>>('/rchat/user/uploadProfilePic', formData)
  }

  public async triggerFileUpload() {
    const { file, preview } = await this.imgUploader.takeFileInput()

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
