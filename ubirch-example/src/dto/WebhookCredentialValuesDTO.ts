import { NameValueDTO } from './NameValueDTO';


export interface WebhookCredentialValuesDTO {

    credentialId: string;
    schemaId: string;
    fields: NameValueDTO[];
    utcIssuedAt: number; // utc
    revoked: boolean; //
    utcRevokedAt?: number; //

}