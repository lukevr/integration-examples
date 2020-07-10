import axios from 'axios';
import * as crypto from 'crypto';
import { Inject, Singleton } from "typescript-ioc";
import { Errors } from 'typescript-rest';
import { v1 as uuidv1 } from 'uuid';
import { WebhookCredentialsIssuedDTO } from '../dto/WebhookCredentialsIssuedDTO';
import { TestWaiterModel } from '../model/TestWaiterModel';
import { DateUtil } from '../util/DateUtil';
import { ConfigService } from "./ConfigService";
import { Hasher } from './Hasher';
import { UbirchConnectService } from './UbirchConnectService';


@Singleton
export class LabService {


    @Inject
    private configService: ConfigService;

    @Inject
    private hasher: Hasher;

    @Inject
    private ubirchConnect: UbirchConnectService;

    

    // in real life we shpuld have something like queue
    public performTest(testId: string): void {
        const awaiter = new Promise((resolve, reject) => setTimeout(resolve, 10*1000));
        awaiter.then(
            () => this.fakeAndSendTestResults(testId) 
        );
    }


    private async fakeAndSendTestResults(testId: string) {
        const config = this.configService.config(); 

        const testWaiter = await TestWaiterModel.findByTestId(testId);
        if (testWaiter === null || testWaiter === undefined) {
            throw new Errors.NotFoundError(`tesId  ${testId} is not found`);
        }

        // bind name to result.
        const result = {
          "First name" : testWaiter.firstName,
          "Last name" : testWaiter.lastName,
          "Date of birth": "",
          "Test type" : "fake: "+ testId+":"+uuidv1(),
          "Test result" : "1",
          "Valid till" : "" + DateUtil.plusDays(new Date(), 30).toString,
          "Risk level" : "low"      
        };

        const fields = Object.entries(result).map(e => { 
            return {
               name: e[0], 
               value: e[1]
            };
        });

        const hash = this.hasher.makeHash(fields);

        const anchored = await this.ubirchConnect.anchorHash(hash);
        if (!anchored.ok) {
            console.log("Can't anchore result: "+anchored.errorMessage);
            throw new Error("Cab't anchor hash:"+anchored.errorMessage);
        }

        //  or it shuld be  a testlab

        const body: WebhookCredentialsIssuedDTO  = { 
            serviceDid: config.testServiceDid,
            subscriberConnectDid: testWaiter.did,
            credentials: [{
               credentialId: config.testIdCredentialId,
               schemaId: config.testIdSchemaId,
               fields: fields,
               utcIssuedAt: DateUtil.utcNow(),
               revoked: false
            }],
            when: DateUtil.utcNow()
        };

        const binaryBody = Buffer.from(JSON.stringify(body),"utf-8");
        const signature = crypto.sign('sha3-256', binaryBody, config.myPrivateKey);

        let isOk: boolean = false;
        try {
            const rq = await axios.post(
                `${config.zakaContainerUrl}/service/${config.testServiceDid}/webhook-accept/credentials-issued`,
                binaryBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Body-Signature': signature
                    }
                }
            );
            isOk = (rq.status >= 200 && rq.status < 300 );
            if (!isOk) {
               console.log("error sending data");
               console.log("received "+rq.statusText);
               console.log("data: "+JSON.stringify(rq.data));   
            }
        }catch(ex){
            console.log("expception during call to zaka", ex);
            throw new Errors.InternalServerError("Exception during call to zaka :"+ex);
        }
    
        // TODO: uncomment me after end of testing
        // await testWaiter.remove();

    }

}
