import {connect } from "../../../db/dbconfig";
import User from "@/models/userModel.js";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { requestToBodyStream } from "next/dist/server/body-streams";
import jwt from "jsonwebtoken";
connect();

export async function POST(request:NextRequest) {
    try {
        const reqBody=await request.json();
        const {email,password}=reqBody;
        const user= await User.findOne({email});
        if(!user){
            return NextResponse.json({error:"User does not exits"},{status:400})
        }
        const validPassword=await bcryptjs.compare(password,user.password);
        if(!validPassword){
            return NextResponse.json({error:"Invalid password"},{status:400});}
            const tokenData={id:user._id,username:user.username,email:user.email}
            const token= jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"});
            const response=NextResponse.json({message:"login successful"},{status:200})
            response.cookies.set("token",token,{httpOnly:true})
        return response;

    } catch (error:any) {
        console.log("error");
    return NextResponse.json({error:error.message},{status:500});
    }
    
}