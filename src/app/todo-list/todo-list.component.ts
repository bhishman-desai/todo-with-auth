import {Component, OnInit} from '@angular/core';
import {HttpService} from "../service/http.service";
import {map} from "rxjs";
import {Todo} from "../model/todo";
import {FormControl} from "@angular/forms";
import {MatCheckboxChange} from "@angular/material/checkbox";


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.httpService._getTodos()
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c, index) => ({
            refId: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        }),
      )
      .subscribe((data) => {
        // Id logic
        if (data.length === 0) {
          this.id = data.length + 1
        } else {
          let maxArr = data.map(elements => {
              // @ts-ignore
              if (elements.id !== undefined) return elements.id
            }
          )
          this.id = Math.max(...maxArr) + 1
        }

        // @ts-ignore
        this.todos = data.sort((a, b) => {
          // @ts-ignore
          return b.id - a.id
        })
        this.isLoading = false;
      });

  }

  todos: Todo[] = [];
  isLoading: boolean = true;
  buttonDisabled = true;
  id!: number;


  // Add a record
  addTodo(inputElement: HTMLInputElement) {
    // if the input is empty then return nothing
    if (inputElement.value === '') {
      this.buttonDisabled = true;
      return
    }

    // if there is any input
    this.isLoading = true;
    this.httpService.addTodo({id: this.id, description: inputElement.value, status: false}).then(() => {
      this.isLoading = false;
    })
    inputElement.value = ''
  }


  // Edit a record
  updateTodo(id: number | undefined, description: string) {
    if (id && description) {
      this.isLoading = true;
      this.httpService.updateTodo(id.toString(), description).then(() => {
        this.isLoading = false;
      })
    }
  }


  // Delete a record
  deleteTodo(id: number | undefined) {
    if (id) {
      this.isLoading = true;
      this.httpService.deleteTodo(id.toString()).then(() => {
        this.isLoading = false;
      })
    }
  }

  statusUpdate(id: number | undefined, $event: MatCheckboxChange) {
    if (id) {
      this.isLoading = true;
      this.httpService.statusUpdate(id.toString(), $event.checked).then(() => {
        this.isLoading = false;
      })
    }
  }
}
