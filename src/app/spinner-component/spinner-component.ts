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
  templateUrl: './spinner-component.html',
  styleUrl: './spinner-component.css',
})
export class SpinnerComponent {

  SpinnerService = inject(SpinnerService);


  ngOnInit() {
 
  }

 

}
