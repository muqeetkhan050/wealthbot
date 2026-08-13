import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
import {decrypt} from "@/lib/session";


export async function DELETE(request:Request,{params}:{params:{id:string}}){
    const cookieStore = await cookies()
    const session=await decrypt(cookieStore.get('session')?.value)

    if(!session){
        return Response.json({error:"Unauthorized"},{status:401})
    }

    const {id}=await params
    const holding=await prisma.holding.findUnique({
        where:{
            id:Number(id)
        }

    })
    if (!holding || holding.authorId !== session.userId) {
        await prisma.holding.delete({
            where: {
                id: Number(id),
            },
        });
    }
