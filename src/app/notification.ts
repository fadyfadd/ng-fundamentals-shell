import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class Notification {

    private snackBar: MatSnackBar = inject(MatSnackBar);


    public confirm(message: string, action: string = "CONFIRM", duration: number = 5000): Promise<boolean> {
        return new Promise((resolve) => {
            const snackRef = this.snackBar.open(message, action, {
                duration: duration,
            });

            snackRef.onAction().subscribe(() => {
                resolve(true);
            });

            snackRef.afterDismissed().subscribe(() => {
                resolve(false);
            });
        });
    }

    public showError(message: string): void {
        this.snackBar.open(message, "Close", {
            duration: 5000,
            panelClass: ['bg-error']
        });
    }

    public showSuccess(message: string): void {
        this.snackBar.open(message, "Close", {
            duration: 3000,
            panelClass: ['bg-success']
        });
    }

}
