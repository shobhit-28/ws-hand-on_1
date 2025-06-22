import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { formField } from '../../DTO/formFields.dto';
import { AuthServiceService } from './auth-service/auth-service.service';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';

@Component({
  selector: 'raj-chat-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent implements OnInit {

  authForm!: FormGroup
  formFields: Array<formField> = new Array();

  constructor(
    private authService: AuthServiceService,
    private fb: FormBuilderService
  ) { }

  async ngOnInit(): Promise<void> {
    this.formFields = this.authService.getFormFields('sign_in')
    this.authForm = await this.fb.createForms(this.formFields, false)

    console.log(this.authForm)
  }

  public login() {

  }
}
