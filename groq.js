import { CONFIG } from "./config.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { loadKnowledge, getKnowledge } from "./knowledge.js";

export async function askGroq(userMessage) {

    try {

        // Load semua knowledge
        await loadKnowledge();

        // Ambil knowledge
        const knowledge = getKnowledge();

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CONFIG.GROQ_API_KEY}`
            },

            body: JSON.stringify({

                model: CONFIG.MODEL,

                messages: [

                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },

                    {
                        role: "system",
                        content: `Knowledge MLBB:\n${JSON.stringify(knowledge)}`
                    },

                    {
                        role: "user",
                        content: userMessage
                    }

                ],

                temperature: 0.2,

                max_tokens: 800

            })

        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        return data.choices[0].message.content;

    }

    catch (err) {

        console.error(err);

        return "Terjadi kesalahan saat menghubungi AI.";

    }

}