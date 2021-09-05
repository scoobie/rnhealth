import {Component} from '@angular/core';
import {AppToastService} from "../../services/app-toast.service";

@Component({
  selector: 'app-toasts-closeable',
  template: `
    <ngb-alert
      *ngFor="let alert of toastService.simpleAlert"
      [type]="alert.type" (closed)="toastService.removeAlert(alert)">{{ alert.message }}</ngb-alert>
  `,
  styleUrls: ['./app-toast-closeable.component.css']
})
export class AppToastCloseableComponent {
  constructor(public toastService: AppToastService) { }

}
