import axios from 'axios';
import { Inject } from 'typescript-ioc';
import { BodyOptions, BodyType,  ParserType, Path,  POST } from "typescript-rest";
import { NameValueDTO } from '../dto/NameValueDTO';
import { WebhookVerificationReplyDTO } from '../dto/WebhookVerificationReplyDTO';
import { WebhookVerificationRequestDTO } from '../dto/WebhookVerificationRequestDTO';
import { ConfigService } from '../service/ConfigService';
import { Hasher } from '../service/Hasher';
import { signatureChecker } from '../util/ExpressUtil';



@Path('verify-zaka-credentials')
export class UbirchHashVerify {

    @Inject 
    private configService: ConfigService;

    @Inject
    private hasher: Hasher;
  

    @Path("check-hash")
    @POST
    @BodyType(ParserType.json)
    @BodyOptions({ verify: signatureChecker })
    public async checkHash(data: WebhookVerificationRequestDTO):  Promise<WebhookVerificationReplyDTO> {
        console.log("create-applicant: data="+JSON.stringify(data));

        const config = this.configService.config();

        const hash: string = this.hasher.makeHash(data.fields);

        if (hash === undefined) {
          return {
            ok: false,
            errrorMessage: "urbirchHash not found in fields"
          };
        }

        let isOk: boolean;
        let fields: Map<string,string> = new Map();
        const options: any = { };
        if (config.ubirchToken !== undefined ) {
          options.headers = {
            Authorization: config.ubirchToken
          };
        }
        try {
          const rq = await axios.post(
             `${config.ubirchBaseUrl}/upp/verify/anchor`,
             hash,
             options
          );
          isOk = (rq.status === 200);
          console.log("received "+rq.statusText);
          console.log("data: "+JSON.stringify(rq.data));
          fields = new Map(Object.entries(rq.data));
        }catch(ex){
          console.log("expception during call to urbich", ex);
          return {
            ok: false,
            errrorMessage: JSON.stringify(ex)
          };
        }

        const extraInfo: Array<NameValueDTO> = Array.from(fields.entries()).map(
          ([name,value]) => ({ name, value: JSON.stringify(value) })
         );
       
        const retval: WebhookVerificationReplyDTO = {
           ok: isOk,
           extra: {
             info: extraInfo,
             format: "json"
           }
        };
      
        return retval;

    }

   

}