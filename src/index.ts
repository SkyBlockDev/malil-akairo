import Client from './client/Client';
import { owners } from './config';

const client = new Client({ owners: owners, token: process.env.token });

client
    .on('error', err => console.log(`[ CLIENT ERROR ] ${err.message}`, err.stack))
    .on('warn', warn => console.log(`[ CLIENT WARN ] ${warn}`));
client.goo();