'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppContext } from '@/contexts/app-context';
import { summarizeReminders } from '@/ai/flows/summarize-reminders';

export function AINotification() {
  const { reminders, isClient } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !summary && !isLoading) {
      fetchSummary();
    }
  }, [isOpen, reminders]);

  async function fetchSummary() {
    setIsLoading(true);
    setError(null);
    try {
      if (reminders.length > 0) {
        const result = await summarizeReminders({ reminders });
        setSummary(result.summary);
      } else {
        setSummary('You have no upcoming payment reminders.');
      }
    } catch (e: any) {
      setError('Failed to generate summary. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const hasPendingReminders = reminders.some(r => r.status === 'Pending');

  if (!isClient) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {hasPendingReminders && (
            <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2">
                <Sparkles className="text-primary h-4 w-4" />
                AI Reminder Summary
            </h4>
            <p className="text-sm text-muted-foreground">
              A quick overview of your upcoming payments.
            </p>
          </div>
          <div className="min-h-[60px] flex items-center justify-center">
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating summary...</span>
              </div>
            )}
            {error && (
                 <div className="flex flex-col items-center gap-2 text-destructive text-center">
                  <AlertTriangle className="h-6 w-6" />
                  <p className="text-sm">{error}</p>
                </div>
            )}
            {summary && (
              <p className="text-sm">
                {summary}
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
