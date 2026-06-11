import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from './spinner-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [MatProgressSpinnerModule , AsyncPipe
  ],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {

  SpinnerService = inject(SpinnerService);


  ngOnInit() {
 
  }

  public show() {
    this.SpinnerService.activeRequest$.next(this.SpinnerService.activeRequest$.value + 1);
  }

  public hide() {
     this.SpinnerService.activeRequest$.next(this.SpinnerService.activeRequest$.value <= 0 ? 0 : this.SpinnerService.activeRequest$.value - 1);  
   
  }

}
