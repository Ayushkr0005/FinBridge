'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getPersonalizedFinancialAdvice } from '@/ai/flows/personalized-financial-advice';
import { Loader2, Lightbulb, Sparkles, AlertTriangle } from 'lucide-react';

const adviceSchema = z.object({
  income: z.coerce.number().positive('Income must be a positive number.'),
  expenses: z.coerce.number().nonnegative('Expenses cannot be negative.'),
  savings: z.coerce.number().nonnegative('Savings cannot be negative.'),
  debt: z.coerce.number().nonnegative('Debt cannot be negative.'),
  tuitionFees: z.coerce.number().nonnegative('Tuition fees cannot be negative.'),
  otherEducationExpenses: z.coerce.number().nonnegative('Other expenses cannot be negative.'),
});

type AdviceFormValues = z.infer<typeof adviceSchema>;

export default function AdvicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<AdviceFormValues>({
    resolver: zodResolver(adviceSchema),
    defaultValues: {
      income: 50000,
      expenses: 40000,
      savings: 10000,
      debt: 5000,
      tuitionFees: 15000,
      otherEducationExpenses: 2000,
    },
  });

  async function onSubmit(data: AdviceFormValues) {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const result = await getPersonalizedFinancialAdvice(data);
      setAdvice(result.advice);
      toast({
        title: 'Advice Generated',
        description: 'Your personalized financial advice is ready.',
      });
    } catch (e: any) {
      setError('Failed to get advice. The AI model could not process the request.');
      toast({
        title: 'Failed to Get Advice',
        description: e.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Personalized Financial Advisor"
        description="Get AI-powered advice based on your financial situation to better plan for education costs."
      />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Financial Details</CardTitle>
              <CardDescription>Enter your financial data for a personalized plan.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="income" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Income</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="expenses" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Expenses</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="savings" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Savings</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="debt" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Debt</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="tuitionFees" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Tuition</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="otherEducationExpenses" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Edu. Costs</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Advice...</>
                    ) : (
                      <><Lightbulb className="mr-2 h-4 w-4" />Get Advice</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" />
                Your Personalized Advice
              </CardTitle>
              <CardDescription>Actionable steps to manage education finances effectively.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center">
              {isLoading && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Crafting your financial plan...</p>
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center gap-2 text-destructive text-center">
                  <AlertTriangle className="h-8 w-8" />
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              {advice && (
                <div className="prose prose-sm dark:prose-invert max-w-none w-full whitespace-pre-wrap text-card-foreground">
                  {advice}
                </div>
              )}
              {!isLoading && !error && !advice && (
                <div className="text-center text-muted-foreground">
                  <p>Your personalized financial advice will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
