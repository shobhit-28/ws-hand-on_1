import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';
import { NewPostService } from '../../services/new-post-service/new-post.service';

@Component({
  selector: 'raj-chat-new-post',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    LoaderComponent,
    FormsModule
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit {
  newPost: {
    img: { img: File | null; preview: string | null; } | null,
    caption: string
  } = {
      img: null,
      caption: ''
    }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewPostComponent>,
    private newPostService: NewPostService
  ) { }

  ngOnInit(): void {
    this.newPost.img = this.newPostService.imageFile
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onCaptionChange(caption: string) {
    console.log(caption)
  }

  async reUpload() {
    this.newPost.img = await this.newPostService.triggerFileUpload()
  }

  async createNewPost() {
    if (this.newPost.img?.img && this.newPost.caption) {
      this.newPostService.uploadPost(this.newPost.img?.img, this.newPost.caption)
    } else {
      console.error(`Fill the required fields`)
    }
  }
}
