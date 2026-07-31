'use client';
import {useState} from "react";

export default function Login(){


    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")


    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault()
        const res=await fetch('/api/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})
        })  
}

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value  )}
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button type="submit">Login</button>    
            </form>
        </div>
    )
}