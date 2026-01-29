"use client"
import Link from "next/link"
import React,{useEffect, useState} from "react"
import { useRouter } from "next/navigation";
import axios from "axios"
import toast from "react-hot-toast";


export default function Forgotpassword(){
    const [msg,setMsg]=useState("");
    const [email,setEmail]=useState("");
    const [buttondisable,setbuttonDisable]=useState(true);

    const router=useRouter()
    const forgotpassword=async()=>{
        try{
            axios.post("/api/users/forgotpassword",{email});
            toast.success("email  sent");
            router.push("/login");
        }catch(error:any){
            toast.error("error in forgotpassword");
        }
    }
    useEffect(()=>{
        if(email.length>0){
            setbuttonDisable(false);
        }
    },[email])
    return (
        <div className="flex flex-col item-center justify-center min-h-screen py-2">
            <h1>Forgot Password</h1>
            <hr />
            <label htmlFor="email">email</label>
            <input type="text" id="email" value={email} className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none,focus:border-gray-600 text-white"
            onChange={(e)=>setEmail(e.target.value)} />
        <button onClick={forgotpassword} disabled={buttondisable} className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">send email</button>
        
        </div>
        
    )

}