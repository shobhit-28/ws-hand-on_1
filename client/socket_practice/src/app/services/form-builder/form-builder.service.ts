import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { formField } from '../../DTO/formFields.dto';

class FormValidationClass {
  protected nullValidator = (control: AbstractControl): null | ValidationErrors => {
    return control.getRawValue() === null
      ? { required: true }
      : control.getRawValue() === ""
        ? { required: true }
        : control.getRawValue().length == 0
          ? { required: true }
          : null
  }

  protected regexValidator = (regex: RegExp): ValidatorFn => {
    return (control: AbstractControl): null | ValidationErrors => {
      return regex.test(control.getRawValue()) ? null : { invalidFormat: true }
    }
  }

  protected combineValidators = (...validators: Array<ValidatorFn>) => {
    return (control: AbstractControl) => {
      for (let validator of validators) {
        const result = validator(control);
        if (result) return result;
      }
      return null;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService extends FormValidationClass {

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  private addValidator(formField: formField, formControl: FormControl | FormArray) {
    const validatorFnList: Array<ValidatorFn> = new Array()
    if (formField.isMandatory) {
      validatorFnList.push(this.nullValidator)
    }
    if (formField?.isRegex && formField?.regexExp) {
      validatorFnList.push(this.regexValidator(formField?.regexExp))
    }
    if (validatorFnList.length > 0) {
      formControl.addValidators(this.combineValidators(...validatorFnList))
    }
  }

  private buildForms = (formGroupObj: { [key: string]: FormControl | FormGroup | FormArray }): FormGroup => new FormGroup(formGroupObj)

  public createForms(formFields: Array<formField>, isTncReq: boolean): Promise<FormGroup> {
    return new Promise<FormGroup>(async (resolve, reject) => {
      try {
        const formGroupObj: { [key: string]: FormControl | FormGroup | FormArray } = {}

        for (const formField of formFields) {
          if (formField.type === 'subForm' && formField.subFormFields?.length) {
            formGroupObj[formField.controlName] = await this.createForms(formField.subFormFields, isTncReq)
          } else if (formField.type === 'subFormArray') {
            let newControl: FormArray = this.fb.array([])
            this.addValidator(formField, newControl)
            formGroupObj[formField.controlName] = newControl
          } else {
            let newControl: FormControl = new FormControl(null, {
              updateOn: formField?.updateOn
            })
            this.addValidator(formField, newControl)
            if (formField.disable) {
              newControl.disable()
            }
            formGroupObj[formField.controlName] = newControl
          }
        }
        if (isTncReq) {
          formGroupObj['tnc'] = new FormControl(false, { validators: [Validators.requiredTrue] })
        }

        resolve(this.buildForms(formGroupObj))
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
}
