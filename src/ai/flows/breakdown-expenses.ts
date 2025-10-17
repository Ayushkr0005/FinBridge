'use server';

/**
 * @fileOverview This file defines a Genkit flow for breaking down expenses.
 *
 * - breakdownExpenses - A function that takes a list of expenses and returns an AI-generated breakdown.
 * - BreakdownExpensesInput - The input type for the breakdownExpenses function.
 * - BreakdownExpensesOutput - The return type for the breakdownExpenses function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Expense } from '@/lib/types';

const ExpenseSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  date: z.string(),
  category: z.enum(['Tuition', 'Books', 'Supplies', 'Housing', 'Other']),
});

const BreakdownExpensesInputSchema = z.object({
  expenses: z.array(ExpenseSchema).describe('The list of expenses.'),
});
export type BreakdownExpensesInput = z.infer<typeof BreakdownExpensesInputSchema>;

const BreakdownExpensesOutputSchema = z.object({
  breakdown: z
    .string()
    .describe('A concise, parent-friendly breakdown of expenses by category.'),
});
export type BreakdownExpensesOutput = z.infer<typeof BreakdownExpensesOutputSchema>;

export async function breakdownExpenses(
  input: BreakdownExpensesInput
): Promise<BreakdownExpensesOutput> {
  return breakdownExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'breakdownExpensesPrompt',
  input: { schema: BreakdownExpensesInputSchema },
  output: { schema: BreakdownExpensesOutputSchema },
  prompt: `You are a financial assistant for parents.
    Analyze the following list of expenses and provide a clear, simple breakdown by category.
    For each category, state the total amount spent in INR.
    Present it as a simple, easy-to-read summary.

    Expenses:
    {{#each expenses}}
    - Description: {{description}}
      Amount: INR {{amount}}
      Category: {{category}}
    {{/each}}
  `,
});

const breakdownExpensesFlow = ai.defineFlow(
  {
    name: 'breakdownExpensesFlow',
    inputSchema: BreakdownExpensesInputSchema,
    outputSchema: BreakdownExpensesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
