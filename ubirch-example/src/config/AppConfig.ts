import * as crypto from 'crypto';
import * as fs from 'fs';
import * as hjson from 'hjson';


export interface AppConfig {

    userProfileCredentialId: string;

    testServiceDid: string;

    testIdCredentialId: string;
    testIdSchemaId: string;
    
    testResultSchemaId: string;
    testResultCredentialId: string;

    ubirchBaseUrl: string; 
    ubirchLocalUrl: string;
    ubirchUUID: string;
    ubirchToken: string;

    mongodbUri: string;
    debugMongoConnection: boolean;

    zakaUrl: string;
    zakaPublicKeyFile: string;
    zakaPublicKey: crypto.KeyObject;

    myPrivateKeyFile: string;
    myPrivateKey: crypto.KeyObject;

    hashPrivateKeyFile: string;
    hashPrivateKey: crypto.KeyObject;

}


export class AppConfigHelper {


    public static read(fname: string): AppConfig {
        const json = hjson.parse(fs.readFileSync(fname).toString("UTF8"));
        const myPrivateKeyFile = json.myPrivateKeyFile;
        if (myPrivateKeyFile === undefined || myPrivateKeyFile === null) {
            throw new Error("myPrivateKeyFile is not set in appConfig");
        }
        const signingPem = fs.readFileSync(myPrivateKeyFile);
        json.myPrivateKey = crypto.createPrivateKey({ key: signingPem });
        const zakaPublicKeyFile = json.zakaPublicKeyFile;
        if (zakaPublicKeyFile === undefined || zakaPublicKeyFile === null) {
            throw new Error("zalaPublicKeyFile is not set in appConfig");
        }
        const zakaPem = fs.readFileSync(zakaPublicKeyFile);
        json.zakaPublicKey = crypto.createPublicKey({ key: zakaPem });
        const hashPrivateKeyFile = json.hashPrivateKeyFile;
        if (hashPrivateKeyFile === undefined || hashPrivateKeyFile === null) {
            throw new Error("hashPrivateKeyFile is not set in appConfig");
        }
        // TODO: insert checks
        return json;
    }

} 