import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { formField } from '../../../DTO/formFields.dto';
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ProfileService } from '../edit-profile/profile.service';
import { updateProfileApiPayload } from '../../../DTO/users.dto';

@Component({
  selector: 'raj-chat-edit-profile-modal',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatError,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfileModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, formFields: Array<formField> },
    private dialogRef: MatDialogRef<EditProfileModalComponent>,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  closeDialog(data?: updateProfileApiPayload) {
    this.dialogRef.close(data ? data : null)
  }

  editProfile() {
    if (this.data.form.pristine) {
      this.closeDialog()
    } else {
      if (this.data.form.valid) {
        this.profileService.updateProfile(this.data.form.value).subscribe({
          next: () => this.closeDialog(this.data.form.getRawValue()),
          error: (err) => console.error(err)
        })
      } else {
        this.data.form.markAllAsTouched();
      }
    }
  }
}
