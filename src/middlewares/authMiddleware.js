import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;



export async function authenticateToken(req,res,next){




    const authHeader = req.headers["authorization"]

    const jwtToken = authHeader.split(" ")[1];

    console.log(jwtToken)
    console.log(JWT_SECRET)

    if(!jwtToken){
        return res.status(401)
    }

    //decode jwt token
    try{ 
        console.log("verify process")
        const payload = await jwt.verify(jwtToken, JWT_SECRET)
        console.log(payload)

        const dbToken = await prisma.token.findUnique({
            where:{id: payload.tokenId},
            include:{user:true}
        });

        if(!dbToken?.valid || dbToken.expiration < new Date()){
            return res.status(400).json({error: "Api token invalid"})
        }

        req.user = dbToken.user;



    }catch(error){
        console.log(error)
        return res.sendStatus(401)
    }

    next()
}