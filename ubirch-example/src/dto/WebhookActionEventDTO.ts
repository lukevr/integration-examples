import { NameValueDTO } from "./NameValueDTO";
import { WebhookCredentialValuesDTO } from "./WebhookCredentialValuesDTO";


export interface WebhookActionEventDTO {

    publicServiceDid: string;
    subscriberConnectDid: string;

    actionId: string;
    actionInstanceId: string;
    actionEventId: string;

    actionParams: NameValueDTO[];
    receivedCredentials: WebhookCredentialValuesDTO[];

}