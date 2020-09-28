import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable()
export class MessagesService {
  private subject = new BehaviorSubject([]);
  errors$: Observable<string[]> = this.subject.asObservable()
    .pipe(
      filter(errors => errors && !!errors.length)
    );

  showErrors(errors: string[]): void {
    this.subject.next(errors);
  }
}
