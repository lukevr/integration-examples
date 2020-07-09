import * as crypto from 'crypto';


export class Hasher {


    public makeHash(fields: Array<{name: string, value: string }>): string {
       fields.sort((a,b) => a.name.localeCompare(b.name) );
       const oneString = fields.join("");
       const hash = crypto.createHash('sha3-256').update(oneString).digest('base64');
       return hash;
    }

}