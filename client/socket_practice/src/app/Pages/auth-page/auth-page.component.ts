import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { formField } from '../../DTO/formFields.dto';
import { authFormFieldsType, AuthServiceService } from './auth-service/auth-service.service';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { HttpClient } from '@angular/common/http';
import { loginPayload, signupPayload } from '../../DTO/auth.dto';

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
  currForm: keyof authFormFieldsType = 'sign_in'
  formKeysSwitch: { [k: string]: keyof authFormFieldsType } = {
    sign_in: 'sign_up',
    sign_up: 'sign_in'
  }

  constructor(
    private authService: AuthServiceService,
    private fb: FormBuilderService,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  async ngOnInit(): Promise<void> {
    this.formFields = this.authService.getFormFields(this.currForm)
    this.authForm = await this.fb.createForms(this.formFields, false)
  }

  public switchForm = async () => {
    this.formFields = new Array()
    this.cd.detectChanges()
    this.formFields = this.authService.getFormFields(this.formKeysSwitch[this.currForm])
    this.authForm = await this.fb.createForms(this.formFields, false)
    this.currForm = this.formKeysSwitch[this.currForm]
  }

  public authBtnClicked() {
    // this.callTestApi()
    if (this.authForm.valid) {
      if (this.currForm === 'sign_in') {
        this.login(this.authForm.getRawValue())
      } else {
        this.signup(this.authForm.getRawValue())
      }
    }
  }

  private async login(formValue: loginPayload) {
    console.log(await this.authService.login(formValue))
  }

  private async signup(formValue: signupPayload) {
    console.log(await this.authService.signup(formValue))
  }

  private callTestApi() {
    this.http.get('/rchat/auth/test').subscribe((res) => console.log(res))
  }
}
