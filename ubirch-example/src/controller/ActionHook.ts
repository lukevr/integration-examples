import { Inject } from 'typescript-ioc';
import { BodyOptions, BodyType, Errors, ParserType, Path,  POST  } from "typescript-rest";
import { v1 as uuidv1 } from 'uuid';
import { Constants } from '../config/Constants';
import { WebhookActionEventDTO } from "../dto/WebhookActionEventDTO";
import { WebhookActionEventReplyDTO } from "../dto/WebhookActionEventReplyDTO";
import { TestWaiterModel } from '../model/TestWaiterModel';
import { ConfigService } from '../service/ConfigService';
import { LabService } from '../service/LabService';
import { DateUtil } from '../util/DateUtil';
import { signatureChecker } from '../util/ExpressUtil';


@Path('receive-zaka-action')
export class ActionHook {

    @Inject 
    private configService: ConfigService;

    @Inject
    private labService: LabService;
  

    @Path("onboard")
    @POST
    @BodyType(ParserType.json)
    @BodyOptions({ verify: signatureChecker })
    public async onboard(data: WebhookActionEventDTO):  Promise<WebhookActionEventReplyDTO> {

        const config = this.configService.config();

        const credentialsMap = new Map<string,string>();
        for (const cred of data.receivedCredentials) {
            if (cred.credentialId === config.userProfileCredentialId) {
                for(const field of cred.fields) {
                    credentialsMap.set(field.name,field.value);
                }
            }

        }

        const firstName = credentialsMap.get("firstName");
        if (firstName === undefined || firstName === null) {
            this.badRequest("firstName is not set in request");
        }
        const lastName = credentialsMap.get("lastName");
        if (lastName === undefined || lastName === null) {
            this.badRequest("lastName is not set in request");
        }
        const phoneNumber = credentialsMap.get("phone");
        if (phoneNumber === undefined || phoneNumber === null) {
            this.badRequest("phone is not set in request");
        }

        const testId = uuidv1();
    
        let waiter = await TestWaiterModel.findByTestId(testId);
        if (waiter === null || waiter === undefined) {
            waiter = await TestWaiterModel.createRecord({
                testId,
                did: data.subscriberConnectDid,
                firstName,
                lastName,
                phoneNumber,
                expirationDate: DateUtil.plusDays(new Date(), 30)
            });
        }
        
        const retval : WebhookActionEventReplyDTO = {
           serviceDid: data.publicServiceDid,
           subscriberConnectDid: data.subscriberConnectDid,
           actionEventId: data.actionEventId,
           issuedCredentials: [{
               credentialId: config.testIdCredentialId,
               schemaId: config.testIdSchemaId,
               fields: [
                   { name: Constants.TEST_ID, value: testId },
                   { name: Constants.VALID_TILL, 
                     value: DateUtil.plusDays(new Date(),30).toUTCString()  }
               ],
               utcIssuedAt: DateUtil.utcNow(),
               revoked: false
           }],
           revokedCredentials: []
       };

       return retval;

    }


    @Path("lab-checkin")
    @POST
    @BodyType(ParserType.json)
    // @BodyOptions({ verify: singatureChecker })
    public async labCheckin(data: WebhookActionEventDTO): Promise<WebhookActionEventReplyDTO> {
        
        const config = this.configService.config();
        
        const credentialsMap = new Map<string,string>();
        for (const cred of data.receivedCredentials) {
            if ( cred.credentialId === config.testIdCredentialId ) {
                for(const field of cred.fields) {
                    credentialsMap.set(field.name,field.value);
                }
            }
        }
        
        const testId: string = credentialsMap.get(Constants.TEST_ID);

        this.labService.performTest(testId);
        
        // TODO: do something with this. 
        
        const retval : WebhookActionEventReplyDTO = {
            serviceDid: data.publicServiceDid,
            subscriberConnectDid: data.subscriberConnectDid,
            actionEventId: data.actionEventId,
            issuedCredentials: [],
            revokedCredentials: []
        };
 
        return retval;
 
    }


    private badRequest(msg: string) {
         console.log("BadRequest: "+msg);
         throw new Errors.BadRequestError(msg);
    }

}
