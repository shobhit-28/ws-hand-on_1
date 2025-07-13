import { Injectable } from '@angular/core';
import { ChatFriendsList } from '../../DTO/users.dto';

@Injectable({
  providedIn: 'root'
})
export class CoreJsService {
  private urlRegex: RegExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig

  constructor() { }

  makeDeepCopy = <T>(obj: T): T => structuredClone(obj)

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

  imgResizer = (url: string, height: number, width: number): string => {
    if (url) {
      if (url.includes('cloudinary')) {
        return url.replace('/upload/', `/upload/w_${width},h_${height},c_thumb/`)
      } else {
        return url
      }
    } else {
      return ''
    }
  }

  moveToTop = (arr: Array<ChatFriendsList>, id: string) => {
    const index = arr.findIndex(obj => obj._id === id)
    if (index === -1) return arr
    const item = arr[index]
    return [item, ...arr.slice(0, index), ...arr.slice(index + 1)]
  }
}
