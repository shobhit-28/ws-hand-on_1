import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';

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
export class NewPostComponent {
  newPost: {
    img: string,
    caption: string
  } = {
      img: '',
      caption: ''
    }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewPostComponent>,
  ) { }

  closeDialog() {
    this.dialogRef.close()
  }

  onCaptionChange(caption: string) {
    console.log(caption)
  }
}
