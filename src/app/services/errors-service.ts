import { HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';

interface ErrorAction {
  showErrorInDialog?: boolean;
}

export class ErrorResponse<T> {
  constructor(
    public status: number,
    public value: T | string,
  ) {}
}

@Service()
export class ErrorsService {
  //   private readonly dialog = inject(MatDialog);

  // Converts an unknown error into a friendly message for the user.
  public getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'Unable to connect to the server. Please check your connection and try again.';
        case 401:
          return 'Your session has expired. Please sign in again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource could not be found.';
        case 500:
          return 'The server encountered an error. Please try again later.';
        default:
          return error.message || 'An unexpected request error occurred.';
      }
    }

    // Fallback for non-HttpErrorResponse objects that still carry a server message.
    const fallbackMessage =
      (error as { error?: { error?: { message?: string }; message?: string } })?.error?.error
        ?.message ||
      (error as { error?: { message?: string } })?.error?.message ||
      (error as { message?: string })?.message;

    return fallbackMessage || 'Server not available. Please try again later!';
  }

  //   // Opens the reusable Material dialog shown to users when a request fails.
  //   public showErrorDialog(message: string, title = 'Request failed'): void {
  //     this.dialog.open(ErrorDialog, {
  //       data: { title, message },
  //       disableClose: false,
  //     });
  //   }

  public handleError<T>(
    operation: string,
    errorAction: ErrorAction = { showErrorInDialog: true },
  ): (error: any) => Observable<ErrorResponse<T>> {
    return (error: any): Observable<ErrorResponse<T>> => {
      const message = this.getErrorMessage(error);

      if (errorAction.showErrorInDialog) {
        // Show error in a dialog (you can implement your own dialog service)
        console.error(`Error in ${operation}:`, message, error);
      } else {
        // Log the error to the console
        console.error(`Error in ${operation}:`, message, error);
      }

      return of(
        new ErrorResponse<T>(error.status, error.message || 'An unexpected error occurred.'),
      );
    };
  }
}
