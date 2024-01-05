import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {Todo} from "../model/todo";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private firestore:AngularFirestore) {
    this.collectionName = 'todos';
    this.todoRef = firestore.collection(this.collectionName)
  }

  todoRef!: AngularFirestoreCollection<Todo[]>;
  collectionName!: string;

  _getTodos(): AngularFirestoreCollection<Todo[]>{
    return this.todoRef
  }

  addTodo(todo: Todo) : Promise<DocumentReference<Todo>>{
    // @ts-ignore
    return this.todoRef.add({ ...todo });
  }

  updateTodo(id: string | undefined, description?: string): Promise<void>{
    // @ts-ignore
    return this.todoRef.doc(id).update({description: description})
  }

  deleteTodo(id:  undefined | string): Promise<void>{
    return this.todoRef.doc(id).delete()
  }

  statusUpdate(id: string | undefined, status : boolean): Promise<void>{
    // @ts-ignore
    return this.todoRef.doc(id).update({status: status})
  }
}
