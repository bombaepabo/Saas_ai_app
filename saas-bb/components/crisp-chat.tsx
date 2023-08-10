"use client";
import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";

export const CrispChat = () =>{
    useEffect(() => {
        Crisp.configure("38feece5-7eec-45f7-a656-3958de83bb16");
    },[]);

    return null;
}