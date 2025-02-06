import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import { sendEmailToken } from "../services/emailService.js"

const EMAIL_TOKEN_EXPIRATION_MINUTE = 10
const AUTH_TOKEN_EXPIRATION_HOURS = 12
const JWT_SECRET = process.env.JWT_SECRET;


const router = Router();
const prisma = new PrismaClient();

function generateEmailToken(){
    return Math.floor(10000000 + Math.random()*90000000).toString()
};

function generateAuthToken(tokenId){
    const jwtPayload = {tokenId}

    return jwt.sign(jwtPayload, JWT_SECRET,{
        algorithm: "HS256",
        noTimestamp : true
    })
}


//login / register function, generate email token and send it to the email
router.post("/login", async(req,res)=>{
const {email} = req.body

const emailToken = generateEmailToken()
const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTE *60 *1000
);

try{
    const createdToken = await prisma.token.create({
        data:{
            type: "EMAIL",
            emailToken,
            expiration,
            user:{
                connectOrCreate:{
                    where:{email},
                    create:{email}
                }
            }
        }
    })
    console.log(createdToken);
    await sendEmailToken("tomseidel615@gmail.com", emailToken)
    res.sendStatus(200);

}catch(error){
    console.log(error)
    res.sendStatus(400).json({errro: "could not create the token "})
}

});

//validate email token
// generate long lived token

router.post("/authenticate", async(req,res)=>{
    const {email, emailToken} = req.body

    const dbEmailToken = await prisma.token.findUnique({
        where:{
            emailToken
        },
        include:{
            user: true
        }
    });

    console.log(dbEmailToken)

    if(!dbEmailToken || !dbEmailToken.valid){
       return res.status(401).json("token not found")
    }
    
    if(dbEmailToken.expiration < new Date()){
       return res.status(401).json("token expired")
    }

    if(email !== dbEmailToken.user?.email){
        return res.sendStatus(401)
    }



    ///generate an api token
    const expiration = new Date(
        new Date().getTime() + AUTH_TOKEN_EXPIRATION_HOURS *60 *60 *1000
    );

    const apiToken = await prisma.token.create({
        data:{
            type: "API",
            expiration,
            user:{
                connect:{
                    email
                }
            }
        }
    });

    await prisma.token.update({
        where:{id: dbEmailToken.id},
        data:{valid:false}
    })


    const authToken = generateAuthToken(apiToken.id)

    res.json({authToken})

    
})

export default router