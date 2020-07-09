
import {ApiServer} from './api-server';

const apiServer = new ApiServer();
apiServer.start().catch(err => {
    console.error(`error starign server: ${err.message}`);
    console.log(err);
    process.exit(-1);
});