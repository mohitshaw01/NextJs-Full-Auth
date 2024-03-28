import dbconnect from '@/dbconfig/dbconfig';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user.models'

dbconnect()
.then(() => console.log("Connected to MongoDB"))
.catch((error) =>{
    console.log(error);
    process.exit();
})

export async function POST(request: NextRequest) {
    try{
        const reqBody = await request.json();
        const {token} = reqBody;
        console.log(token);

        const user = await User.findOne({verifyToken: token,verifyTokenExpiry: {$gt: Date.now()}});

        if(!user){
            return NextResponse.json({message: "Invalid token"}, {status: 400});
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = '';
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({message: "Email verified successfully"}, {status: 200});
    }
    catch(error : any){
        return NextResponse.json({error : error.message},{status : 501});
    }
}