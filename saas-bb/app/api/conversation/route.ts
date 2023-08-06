import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {Configuration,OpenAIApi} from "openai";
import {increaseApiLimit,checkApiLimit} from "@/lib/api-limit"

const configuration = new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export async function POST(
    req:Request
){
    try{
        const {userId} = auth();
        const body = await req.json();
        const {messages} = body ;
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!configuration.apiKey){
            return new NextResponse("OpenAi Api Key not configured",{status:500});
        }
        if(!messages){
            return new NextResponse("Message are required",{status:400});
        }
        const freetrial = await checkApiLimit();
        if(!freetrial){
            return new NextResponse("Free trial has expired.",{status:403});
        }
        const response = await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages
        });
        await increaseApiLimit();
        return NextResponse.json(response.data.choices[0].message);
    }
    catch(error){
        console.log("[CONVERSATION_ERROR]",error);
        return new NextResponse("Internal error",{status:500});
    }
}