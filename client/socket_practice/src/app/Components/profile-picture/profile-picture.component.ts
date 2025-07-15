import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePicHandlerService } from '../../services/profilePicHandler/profile-pic-handler.service';

@Component({
  selector: 'raj-chat-profile-picture',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './profile-picture.component.html',
  styleUrl: './profile-picture.component.css'
})
export class ProfilePictureComponent implements OnInit {
  img!: { img: File | null; preview: string | null; };

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

}
