import { Injectable } from '@angular/core';
import { formField } from '../../../DTO/formFields.dto';
import { FormBuilderService } from '../../../services/form-builder/form-builder.service';
import { FormGroup } from '@angular/forms';
import { updateProfileApiPayload } from '../../../DTO/users.dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private editProfileFields: Array<formField> = [
    {
      controlName: "name",
      displayName: "Name",
      placeHolder: 'Please enter your name here',
      type: 'string',
      isRegex: false,
      isMandatory: true,
      disable: false,
      updateOn: 'change',
    }, {
      controlName: "email",
      displayName: "Email",
      placeHolder: 'Please enter your email here',
      type: 'mail',
      isRegex: true,
      isMandatory: true,
      disable: false,
      updateOn: 'change',
      regexExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    }, {
      controlName: "bio",
      displayName: "Bio",
      placeHolder: 'Please enter your bio here',
      type: 'string',
      isRegex: true,
      isMandatory: false,
      disable: false,
      updateOn: 'change',
      regexExp: /^.{0,40}$/
    }
  ]

  constructor(
    private fb: FormBuilderService,
    private http: HttpClient
  ) { }

  public async createEditProfileForm(): Promise<{ form: FormGroup, formFields: Array<formField> }> {
    const form: FormGroup = await this.fb.createForms(this.editProfileFields, false)
    return { form, formFields: this.editProfileFields }
  }

  public updateProfile(payload: updateProfileApiPayload): Observable<void> {
    return this.http.put<void>('/rchat/user/updateProfile', payload)
  }
}
