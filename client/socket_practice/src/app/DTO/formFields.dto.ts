export type formField = {
    controlName: string;
    displayName: string;
    placeHolder: string;
    type: 'string' | 'Date' | 'number' | 'mail' | 'tel' | 'subForm' | 'subFormArray' | 'dropdown' | 'password';
    isRegex: boolean;
    regexExp?: RegExp;
    isMandatory: boolean;
    subFormFields?: Array<formField>;
    updateOn: 'change' | 'blur' | 'submit',
    disable: boolean
}