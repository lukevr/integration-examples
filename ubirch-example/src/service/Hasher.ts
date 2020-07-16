import * as crypto from 'crypto';
import { Constants } from '../config/Constants';


export class Hasher {


    public makeHash(fields: Array<{name: string, value: string }>): string {
       const filtered = fields.filter((a) => !(Constants.NONHASHED_FIELDS.has(a.name))); 
       filtered.sort((a,b) => a.name.localeCompare(b.name) );
       const oneString = filtered.map(x => x.value).join("");
       const hash = crypto.createHash('sha3-256').update(oneString).digest('base64');
       return hash;
    }

}