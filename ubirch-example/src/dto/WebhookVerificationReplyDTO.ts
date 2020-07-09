import { NameValueDTO } from "./NameValueDTO";




export interface WebhookVerificationReplyDTO {
    ok: boolean;
    extra?: {
        schemaId?: string;
        info: Array<NameValueDTO>;
        format?: string;
    };
    errrorMessage?: string;
}

