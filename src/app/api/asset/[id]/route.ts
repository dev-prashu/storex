import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{id:string}}){
    const session=await auth();
    if(!session){
        return NextResponse.json({message:"Not Authorized"},{status:401});
    }
    try{
        const {id}=await params;
        

    }catch(e){
        console.log(e);
        return NextResponse.json({error:"INTERNAL SERVER ERROR"},{status:500});
    }
}