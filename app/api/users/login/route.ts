import {connect } from "../../../db/dbconfig";
import User from "@/models/userModel.js";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
connect();

export async function POST(request:NextRequest) {
    try {
        const reqBody=await request.json();
        // we can not use get because get have no bodies so use post method
        // never use get for login and signup keep in mind
        // i can say get for reading for other works use post
        const {email,password}=reqBody;
        const user= await User.findOne({email});
        if(!user){
            return NextResponse.json({error:"User does not exits"},{status:400})
        }
        const validPassword=await bcryptjs.compare(password,user.password);
        if(!validPassword){
            return NextResponse.json({error:"Invalid password"},{status:400});}
            const tokenData={id:user._id,username:user.username,email:user.email}
            const token=await  jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"});
            const response=NextResponse.json({message:"login successful"},{status:200})
            response.cookies.set("token",token,{httpOnly:true})
        return response;

    } catch (error:any) {
        console.log("error");
    return NextResponse.json({error:error.message},{status:500});
    }
    
}