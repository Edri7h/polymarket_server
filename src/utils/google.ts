import { OAuth2Client } from "google-auth-library";
import { env } from '../config/env';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const verifyGoogleToken=async(credential:string)=>{
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience:env.GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload();
}