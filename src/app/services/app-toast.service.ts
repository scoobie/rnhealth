import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppToastService {
  toasts: any[] = [];
  simpleAlert:any[]=[];

  constructor() { }

  show(textOrTpl: string, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast:any) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

  SimpleAlert(type:string,message:string){
    this.simpleAlert.push({type,message})
  }

  removeAlert(alert:any){
    this.simpleAlert=this.simpleAlert.filter(t=>t!=alert);
  }
}
