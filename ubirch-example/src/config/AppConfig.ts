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

    zakaContainerUrl: string;
    zakaContainerPublicKeyFile: string;
    zakaContainerPublicKey: crypto.KeyObject;

    myPrivateKeyFile: string;
    myPrivateKey: crypto.KeyObject;


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
        const zakaContainerPublicKeyFile = json.zakaContainerPublicKeyFile;
        if (zakaContainerPublicKeyFile === undefined || zakaContainerPublicKeyFile === null) {
            throw new Error("zakaContainerPublicKeyFile is not set in appConfig");
        }
        const zakaPem = fs.readFileSync(zakaContainerPublicKeyFile);
        json.zakaContainerPublicKey = crypto.createPublicKey({ key: zakaPem });
        // TODO: insert checks
        return json;
    }

} 