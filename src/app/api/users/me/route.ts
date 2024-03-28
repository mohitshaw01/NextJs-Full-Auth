import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.models";
import dbconnect from "@/dbconfig/dbconfig";
import {getDataFromToken} from "@/utils/getDataFromToken"; // Add this import statement

dbconnect();

export async function GET(request:NextRequest){

    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({id: userId}).select("-password");
        if(!user){
            return NextResponse.json({
                message: "User not found"
            }, {status: 404});
        }
        return NextResponse.json({
            message: "User found",
            data: user
        })
    } catch (error:any) {
        // console.log(error.message)
        return NextResponse.json({error: error.message},{status: 400});
    }

}

