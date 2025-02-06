import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router()
const prisma = new PrismaClient();



//create a user
router.post("/", async(req, res)=>{
    const {email, name, username} = req.body

    try{
        const result = await prisma.user.create({
            data:{
                email,
                name,
                username,
                bio: "Hello Im new here",
            }
        })
        res.json(result)

    }catch(error){
        res.status(400).json({error: "username should be unique"})
    }


});


//list all user 
router.get("/", async (req, res)=>{
    const allUsers = await prisma.user.findMany({
        select:{id:true, name:true, image:true, bio:true}
    });

    res.json(allUsers)
})


// get user 
router.get("/:id", async (req, res)=>{
    const {id} = req.params
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {tweets : true},
    })
    res.json(user)
})



//update user 
router.put("/:id", async(req, res)=>{
    const {id} = req.params
    const {bio, image, name} = req.body

    try{

     const result = await prisma.user.update({
        where:{id: Number(id)},
        data:{bio, image, name}
     })

     res.json(result)


    }catch(error){
        res.status(400).json({error: "failed to update the user"})
    }

})



//delete user 
router.delete("/:id", async(req, res)=>{
    const {id} = req.params
    try{
        await prisma.user.delete({where:{id: Number(id)}});
        res.sendStatus(200)
    }catch(error){
        console.log(error)
    }

})




export default router 


