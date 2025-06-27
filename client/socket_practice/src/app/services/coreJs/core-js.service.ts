import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreJsService {
  private urlRegex: RegExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig

  constructor() { }

  makeDeepCopy = (obj: Object) => JSON.parse(JSON.stringify(obj))

  bifurcateTextIntoTextAndUrls = (txt: string): Array<{ url: boolean, text: string }> =>
    txt.split(' ').map(
      (subTxt) => this.urlRegex.test(subTxt)
        ? { url: true, text: subTxt }
        : { url: false, text: subTxt }
    )

  debounceFunc(func: Function, delay: number) {
    let timer: any = null;
    return function (this: any, ...args: Array<any>) {
      let context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args)
      }, delay)
    }
  }

  truncateText(text: string, maxLen: number): string {
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
  }
}
