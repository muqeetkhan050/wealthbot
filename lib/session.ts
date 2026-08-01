import 'server-only';
import {cookies } from 'next/headers';
import {SignJWT,jwtVerify} from 'jose';

const secretkey=process.env.SESSION_SECRET!;
const encodedkey=new TextEncoder().encode(secretkey);



export async function encrypt(payload: { userId: number }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedkey)
}

export async function decrypt(token: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(token, encodedkey, { algorithms: ['HS256'] })
        return payload as { userId: number }
    } catch {
        return null
    }
}


export async function createSession(userId: number) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}



export async function deleteSession(){
    const cookiesStore=await cookies()
    cookiesStore.delete('session')
}