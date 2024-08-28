import path from "path";
import { env } from "../../env";
import { MeasurementProvider } from "../measurement-provider";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export class GeminiMeasurementProvider implements MeasurementProvider {
    async getMeasure(image: string, measureType: string) {
        if (env.NODE_ENV == "test") {
            return 0;
        }

        const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);
        const mimeType = `image/${image.split(".")[1]}`;

        // file upload
        const uploadResponse = await fileManager.uploadFile(`${path.dirname("")}/src/images/${image}`, {
            mimeType,
            displayName: `measurement of ${measureType.toLocaleLowerCase()} record`
        });

        // verify file upload
        const getFileResponse = await fileManager.getFile(uploadResponse.file.name);

        // configurating my api key
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        // getting results of AI
        const results = await model.generateContent([
            {
                fileData: {
                    mimeType: getFileResponse.mimeType,
                    fileUri: getFileResponse.uri
                },
            },
            {
                text: `return the measurement of ${measureType.toLocaleLowerCase()} consumption only the number`
            }
        ]);

        return Number(results.response.text());
    }
}