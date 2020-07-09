import { NameValueDTO } from "./NameValueDTO";



export interface WebhookVerificationRequestDTO {    
    serviceDid: string;
    subscriberDid: string;
    credentialId: string;
    schemaId: string;
    fields: Array<NameValueDTO>;
    
}
