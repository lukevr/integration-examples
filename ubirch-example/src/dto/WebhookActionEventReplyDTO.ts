import { WebhookCredentialValuesDTO } from "./WebhookCredentialValuesDTO";


export interface WebhookActionEventReplyDTO {

    serviceDid: string;
    subscriberConnectDid: string;
    actionEventId: string;
    issuedCredentials: WebhookCredentialValuesDTO[];
    revokedCredentials: { credentialId: string, primary: string }[];

}