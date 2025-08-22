import { Injectable } from '@angular/core';
import { ChatFriendsList } from '../../DTO/users.dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoreJsService {
  private urlRegex: RegExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig

  constructor(
    private router: Router
  ) { }

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

  navigateToProfilePage(userId: string) {
    const urlTree = this.router.createUrlTree(
      ['/rc', { outlets: { sideBar: ['profile', userId] } }]
    );
    this.router.navigateByUrl(urlTree);
  }
  
  navigateToPostPage(postId: string) {
    const urlTree = this.router.createUrlTree(
      ['/rc', { outlets: { sideBar: ['post', postId] } }]
    );
    this.router.navigateByUrl(urlTree);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => console.log('Copied:', text))
      .catch(err => console.error('Copy failed:', err));
  }

  timeAgo(isoString: string) {
    const ms = new Date(isoString).getTime()
    const now = Date.now()
    const diff = Math.max(0, now - ms)

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    const months = Math.floor(diff / (30 * 86400000))
    const years = Math.floor(diff / (365 * 86400000))

    if (years > 0) return `${years}y`
    if (months > 0) return `${months}m`
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
  }
}
