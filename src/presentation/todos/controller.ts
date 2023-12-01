import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodosController {
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();

    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: `Id must be a number`,
        data: null,
      });
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

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

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });

    res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const [error, updateTodoDto] = UpdateTodoDto.update({
      ...req.body,
      id,
    });

    if (error) res.status(400).json({ error });

    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      return res.status(404).json({
        ok: false,
        message: `Todo with id:${id} does not exist`,
        data: null,
      });
    }

    const todoUpdated = await prisma.todo.update({
      where: {
        id,
      },
      data: updateTodoDto!.values,
    });

    res.json(todoUpdated);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const deleted = await prisma.todo.delete({ where: { id } });

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: `Id must be a number`,
        data: null,
      });
    }

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: `Todo with id:${id} does not exist`,
        data: null,
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Success',
      todoDeleted: deleted,
    });
  };
}
