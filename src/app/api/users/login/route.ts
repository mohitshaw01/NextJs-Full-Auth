import dbconnect from "@/dbconfig/dbconfig";
import User from '@/models/user.models';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

dbconnect()
.then(() => console.log('Database connected'))

export async function POST(req: NextRequest) {
    try {
        const reqbody = await req.json();
        const { email, password } = reqbody;
        console.log(reqbody);
        // check if email exists
        const userdata = await User.findOne({ email });
        if(!userdata){
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        // check if password is correct
        const validPassword = await bcryptjs.compare(password, userdata.password);
        if(!validPassword){
            return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
        }
        // //create token data
        const tokenData = {
            id: userdata._id,
            username: userdata.username,
            email: userdata.email
        } 
        // create and assign a token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });
    
        const response = NextResponse.json({ message : "login succesfull", success: true, token });
        // token is set to cookies
        response.cookies.set('token',token,{
            httpOnly: true,
        });
        console.log(userdata);
        return response;
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}