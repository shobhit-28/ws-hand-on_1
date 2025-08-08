import { Injectable } from '@angular/core';
import { ImageUploaderService } from '../image-uploader/image-uploader.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewPostService {
  imageFile: { img: File | null; preview: string | null; } = {
    img: null,
    preview: null
  };

  constructor(
    private imgUploader: ImageUploaderService,
    private http: HttpClient
  ) { }

  public async triggerFileUpload() {
    const { file, preview } = await this.imgUploader.takeFileInput()

    this.imageFile = { img: file, preview }

    return this.imageFile
  }

  uploadPost(file: File, caption: string) {
    console.log(file, caption)
    console.log(caption)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', caption)

    console.log(formData)

    // return this.http.put<ApiResponse<string>>('/rchat/post/create', formData)
  }
}
