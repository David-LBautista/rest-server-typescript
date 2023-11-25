import express from 'express';
import path from 'path';

interface Options {
  port: number;
  public_path: string;
}

export class Server {
  private app = express();
  private port: number;
  private publicPath: string;

  constructor(options: Options) {
    const { port, public_path } = options;
    this.port = port;
    this.publicPath = public_path;
  }

  async start() {
    this.app.use(express.static(this.publicPath));

    this.app.get('*', (req, res) => {
      const indexPath = path.join(
        __dirname + `../../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);
      return;
    });

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${3000}`);
    });
  }
}
