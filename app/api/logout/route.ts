import {deleteSession} from "@/lib/session";

export async function POST(req:Request){
    await deleteSession()
    return Response.json({ message: 'Logged out successfully' })   

}
