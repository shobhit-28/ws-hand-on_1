import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

type matData = {
  dialog: string,
  buttonNames: {
    YES: string,
    NO: string
  }
}

@Component({
  selector: 'raj-chat-delete-confirmation',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css'
})
export class DeleteConfirmationComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: matData,
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>
  ) { }

  closeDialog(yesNo: 'YES' | 'NO') {
    this.dialogRef.close(yesNo)
  }
}
