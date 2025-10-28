import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { MatButton } from '@angular/material/button';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  protected todos: {
    content: string | null;
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  }[] = [];

  public ngOnInit(): void {
    this.listTodos();
  }

  protected listTodos(): void {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error fetching todos', error);
    }
  }

  protected createTodo(): void {
    try {
      client.models.Todo.create({
        content: window.prompt('Todo content'),
      });
      this.listTodos();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error creating todos', error);
    }
  }
}
