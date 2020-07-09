
import * as crypto from 'crypto';
import * as express from 'express';
import {Container} from "typescript-ioc";
import { Errors } from 'typescript-rest';
import { ConfigService } from '../service/ConfigService';



export const rawBodySaver = function(req: any, res: any, buf: Buffer, encoding: string) {
    if (buf && buf.length) {
      req.rawBody = buf;
    }
};

export function checkSignature(req: express.Request, resp: express.Response, buff: Buffer, key: crypto.KeyObject)  {
       const signature = req.header("X-Body-Signature");
       if (signature === undefined || signature === null) {
           throw new Errors.ForbiddenError("X-Body-Signature header is absent");
       }
       const v: any = crypto.verify("sha3-256",buff,key,Buffer.from(signature,'base64'));
       if (!v) {
        throw new Errors.ForbiddenError("Invalid Body Signature");
       }
}


export function signatureChecker(req: express.Request, resp: express.Response, buff: Buffer, encoding: String) {
    const cfg: ConfigService = Container.get(ConfigService);
    const key = cfg.config().zakaPublicKey;
    checkSignature(req,resp,buff,key);
}



