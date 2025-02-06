import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router()
const prisma = new PrismaClient();





//create a tweet
router.post("/", async(req, res)=>{
    const {content, image} = req.body;

    const user = req.user
    
    try{
        const result = await prisma.tweet.create({
            
            data:{
                content, 
                image,
                userId : user.id
            }
        })
        res.json(result)

    }catch(error){
        res.status(400).json({error: "error creating the tweet"})
    } 
})


//list all tweet 
router.get("/", async(req, res)=>{
    try{
        const allTweets = await prisma.tweet.findMany({ include: {user:{select:{id:true, username:true, name:true, image:true}} }})

        res.json(allTweets)

    }catch(error){
        res.status(400).json("error listing the tweets")
    }
})


// get tweet 
router.get("/:id", async (req, res)=>{
    const {id} = req.params;
    try{

       const tweet = await prisma.tweet.findUnique({ 
        where: {id : Number(id) },
        include: {user:true}
        })
        res.json(tweet)

    }catch(error){
        res.status(400).json("error returning the tweet: ", error)
    }
})



//update tweet 
router.put("/:id", async(req, res)=>{
    const {id} = req.params

    const {content, image} = req.body

    try{

        const response = await prisma.tweet.update({
            where: {id : Number(id)},
            data: {content, image}
        })

        res.json(response)

    }catch(error){
        res.status(400).json("error updating the tweet")
    }
})



//delete tweet 
router.delete("/:id", async(req, res)=>{
    const {id} = req.params

    try{

        await prisma.tweet.delete({where: {id: Number(id)}})
        res.sendStatus(200)

    }catch(error){
        res.status(400).json("error deleting the tweet")
    }

})




export default router 