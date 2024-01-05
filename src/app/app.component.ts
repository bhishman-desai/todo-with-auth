import { Component } from '@angular/core';
import {HttpService} from "./service/http.service";
import {map} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firebase-todo';
  constructor(private httpService:HttpService) {
  }
  _getData() {
    this.httpService
      ._getTodos()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
