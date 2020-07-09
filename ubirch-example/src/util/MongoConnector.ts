import {config} from 'dotenv';
import * as mongoose from 'mongoose';
import {Connection, ConnectionOptions} from 'mongoose';
import { AppConfig } from '../config/AppConfig';

export class MongoConnector {

    private mongoConnection: Connection;
    private cfg: AppConfig;

    constructor(cfg: AppConfig) {

        /**
         * Load environment variables from .env file, where API keys and passwords are configured.
         */
        config({path: '.env'});
        
        this.cfg = cfg;

        (mongoose as any).Promise = global.Promise;
        // (mongoose as any).Promise = require('bluebird');
    }

   
    /**
     * Initiate connection to MongoDB
     * @returns {Promise<any>}
     */
    public connect(): Promise<any> {
        const connector = this;
        const mongoUri = process.env.MONGODB_URI || this.cfg.mongodbUri ;
        return new Promise<any>((resolve, reject) => {
              mongoose.connection.once('open', function() {
                  console.log('MongoDB event open');
                  console.log('MongoDB connected [%s]', mongoUri);
            
                   mongoose.connection.on('connected', () => {
                    if (connector.cfg.debugMongoConnection) {  
                       console.log('MongoDB event connected');
                    }
                   });
            
                   mongoose.connection.on('disconnected', () => {
                    if (connector.cfg.debugMongoConnection) {
                        console.log('MongoDB event disconnected');
                    }
                   });
             
                   mongoose.connection.on('reconnected', () => {
                    if (connector.cfg.debugMongoConnection) {
                        console.log('MongoDB event reconnected');
                    }
                   });
              
                   mongoose.connection.on('error', (err) => {
                     if (connector.cfg.debugMongoConnection) {  
                       console.log('MongoDB event error: ' + err);
                     }
                   });
              
                 return resolve();
             });

            const options: ConnectionOptions = {
                keepAlive: true,
                useNewUrlParser: true
                // promiseLibrary: require('bluebird')
            };
            this.mongoConnection = mongoose.connection;
            mongoose.connect(mongoUri, options).then(() => {
                const indexOfA = mongoUri.indexOf('@');
                const db = indexOfA !== -1 ?
                    mongoUri.substring(0, 10) + '!_:_!' + mongoUri.substring(indexOfA) :
                    mongoUri;
                // tslint:disable-next-line:no-console
                console.log('MongoDB connected [%s]', db);
                resolve();
            }).catch(reject);
        });
    }

    /**
     * Disconnects from MongoDB
     * @returns {Promise<any>}
     */
    public disconnect(): Promise<any> {
        return this.mongoConnection.close();
    }
}
