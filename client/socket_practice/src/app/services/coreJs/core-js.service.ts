import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreJsService {

  constructor() { }

  makeDeepCopy = (obj: Object) => JSON.parse(JSON.stringify(obj))
}
