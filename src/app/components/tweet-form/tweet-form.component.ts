import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import {
  map,
  take,
  debounceTime,
  filter,
  tap,
  switchMap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
// import { NaturalLanguageService } from '../../services/natural-language.service';

@Component({
  selector: 'app-tweet-form',
  templateUrl: './tweet-form.component.html',
  styleUrls: ['./tweet-form.component.css']
})
export class TweetFormComponent implements OnInit {
  tweetForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.tweetForm = this.fb.group({
      content: [
        '',
        [Validators.maxLength(280), Validators.required],
        [this.niceValidator()]
      ]
    });
  }

  get errors() {
    return this.tweetForm.get('content').errors;
  }

  niceValidator() {
    return (control: AbstractControl) => {
      // //

      // const tweet = 'Happy go lucky';
      console.log(control.status);
      const endpoint =
        'http://localhost:5000/firestarter-96e46/us-central1/tweetAnalyzer';

      return control.valueChanges.pipe(
        debounceTime(500),
        switchMap(v => {
          return this.http.post(endpoint, { tweet: control.value });
        }),
        tap(console.log),
        map(res => (res.score < 0 ? { meanTweet: res.score } : null)),
        take(1)
      );

      // return this.http.post(endpoint, { tweet: control.value }).pipe(
      //   debounceTime(1000),
      //   tap(console.log),
      //   map(res => (res.score < 0 ? { meanTweet: res.score } : null))
      // );
    };
  }
}
