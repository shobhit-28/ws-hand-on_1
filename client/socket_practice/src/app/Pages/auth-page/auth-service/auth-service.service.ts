import { Injectable } from '@angular/core';
import { formField } from '../../../DTO/formFields.dto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { loginPayload, loginResponse, signupPayload, signupResponse } from '../../../DTO/auth.dto';
import { AuthService } from '../../../services/auth/auth.service';

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
        controlName: "name",
        displayName: "Name",
        placeHolder: 'Please enter your name here',
        type: 'string',
        isRegex: false,
        isMandatory: true,
        disable: false,
        updateOn: 'change'
      },
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
        controlName: "confirmPassword",
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

  constructor(
    private http: HttpClient,
    private centralAuthService: AuthService
  ) { }

  public login(payload: loginPayload): Promise<loginResponse> {
    return new Promise<loginResponse>((resolve, reject) => {
      this.http.post<loginResponse>('/rchat/auth/login', payload).subscribe({
        next: (response: loginResponse) => {
          this.signInFunc()
          resolve(response)
        },
        error: (error: HttpErrorResponse) => {
          this.signOutFunc()
          reject(error)
        }
      })
    })
  }

  public signup(payload: signupPayload): Promise<signupResponse> {
    return new Promise<signupResponse>((resolve, reject) => {
      this.http.post<signupResponse>('/rchat/auth/signup', payload).subscribe({
        next: (response: signupResponse) => {
          this.signInFunc()
          resolve(response)
        },
        error: (error: HttpErrorResponse) => {
          this.signOutFunc()
          reject(error)
        }
      })
    })
  }

  private signInFunc() {
    this.centralAuthService.setIsLoggedIn(true)
  }

  private signOutFunc() {
    this.centralAuthService.setIsLoggedIn(false)
  }

  public getFormFields = (key: keyof authFormFieldsType): Array<formField> => this.authFormFields[key]
}
