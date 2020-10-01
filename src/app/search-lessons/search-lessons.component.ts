import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CoursesService} from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css']
})
export class SearchLessonsComponent implements OnInit {

  public searchLessons$: Observable<Lesson[]>;
  public activeLesson: Lesson = null;

  constructor(
    private coursesService: CoursesService
  ) {


  }

  ngOnInit() {


  }

  onSearch(value: string) {
    this.searchLessons$ = this.coursesService.searchCourse(value);
  }

  openLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  backToSearch() {
    this.activeLesson = null;
  }
}











