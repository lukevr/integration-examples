import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import {Server} from 'typescript-rest';
import controllers from './controller';
import { HttpError } from 'typescript-rest/dist/server/model/errors';
import morgan = require('morgan');

export class ApiServer {
    public PORT: number = +process.env.PORT || 4011;

    private readonly app: express.Application;
    private server: http.Server = null;

    constructor() {
        this.app = express();
        this.config();

        Server.useIoC();
        Server.buildServices(this.app, ...controllers);

        this.app.use(this.errorHandler);
   
        // to prevent [ERR_HTTP_HEADERS_SENT]
        // Server.ignoreNextMiddlewares(true);

        // TODO: enable for Swagger generation error
        // Server.loadServices(this.app, 'controllers/*', __dirname);
        // Swagger is disabled, since it cna't understand typescript Record db
        // Server.swagger(this.app, {filePath: './dist/swagger.json'});
    }

    /**
     * Start the server
     * @returns {Promise<any>}
     */
    public start(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: any) => {
                if (err) {
                    return reject(err);
                }

                // TODO: replace with Morgan call
                // tslint:disable-next-line:no-console
                console.log(`Listening to http://127.0.0.1:${this.PORT}`);

                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

    /**
     * Configure the express app.
     */
    private config(): void {
        // Native Express configuration
        // this.app.use( bodyParser.urlencoded( { extended: false } ) );
        // this.app.use( bodyParser.json( { limit: '1mb' } ) );

        // TODO: use secure cors rules on prod
        const corsOptions = {
            origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                callback(null, true);
            },
            methods: ["GET", "PUT", "POST", "DELETE"],
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
            credentials: true
        };
        this.app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));
        this.app.use(cors(corsOptions));
        this.app.use(morgan('combined'));
    }


    private errorHandler: express.ErrorRequestHandler = (err,req,resp,next) => {
        console.log("!!ErrorHandler");
        console.log(err);
        if (!resp.headersSent) {
            if (err instanceof HttpError) {
                resp.status(err.statusCode);
                resp.send(JSON.stringify({ error: err.message }));
            } else {
                resp.status(500);
                resp.send(err.message);
            }
        }
    }

}
