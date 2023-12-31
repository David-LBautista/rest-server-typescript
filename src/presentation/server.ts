import express, { Router } from 'express';
import path from 'path';

interface Options {
  port: number;
  routes: Router;
  public_path: string;
}

export class Server {
  private app = express();
  private port: number;
  private publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    this.app.use(express.static(this.publicPath));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //*Routes
    this.app.use(this.routes);

    //*SPA
    this.app.get('*', (req, res) => {
      const indexPath = path.join(
        __dirname + `../../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);
      return;
    });

    //*PORT
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
