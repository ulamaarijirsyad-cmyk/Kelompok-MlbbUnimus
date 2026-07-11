import { askGroq } from "./groq.js";

export async function askAI(message){

    return await askGroq(message);

}