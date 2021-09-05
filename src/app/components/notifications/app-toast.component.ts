import {Component} from '@angular/core';
import {AppToastService} from "../../services/app-toast.service";

@Component({
  selector: 'app-toasts',
  template: `
  <ngb-toast
  *ngFor="let toast of toastService.toasts"
  [class]="toast.classname"
  [autohide]="true"
  [delay]="toast.delay || 3000"
  (hidden)="toastService.remove(toast)">
  {{ toast.textOrTpl }}
</ngb-toast>
  `,
  styleUrls: ['./app-toast.component.css']
})
export class AppToastComponent {
  constructor(public toastService: AppToastService) { }
}
