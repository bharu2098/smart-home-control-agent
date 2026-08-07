import { apiRequest } from "./api";

export async function sendMessage(message) {

    return await apiRequest(

        "/chat",

        "POST",

        {

            message,

        }

    );

}