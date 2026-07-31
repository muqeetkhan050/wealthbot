import {prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

export async function POST(req:Request){
    const {email,password}=await req.json()

    const existingUser=await prisma.user.findUnique({
        where:{email}


    })

    if(!existingUser){
        return new Response(JSON.stringify({message:"User does not exist"}),{status:400})
    }

    const isPasswordValid=await bcrypt.compare(password,existingUser.password)

    if(!isPasswordValid){
        return new Response(JSON.stringify({message:"Invalid password"}),{status:400})
    }

    return Response.json({ id: existingUser.id, email: existingUser.email })

}