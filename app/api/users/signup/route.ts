import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel"; 
import bcryptjs from "bcryptjs";
import { connect } from "@/app/db/dbconfig"; 
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" }, 
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json(
                { message: "User already exists" }, 
                { status: 400 }
            );
        }
        const hashedpassword = await bcryptjs.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedpassword,
        });

        const savedUser = await newUser.save();
        await sendEmail({email,emailType:"VERIFY",userId:savedUser._id});
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user: { id: savedUser._id, username: savedUser.username }
        }, { status: 201 }); 

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message }, 
            { status: 500 }
        );
    }
}