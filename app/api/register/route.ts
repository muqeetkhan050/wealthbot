import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(req:Request){
    const {email,password}=await req.json()

    const existingUser=await prisma.user.findUnique({
        where:{email}
    })

    if(existingUser){
        return new Response(JSON.stringify({message:"User already exists"}),{status:400})
    }
 
    const hashedPassword=await bcrypt.hash(password,10)

    const user=await prisma.user.create({
        data:{
            email,
            password:hashedPassword
        }

    })

    await createSession(user.id)
    return new Response(JSON.stringify({message:"User created successfully"}),{status:201})
}
