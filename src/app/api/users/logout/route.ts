import { NextResponse } from "next/server";


export async function GET(){
    try {
        // logout user
        const response =  NextResponse.json({
            status: 200,
            body: JSON.stringify({message: "Logout successful"})
        })
    
        // clear cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        })
        return response;
    } catch (error) {
        console.log(error + "error in logout route"); 
    }
}