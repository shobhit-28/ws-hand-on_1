import { Injectable } from '@angular/core';
import { ImageUploaderService } from '../image-uploader/image-uploader.service';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { HttpClient } from '@angular/common/http';
import { NewPost } from '../../DTO/posts.dto';

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

  uploadPost(file: File, caption: string): Observable<NewPost> {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('content', caption)

    return this.http.post<ApiResponse<NewPost>>('/rchat/post/create', formData).pipe(
      map(res => res.data)
    )
  }
}
