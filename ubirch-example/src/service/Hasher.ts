import * as crypto from 'crypto';


export class Hasher {


    public makeHash(fields: Array<{name: string, value: string }>): string {
       fields.sort((a,b) => a.name.localeCompare(b.name) );
       const oneString = fields.map(x => x.value).join("");
       const hash = crypto.createHash('sha3-256').update(oneString).digest('base64');
       return hash;
    }

}