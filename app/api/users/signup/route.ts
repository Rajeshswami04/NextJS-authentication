import {connect } from "../../../db/dbconfig";
import User from "@/models/userModel.js";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";



export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody;
        if (!username || !email || !password) return NextResponse.json({ status: 400, message: "credentials invalid" })
        const user = await User.findOne({ email });
        if (user) { return NextResponse.json({ status: 400, message: "user already exits" }) }
        const hashedpassword = await bcryptjs.hash(password, 10);
        const nuser = new User({
            username,
            email,
            password: hashedpassword,
        })
         await nuser.save();
        return NextResponse.json({ message: "User created", status: 200, success: true })
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

connect();