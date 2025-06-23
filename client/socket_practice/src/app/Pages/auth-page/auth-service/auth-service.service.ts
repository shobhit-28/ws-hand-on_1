import { Injectable } from '@angular/core';
import { formField } from '../../../DTO/formFields.dto';

export type authFormFieldsType = {
  sign_in: Array<formField>,
  sign_up: Array<formField>
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private authFormFields: authFormFieldsType = {
    sign_in: [
      {
        controlName: "email",
        displayName: "Email",
        placeHolder: 'Please enter your email here',
        type: 'mail',
        isRegex: true,
        isMandatory: true,
        disable: false,
        updateOn: 'change',
        regexExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      },
      {
        controlName: "password",
        displayName: "Password",
        placeHolder: 'Please enter your password here',
        type: 'password',
        isRegex: false,
        isMandatory: true,
        disable: false,
        updateOn: 'change'
      },
    ],
    sign_up: [
      {
        controlName: "email",
        displayName: "Email",
        placeHolder: 'Please enter your email here',
        type: 'mail',
        isRegex: true,
        isMandatory: true,
        disable: false,
        updateOn: 'change',
        regexExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      },
      {
        controlName: "password",
        displayName: "Password",
        placeHolder: 'Please enter your password here',
        type: 'password',
        isRegex: false,
        isMandatory: true,
        disable: false,
        updateOn: 'change'
      },
      {
        controlName: "confirm_password",
        displayName: "Confirm Password",
        placeHolder: 'Confirm Password',
        type: 'password',
        isRegex: false,
        isMandatory: true,
        disable: false,
        updateOn: 'change'
      },
    ]
  }

  public getFormFields = (key: keyof authFormFieldsType): Array<formField> => this.authFormFields[key]
}
