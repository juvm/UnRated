//Sentiment Analysis packages
import { TextAnalyticsClient } from "@azure/ai-text-analytics"

//Azure Language detection packages
import { TextAnalysisClient } from "@azure/ai-language-text"
import { AzureKeyCredential } from "@azure/ai-text-analytics"

//Azure Translator packages
import axios from 'axios'
const axios_fun = axios.default
import { v4 as uuidv4 } from 'uuid'

// Load the .env file if it exists
import dotenv from "dotenv"

dotenv.config();

// You will need to set these environment variables
const endpoint = "https://my-language-resource2.cognitiveservices.azure.com/"
const apiKey = "a432d82ca3f342d9a84d49b62b089609"

const endp = "https://api.cognitive.microsofttranslator.com/"
const trans_key = "643ef9499efc41f79079c8b885f3caf4"

let lang;

export default class AzureHelper {
    static async sentimentMining(review) {
        try {
            console.log("=== Analyze Sentiment and Calculate Overall Rating ===");
            
            const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));
            const [result] = await client.analyzeSentiment(review);
            let rating;
            
            if (!result.error) {
                console.log(`\tDocument text: ${review}`);
                console.log(`\tOverall Sentiment: ${result.sentiment}`);
                console.log("\tSentiment confidence scores: ", result.confidenceScores);
                console.log("\tSentences");
                for (const { sentiment, confidenceScores, text } of result.sentences) {
                    console.log(`\t- Sentence text: ${text}`);
                    console.log(`\t  Sentence sentiment: ${sentiment}`);
                    console.log("\t  Confidence scores:", result.confidenceScores);
                }
                console.log(result.sentiment);

                if (result.confidenceScores.negative > result.confidenceScores.positive) {
                    rating = Math.max (1, ((1 + (result.confidenceScores.positive - result.confidenceScores.negative)) * 100)/10);
                }
                //rating = JSON.stringify(result.confidenceScores).toString();
                else if (result.confidenceScores.negative < result.confidenceScores.positive) {
                    rating = Math.min (10, ((result.confidenceScores.positive - result.confidenceScores.negative) * 100)/10);
                }
                else {
                    rating = 5;
                }
            } else {
                console.error(`  Error: ${result.error}`);
            }
            return rating;
        }
        catch(err) {
            console.error("The sample encountered an error:", err);
        }
    }
        
    //-----------------------------------------------------------------------------------------------------------------------------------------

    //Detects language of incoming reviews
    static async languageDetection(review) {
        try {
            console.log("=== Language detection of Review ===");
        
            const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
            const [result] = await client.analyze("LanguageDetection", review);
            let lang;
            
            if (!result.error) {
                lang = result.primaryLanguage.iso6391Name;
                console.log(
                    `ID ${result.id} - Primary language: ${result.primaryLanguage.name} (iso6391 name: ${result.primaryLanguage.iso6391Name})`
                );
            }
            return lang;
        }
        catch(err) {
            console.error("The sample encountered an error:", err);
        }
    }
    
    //-----------------------------------------------------------------------------------------------------------------------------------------

    //Translate the reviews if not written in the English Language upon posting and updating to save in the db
    static async translatesReviews(language, review) {
        try {
            console.log("=== Translator Service ===");
            const translated = await axios_fun({
                    baseURL: endp,
                    url: '/translate',
                    method: 'post',
                    headers: {
                        'Ocp-Apim-Subscription-Key': trans_key,
                        // location required if you're using a multi-service or regional (not global) resource.
                        'Ocp-Apim-Subscription-Region': 'centralIndia',
                        'Content-type': 'application/json',
                        'X-ClientTraceId': uuidv4().toString()
                    },
                    params: {
                        'api-version': '3.0',
                        'from': `${language}`,
                        'to': ['en']
                    },
                    data: [{
                        'text': `${review}`
                    }],
                    responseType: 'json'
            });

            console.log(JSON.stringify(translated.data, null, 4));

            const translatedText = translated.data[0].translations[0].text;
            return translatedText;
        }
        catch(err) {
            console.error("The sample encountered an error:", err);
        }
    }
}
