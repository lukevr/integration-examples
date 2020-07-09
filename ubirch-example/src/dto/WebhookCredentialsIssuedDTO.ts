import { WebhookCredentialValuesDTO } from "./WebhookCredentialValuesDTO";

export interface WebhookCredentialsIssuedDTO {

    serviceDid: string;
    subscriberConnectDid: string;
    credentials: WebhookCredentialValuesDTO[];
    when: number;


}