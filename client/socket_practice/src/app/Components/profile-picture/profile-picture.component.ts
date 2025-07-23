import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePicHandlerService } from '../../services/profilePicHandler/profile-pic-handler.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'raj-chat-profile-picture',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    LoaderComponent
  ],
  templateUrl: './profile-picture.component.html',
  styleUrl: './profile-picture.component.css'
})
export class ProfilePictureComponent implements OnInit {
  img!: { img: File | null; preview: string | null; };
  loading: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfilePictureComponent>,
    private profilePicHandler: ProfilePicHandlerService
  ) { }

  ngOnInit(): void {
    this.img = this.profilePicHandler.getImg()
  }

  closeDialog() {
    this.dialogRef.close()
  }

  async reUpload() {
    const image = await this.profilePicHandler.triggerFileUpload()
    this.img = image
  }

  uploadProfilePicture() {
    this.loading = true
    if (this.img.img) {
      this.profilePicHandler.uploadFile(this.img.img).subscribe({
        next: (res) => {
          console.log(res.message);
          this.closeDialog()
          this.loading = false
        },
        error: (error) => {
          console.error(error)
          this.loading = false
        }
      })
    } else {
      this.loading = false
      console.error(`Select an image to upload`)
    }
  }

}
