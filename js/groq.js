import { SYSTEM_PROMPT } from "./prompt.js";
import { loadKnowledge, getKnowledge } from "./knowledge.js";

export async function askGroq(userMessage) {
    try {

        await loadKnowledge();
        const knowledge = getKnowledge();

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userMessage,
                systemPrompt: SYSTEM_PROMPT,
                knowledge
            })
        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const data = await response.json();

        return data.reply;

    } catch (err) {

        console.error(err);
        return "Terjadi kesalahan saat menghubungi AI.";

    }
}