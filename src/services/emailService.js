import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import dotenv from 'dotenv';
dotenv.config();

const ses = new SESClient({ region: "eu-north-1" })

function createSendEmailCommand(toAdress, fromAdress, message){
    return new SendEmailCommand({
        Destination:{
            ToAddresses: [toAdress],
        },
        Source: fromAdress,
        Message:{
            Subject:{
                Charset: "UTF-8",
                Data: "Your one-time password"
            },
            Body:{
                Text:{
                    Charset: "UTF-8",
                    Data: message
                }
            }
        }
    })
}

export async function sendEmailToken(email, token){

    console.log("email and token:" ,email, token);

    const message = `Your one time password: ${token}`
    const command = createSendEmailCommand(email, "tomseidel615@gmail.com", message)

    try{
        return await ses.send(command)
    }catch(error){
        console.log("error sending email:", error)
        return error
    }

}   





