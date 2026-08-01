import {NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {decrypt } from '@/lib/session'

export default async function proxy(request:NextRequest){

    const cookie=request.cookies.get('session')?.value
    const session=await decrypt(cookie)

    const path=request.nextUrl.pathname
    const isProtectedPath=path.startsWith('/dashboard') 
    const isAuthRoute = path === '/login' || path === '/register'

    if(isProtectedPath && !session){
        return NextResponse.redirect(new URL('/login',request.url))
    }

    if (isAuthRoute && session){
        return NextResponse.redirect(new URL('/dashboard',request.url))
    }

    
  
}

export const config={

        matcher:['/dashboard/:path*','/login','/register']
    }