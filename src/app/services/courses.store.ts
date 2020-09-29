import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {catchError, map, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MessagesService} from '../messages/messages.service';
import {LoadingService} from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private messages: MessagesService,
    private loading: LoadingService
  ) {
    this.loadAllCourses();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category === category).sort(sortCoursesBySeqNo))
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();

    const index = courses.findIndex(course => course.id === courseId);

    const newCourse = {
      ...courses[index],
      ...changes
    };

    const newCourses = [...courses];
    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError(err => {
          const message = 'Could not save course';
          this.messages.showErrors([err]);
          console.log(message, err);
          return throwError(err);
        }),
        shareReplay()
      );
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<{payload: Course[]}>('/api/courses')
      .pipe(
        map(res => res.payload),
        catchError(err => {
          const message = 'Could not load courses';
          this.messages.showErrors([message]);
          console.log(message, err);
          return throwError(err);
        }),
        tap((courses) => this.subject.next(courses))
      );

    this.loading.showLoadingUntilCompleted(loadCourses$)
      .subscribe(() => {});
  }
}
