"use client"

import axios from "axios"
import Link from "next/link"
import { useEffect,useState } from "react"
import toast from "react-hot-toast"
export default function VerifyEmailPage(){
    const [token,setToken]=useState("");
    const [verified,setVerified]=useState(false);
   
    
    const VerifyEmailPage=async()=>{
        try {
            await axios.post("/api/users/verifyemail",{token})
            setVerified(true);
            toast.success("verified");
        } catch (error:any) {
            toast.error(error.message)
            console.log(error.response.data);            
        }
    }
    useEffect(()=>{
        const urlToken=window.location.search.split("=")[1];
        setToken(urlToken||"");
    },[]);

    useEffect(()=>{
        if( token.length>0){
            VerifyEmailPage();
        }
    },[token])
    return (
       <div
       className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl">Verify Email</h1>
        <h2 className="p-2 bg-amber-500 text-black">{token ?`${token}`:"no token"}</h2>
         {verified&& (
            <div>
                <h2 className="text-2xl">Email verified</h2>
                <Link href={"/login"}>Login</Link>
            </div>
         )}
       </div>  
    )
}