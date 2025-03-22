import React, { useState, useEffect } from "react";
import { ProChat } from "@ant-design/pro-chat";
import { OpenAI } from "openai";

// OpenAI API Setup
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const Chatbot = ({ apiResults, formData }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [documentContext, setDocumentContext] = useState("");

    const generateHelloMessage = () => {
        const crop = formData.cropType;
        const hasStressBooster = apiResults.stress_buster_recommended;
        const hasYieldBooster = apiResults.yield_booster_recommended;

        let message = `Hello! I see you're growing ${crop} in ${formData.location.name}. `;

        // Case 1: No recommendations
        if (!hasStressBooster && !hasYieldBooster) {
            return message + "Good news! No products are necessary at this time. Your plants are handling things naturally.";
        }

        // Calculate potential profits based on crop type
        const getProfitDetails = (crop) => {
            const prices = {
                cotton: 70,
                rice: 40,
                wheat: 39
            };

            let yieldBoosterProfit = 0;
            let stressBoosterProfit = 0;

            if (crop.toLowerCase() === 'cotton') {
                yieldBoosterProfit = 450 * prices.cotton; // 450kg * 70R
                stressBoosterProfit = 300 * prices.cotton; // 300kg * 70R
            } else if (crop.toLowerCase() === 'rice') {
                yieldBoosterProfit = 660 * prices.rice; // 660kg * 40R
                stressBoosterProfit = 300 * prices.rice; // 300kg * 40R
            } else if (crop.toLowerCase() === 'wheat') {
                yieldBoosterProfit = 300 * prices.wheat; // 300kg * 39R
                stressBoosterProfit = 300 * prices.wheat; // 300kg * 39R
            }

            return { yieldBoosterProfit, stressBoosterProfit };
        };

        const { yieldBoosterProfit, stressBoosterProfit } = getProfitDetails(crop);

        // Case 2: Only Stress Booster
        if (hasStressBooster && !hasYieldBooster) {
            return message + `I notice your crops might face some challenges. I recommend using our Stress Booster product to help them stay strong. With an investment of 4,500 Rupees per hectare, you could see an additional profit of ${stressBoosterProfit} Rupees per hectare!`;
        }

        // Case 3: Only Yield Booster
        if (!hasStressBooster && hasYieldBooster) {
            return message + `To help your ${crop} reach its full potential, I recommend our Yield Booster product. With just 2,000 Rupees per hectare investment, you could gain an additional profit of ${yieldBoosterProfit} Rupees per hectare!`;
        }

        // Case 4: Both Boosters
        if (hasStressBooster && hasYieldBooster) {
            const totalProfit = yieldBoosterProfit + stressBoosterProfit;
            return message + `I have two recommendations that could work together perfectly for your ${crop}. By combining our Stress Booster (4,500 Rs/ha) and Yield Booster (2,000 Rs/ha), you could potentially increase your profits by ${totalProfit} Rupees per hectare! Would you like to know more about either product?`;
        }
    };

    const promptPrefix = `You are a highly experienced agricultural expert and a persuasive, knowledgeable salesman specializing in agricultural products. Your client is an Indian farmer based in ${formData.location.name}, currently growing ${formData.cropType}. The crop cycle spans from ${formData.startTimestamp} to ${formData.endTimestamp}.
                Based on real agronomic and environmental data, only the following products are relevant and should be recommended:

                ${apiResults.stress_buster_recommended ? 'STRESS BUSTER' : ''}
                ${apiResults.yield_booster_recommended ? 'YIELD BOOSTER' : ''}
                Any other product is irrelevant and should not be mentioned.

                You have access to detailed monthly risk analysis values, which help guide your recommendations:

                Daytime heat stress risk (0 = low, 1 = high): ${JSON.stringify(apiResults.risk_factors.S_heat)}
                Nighttime heat stress risk: ${JSON.stringify(apiResults.risk_factors.S_night)}
                Frost stress: ${JSON.stringify(apiResults.risk_factors.S_frost)}
                Risk levels:

                0.0 – 0.4 → No real risk
                0.4 – 0.7 → Moderate risk
                0.7 – 1.0 → High risk
                You are also given overall crop-season risks:

                Drought risk: ${apiResults.risk_factors.drought_risk}
                Yield risk: ${apiResults.risk_factors.yield_risk}
                Your task: Write a personalized, expert-level product recommendation for this farmer. Explain clearly why the recommended product(s) are useful, how they align with the identified risks, and give actionable advice. Use a friendly but professional tone, similar to how a trusted local agronomist would speak.`

    // Load .txt file and format the content
    useEffect(() => {
        fetch("/context.txt")
            .then((response) => response.text())
            .then((text) => {
                const formattedText = promptPrefix + `\n\n${text}`;
                setDocumentContext(formattedText);
            })
            .catch((error) => console.error("Error loading document:", error));
    }, [promptPrefix]);

    return (
        <ProChat
            helloMessage={
                generateHelloMessage()
            }
            locale="en-US"
            userMeta={{
                avatar: "👨‍🌾",
                title: "Farmer",
            }}
            assistantMeta={{
                avatar: "🌻",
                title: "Farm Assistant",
            }}
            request={async (messages) => {
                try {
                    // System-Prompt with formatted document content
                    const systemPrompt = {
                        role: "system",
                        content: documentContext,
                    };

                    // Keep last 5 messages in history
                    const updatedHistory = [...chatHistory, ...messages].slice(-10);
                    setChatHistory(updatedHistory);

                    // OpenAI Request with System Prompt + History
                    const response = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [systemPrompt, ...updatedHistory.map((msg) => ({
                            role: msg.role,
                            content: msg.content,
                        }))],
                    });

                    return response.choices[0].message.content;
                } catch (error) {
                    console.error("Error fetching response from OpenAI:", error);
                    return "Sorry, something went wrong. Try again!";
                }
            }}
        />
    );
};

export default Chatbot;
