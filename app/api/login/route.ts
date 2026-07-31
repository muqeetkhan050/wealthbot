import {prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

import bcrypt from "bcryptjs";

export async function POST(req:Request){
    const {email,password}=await req.json()

    const existingUser=await prisma.user.findUnique({
        where:{email}


    })

    if(!existingUser){
        return new Response(JSON.stringify({message:"Invalid email or password"}),{status:401})
    }

    const isPasswordValid=await bcrypt.compare(password,existingUser.password)

    if(!isPasswordValid){
        return new Response(JSON.stringify({message:"Invalid email or password"}),{status:401})
    }
    await createSession(existingUser.id)
    return Response.json({ id: existingUser.id, email: existingUser.email })

}