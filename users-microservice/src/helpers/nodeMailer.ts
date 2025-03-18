import nodemailer from 'nodemailer';
import {google} from 'googleapis';


const CLIENT_ID = "542641844332-ko4n4j31hetdg6dicdhuddcb6clgoktc.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04Uaqt5_8jJeiCgYIARAAGAQSNwF-L9IrIUMtDifNtdRv9l7pP_zLRH-0OJSuUS_097oygIDpUP1oKJkTRrpzFdkTgpX42eMiwOg";


const oAuthClient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuthClient.setCredentials({refresh_token: REFRESH_TOKEN});


export  async function SendMail(toAddressEmail: string, emailSubject: string, emailText: string , htmlText : string) {
    try {
        const accessToken = await oAuthClient.getAccessToken();

        if (!accessToken) {
            new Error('Failed to retrieve access token');
        }

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'manojknarayanan12345@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        } as nodemailer.TransportOptions)

        const mailOptions: nodemailer.SendMailOptions = {
            from: 'manojknarayanan12345@gmail.com',
            to: toAddressEmail,
            subject: emailSubject,
            text: emailText,
            html: htmlText,
        };

        return await  transport.sendMail(mailOptions);

    } catch (error: unknown) {
        return error
    }
}