import axios from 'axios';
import { Inject } from "typescript-ioc";
import { UbirchAnchorHashResultDTO } from '../dto/UbirchAnchorHashResultDTO';
import { UbirchCheckHashResultDTO } from "../dto/UbirchCheckHashResutDTO";
import { ConfigService } from "./ConfigService";



export class UbirchConnectService {

   @Inject
   private configService: ConfigService;


   /**
    * Check hash and retrieve additional info.
    * 
    * @param hash 
    */
   public async checkHash(hash: string): Promise<UbirchCheckHashResultDTO> {

    const config = this.configService.config();
    let isOk: boolean;
    let fields: Map<string,string> = new Map();
    const options: any = { };
    if (config.ubirchToken !== undefined ) {
      options.headers = {
        'X-Auth-Token': config.ubirchToken
      };
    }
    let ubirchUrl = `${config.ubirchBaseUrl}/upp/verify/anchor`;
    if (config.ubirchLocalUrl !== undefined) {
        ubirchUrl = `${config.ubirchLocalUrl}/verify/hash`;
    }
    try {
      const rq = await axios.post(
         ubirchUrl,
         hash,
         options
      );
      isOk = (rq.status === 200);
      console.log("received "+rq.statusText);
      console.log("data: "+JSON.stringify(rq.data));
      fields = new Map(Object.entries(rq.data));
    }catch(ex){
      console.log("exception during call to ubirch", ex);
      return {
        ok: false,
        errorMessage: JSON.stringify(ex)
      };
    }

    return {
        ok: isOk,
        extraInfo: fields
    };

   }

   public async anchorHash(hash: string): Promise<UbirchAnchorHashResultDTO> {
        const config = this.configService.config();
        const options = {
            headers: { 
              'X-Auth-Token': config.ubirchToken,
              'Content-Type': 'text/plain'
            }
        };
        let isOk: boolean;
        let upp: string;
        try {
            const rq = await axios.post(
                `${config.ubirchLocalUrl}/${config.ubirchUUID}/hash`,
                hash,
                options
             );
             isOk = (rq.status === 200);
             if (isOk) {
                 upp = rq.data['upp'];
             } else {
                return {
                    ok: false,
                    errorMessage: rq.statusText
                };
             }
             console.log("received "+rq.statusText);
             console.log("data: "+JSON.stringify(rq.data));
        }catch(ex){
            console.log("exception during call to ubirch", ex);
            return {
              ok: false,
              errorMessage: JSON.stringify(ex)
            };      
        }

        return { ok: isOk, upp };
   }
   

}