'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized financial advice to parents.
 *
 * The flow takes financial data as input and returns personalized financial planning advice using an AI prompt.
 *
 * @remarks
 * - It exports `getPersonalizedFinancialAdvice` function to trigger the flow.
 * - It defines `PersonalizedFinancialAdviceInput` and `PersonalizedFinancialAdviceOutput` types for the flow's input and output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const PersonalizedFinancialAdviceInputSchema = z.object({
  income: z.number().describe('Annual income of the parent.'),
  expenses: z.number().describe('Total annual expenses of the parent.'),
  savings: z.number().describe('Total savings of the parent.'),
  debt: z.number().describe('Total debt of the parent.'),
  tuitionFees: z.number().describe('Annual tuition fees for the child\'s education.'),
  otherEducationExpenses: z.number().describe('Other annual education-related expenses.'),
});

export type PersonalizedFinancialAdviceInput = z.infer<typeof PersonalizedFinancialAdviceInputSchema>;

const PersonalizedFinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial planning advice for the parent.'),
});

export type PersonalizedFinancialAdviceOutput = z.infer<typeof PersonalizedFinancialAdviceOutputSchema>;

export async function getPersonalizedFinancialAdvice(input: PersonalizedFinancialAdviceInput): Promise<PersonalizedFinancialAdviceOutput> {
  return personalizedFinancialAdviceFlow(input);
}

const personalizedFinancialAdvicePrompt = ai.definePrompt({
  name: 'personalizedFinancialAdvicePrompt',
  input: {schema: PersonalizedFinancialAdviceInputSchema},
  output: {schema: PersonalizedFinancialAdviceOutputSchema},
  prompt: `You are a financial advisor providing personalized advice to parents about their child's education expenses.

  Based on the following financial data, provide personalized financial planning advice:

  Income: {{{income}}}
  Expenses: {{{expenses}}}
  Savings: {{{savings}}}
  Debt: {{{debt}}}
  Tuition Fees: {{{tuitionFees}}}
  Other Education Expenses: {{{otherEducationExpenses}}}

  Provide clear, actionable advice to help the parent make informed decisions about managing their child's education expenses.
  Focus on strategies for saving, budgeting, and managing debt to ensure the child's educational goals are met without causing undue financial stress.
  Also include advice about the possibility of applying for financial aid.
  `,
});

const personalizedFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedFinancialAdviceFlow',
    inputSchema: PersonalizedFinancialAdviceInputSchema,
    outputSchema: PersonalizedFinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await personalizedFinancialAdvicePrompt(input);
    return output!;
  }
);
