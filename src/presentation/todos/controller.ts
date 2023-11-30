import { Request, Response } from 'express';

const todos = [
  { id: 1, text: 'buy milk', completedAt: new Date() },
  { id: 2, text: 'buy milk 2', completedAt: null },
  { id: 3, text: 'buy milk 3', completedAt: new Date() },
];

export class TodosController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const todo = todos.find((todo) => todo.id === id);

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: `Id must be a number`,
        data: null,
      });
    }

    if (!todo) {
      return res.status(404).json({
        ok: false,
        message: `Todo with id:${id} does not exist`,
        data: null,
      });
    }

    return res.json({
      ok: true,
      message: 'Success',
      data: [todo],
    });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text)
      return res.status(400).json({ error: 'Text property is required' });

    const newTodo = {
      id: todos.length + 1,
      text,
      completedAt: null,
    };

    todos.push(newTodo);

    res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: `Id must be a number`,
        data: null,
      });
    }

    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
      return res.status(404).json({
        ok: false,
        message: `Todo with id:${id} does not found`,
        data: null,
      });
    }

    const { text, completedAt } = req.body;

    todo.text = text || todo.text;
    completedAt === null
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));

    res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    const todo = todos.find((todo) => todo.id === id);

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: `Id must be a number`,
        data: null,
      });
    }

    if (!todo) {
      return res.status(404).json({
        ok: false,
        message: `Todo with id:${id} does not exist`,
        data: null,
      });
    }

    todos.splice(todos.indexOf(todo), 1);
    res.status(200).json({
      ok: true,
      message: 'Success',
      todoDeleted: todo,
    });

    console.log(todos);
  };
}
