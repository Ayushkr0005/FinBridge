'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing payment reminders.
 *
 * - summarizeReminders - A function that takes a list of reminders and returns an AI-generated summary.
 * - SummarizeRemindersInput - The input type for the summarizeReminders function.
 * - SummarizeRemindersOutput - The return type for the summarizeReminders function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Reminder } from '@/lib/types';

const ReminderSchema = z.object({
  id: z.string(),
  title: z.string(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.enum(['Pending', 'Paid']),
});

const SummarizeRemindersInputSchema = z.object({
  reminders: z.array(ReminderSchema).describe('The list of payment reminders.'),
});
export type SummarizeRemindersInput = z.infer<typeof SummarizeRemindersInputSchema>;

const SummarizeRemindersOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise, friendly summary of the upcoming payment reminders.'),
});
export type SummarizeRemindersOutput = z.infer<typeof SummarizeRemindersOutputSchema>;

export async function summarizeReminders(
  input: SummarizeRemindersInput
): Promise<SummarizeRemindersOutput> {
  return summarizeRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRemindersPrompt',
  input: { schema: SummarizeRemindersInputSchema },
  output: { schema: SummarizeRemindersOutputSchema },
  prompt: `You are a helpful financial assistant.
    Analyze the following list of payment reminders and provide a short, friendly summary for the user.
    Focus on the most urgent pending payments. Mention the total number of pending reminders and the total amount due for them.
    Today's date is {{currentDate}}.

    Reminders:
    {{#each reminders}}
    - Title: {{title}}
      Due Date: {{dueDate}}
      Amount: INR {{amount}}
      Status: {{status}}
    {{/each}}
  `,
});

const summarizeRemindersFlow = ai.defineFlow(
  {
    name: 'summarizeRemindersFlow',
    inputSchema: SummarizeRemindersInputSchema,
    outputSchema: SummarizeRemindersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
        ...input,
        currentDate: new Date().toDateString()
    });
    return output!;
  }
);
