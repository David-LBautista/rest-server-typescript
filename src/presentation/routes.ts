import { Router } from 'express';
import { ToDoRoutes } from './todos/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/todos', ToDoRoutes.routes);

    return router;
  }
}
