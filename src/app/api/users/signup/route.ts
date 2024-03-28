// every routes need to know wherether it is connected to the database or not
// so we need to pass the database connection to the routes

import dbconnect from '@/dbconfig/dbconfig';
import User from '@/models/user.models';
import { NextRequest,NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import {sendEmail} from '@/utils/mailer';

dbconnect()
.then(()=>console.log("Connected to database"))
.catch((error)=>console.log(error));

export async function POST(request: NextRequest) {
    try{
        const reqbody = await request.json();
        const {username, email, password } =  reqbody;
        // validation
        if(!username && !email && !password){
            return NextResponse.json({error: "Please fill all the fields"});
        }
        console.log(reqbody);
        // check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error: "User already exists"},{status: 400});
        }
        // hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newuser = new User({ username,email, password: hashedPassword});
        const savedUser = await newuser.save();
        // send verification email
        const emailType = "verify";
        await sendEmail({email,emailType, userId : savedUser._id});
       
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })

    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Error creating user"});
    }
}

