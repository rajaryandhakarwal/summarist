import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({

    plugins: [
        googleAI({
            // The model to use for generate requests.
            model: 'gemini-1.5-flash-latest',
        }),

    ],
});
