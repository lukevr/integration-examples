import * as crypto from 'crypto';
import { Inject } from "typescript-ioc";
import { ConfigService } from './ConfigService';



export class Hasher {

    @Inject
    private configService: ConfigService;

    public makeHash(fields: Array<{name: string, value: string }>): string {
       fields.sort((a,b) => a.name.localeCompare(b.name) );
       const oneString = fields.join("");
       const privateKey = this.configService.config().hashPrivateKey; 
       const hash = crypto.sign('sha3-256', Buffer.from(oneString), privateKey);
       return hash.toString('base64');
    }

}