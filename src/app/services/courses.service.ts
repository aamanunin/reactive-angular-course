import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Course} from '../model/course';
import {map, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<{payload: Course[]}>('/api/courses')
      .pipe(
        map(res => res.payload),
        shareReplay()
      );
  }

  loadCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${courseId}`)
      .pipe(
        shareReplay()
      );
  }

  loadCourseLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<{payload: Lesson[]}>(`/api/lessons`, {
      params: {
        pageSize: '9999',
        courseId: courseId.toString()
      }
    }).pipe(
      map(res => res.payload),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        shareReplay()
      );
  }

  searchCourse(search): Observable<Lesson[]> {
    return this.http.get<{payload: Lesson[]}>('/api/lessons', {
      params: {
        filter: search,
        pageSize: '100'
      }
    }).pipe(
      map(res => res.payload),
      shareReplay()
    );
  }
}
