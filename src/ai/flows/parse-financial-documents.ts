'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing financial documents.
 *
 * - parseFinancialDocument - A function that takes a financial document as input and returns the extracted information.
 * - ParseFinancialDocumentInput - The input type for the parseFinancialDocument function.
 * - ParseFinancialDocumentOutput - The return type for the parseFinancialDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseFinancialDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A financial document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseFinancialDocumentInput = z.infer<typeof ParseFinancialDocumentInputSchema>;

const ParseFinancialDocumentOutputSchema = z.object({
  extractedInformation: z
    .string()
    .describe('The extracted information from the financial document.'),
});
export type ParseFinancialDocumentOutput = z.infer<typeof ParseFinancialDocumentOutputSchema>;

export async function parseFinancialDocument(
  input: ParseFinancialDocumentInput
): Promise<ParseFinancialDocumentOutput> {
  return parseFinancialDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseFinancialDocumentPrompt',
  input: {schema: ParseFinancialDocumentInputSchema},
  output: {schema: ParseFinancialDocumentOutputSchema},
  prompt: `You are an expert financial document parser.

You will extract relevant information from the financial document provided.

Document: {{media url=documentDataUri}}`,
});

const parseFinancialDocumentFlow = ai.defineFlow(
  {
    name: 'parseFinancialDocumentFlow',
    inputSchema: ParseFinancialDocumentInputSchema,
    outputSchema: ParseFinancialDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
