import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SpinnerService {

  public activeRequest$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public show() {
    this.activeRequest$.next(this.activeRequest$.value + 1);
  }

  public hide() {
    const currentValue = this.activeRequest$.value;
    if (currentValue > 0) {
      this.activeRequest$.next(currentValue - 1);
    }
  }

}
