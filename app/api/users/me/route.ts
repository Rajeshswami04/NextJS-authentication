import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/app/db/dbconfig";
import User from "@/models/userModel";

connect();



export async function GET(request:NextRequest){
   try {
    const userr=await getDataFromToken(request);
    if (typeof userr === 'string') {
      return NextResponse.json({error:"Invalid token"},{status:400})
    }
    const userid=userr.id;
   const user=await User.findOne({_id:userid}).select("-password");
   return NextResponse.json({message:"user found",data:user});
   } catch (error:any) {
    return NextResponse.json({error:error.message},{status:400})
    
   } 
    
}