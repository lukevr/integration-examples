import { Inject } from 'typescript-ioc';
import { BodyOptions, BodyType,  ParserType, Path,  POST } from "typescript-rest";
import { NameValueDTO } from '../dto/NameValueDTO';
import { WebhookVerificationReplyDTO } from '../dto/WebhookVerificationReplyDTO';
import { WebhookVerificationRequestDTO } from '../dto/WebhookVerificationRequestDTO';
import { Hasher } from '../service/Hasher';
import { UbirchConnectService } from '../service/UbirchConnectService';
import { signatureChecker } from '../util/ExpressUtil';



@Path('verify-zaka-credentials')
export class UbirchHashVerify {

    @Inject
    private hasher: Hasher;

    @Inject
    private ubirchConnectService: UbirchConnectService;
  

    @Path("check-hash")
    @POST
    @BodyType(ParserType.json)
    @BodyOptions({ verify: signatureChecker })
    public async checkHash(data: WebhookVerificationRequestDTO):  Promise<WebhookVerificationReplyDTO> {
        console.log("create-applicant: data="+JSON.stringify(data));

  
        const hash: string = this.hasher.makeHash(data.fields);

        if (hash === undefined) {
          return {
            ok: false,
            errrorMessage: "urbirchHash not found in fields"
          };
        }
      
        const r = await this.ubirchConnectService.checkHash(hash);

        if (!r.ok) {
          return {
            ok: false,
            errrorMessage: r.errorMessage
          };
        }
        const fields = r.extraInfo; 
        const extraInfo: Array<NameValueDTO> = Array.from(fields.entries()).map(
          ([name,value]) => ({ name, value: JSON.stringify(value) })
         );
       
        const retval: WebhookVerificationReplyDTO = {
           ok: true,
           extra: {
             info: extraInfo,
             format: "json"
           }
        };
      
        return retval;

    }

   

}