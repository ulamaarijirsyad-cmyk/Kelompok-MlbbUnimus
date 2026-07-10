export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const {
            userMessage,
            systemPrompt,
            knowledge
        } = req.body;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
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
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json({
            reply: data.choices[0].message.content
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message
        });

    }

}