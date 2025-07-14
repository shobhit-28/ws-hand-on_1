import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

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
export class ProfilePictureComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfilePictureComponent>
  ) { }

  closeDialog() {
    this.dialogRef.close()
  }

}
