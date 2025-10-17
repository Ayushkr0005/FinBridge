'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard as CreditCardIcon, Calendar as CalendarIcon, Lock, Plus, BellRing, CheckCircle, Wallet, FileText } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useState } from 'react';


const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  dueDate: z.date({ required_error: 'A due date is required.' }),
});

const paymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  description: z.string().min(1, 'Description is required'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits.').max(16, 'Card number must be 16 digits.'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date format (MM/YY).'),
  cvc: z.string().min(3, 'CVC must be 3 digits.').max(4, 'CVC can be at most 4 digits.'),
})
type PaymentFormValues = z.infer<typeof paymentSchema>;
type ReminderFormValues = z.infer<typeof reminderSchema>;

export default function PaymentsPage() {
  const { toast } = useToast();
  const { reminders, addReminder, updateReminderStatus, isClient, addPayment } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const reminderForm = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      amount: 0,
      dueDate: new Date(),
    },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
        amount: 0,
        description: "Semester Fee Payment",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
    }
  });


  const handlePayment = (data: PaymentFormValues) => {
    addPayment({
      amount: data.amount,
      date: new Date().toISOString(),
      description: data.description,
    });
    toast({
      title: 'Payment Successful',
      description: `₹${data.amount} has been paid successfully.`,
    });
    paymentForm.reset();
  };

  const handleMarkAsPaid = (id: string) => {
    updateReminderStatus(id, 'Paid');
    toast({
      title: 'Reminder Updated',
      description: 'The payment has been marked as paid.',
    });
  };

  function onAddReminder(data: ReminderFormValues) {
    addReminder({ ...data, dueDate: data.dueDate.toISOString() });
    toast({
      title: 'Reminder Added',
      description: `Successfully added "${data.title}".`,
    });
    reminderForm.reset();
    setIsDialogOpen(false);
  }

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="Payments & Reminders"
        description="Securely manage tuition payments and stay on top of deadlines."
      />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Enter payment details to pay tuition or other fees.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(handlePayment)} className="space-y-6">
                  <FormField control={paymentForm.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment For</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., Spring semester books" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={paymentForm.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">₹</span>
                          <Input type="number" placeholder="0.00" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={paymentForm.control} name="cardNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="0000 0000 0000 0000" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                     <FormField control={paymentForm.control} name="expiryDate" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="MM/YY" className="pl-9" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={paymentForm.control} name="cvc" render={({ field }) => (
                        <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="123" className="pl-9" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full">
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment Reminders</CardTitle>
                  <CardDescription>All your upcoming payments.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Reminder</DialogTitle>
                      <DialogDescription>
                        Fill out the details for your new payment reminder.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...reminderForm}>
                      <form onSubmit={reminderForm.handleSubmit(onAddReminder)} className="space-y-4 py-4">
                        <FormField control={reminderForm.control} name="title" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Spring semester books" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={reminderForm.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">₹</span>
                                  <Input type="number" placeholder="0.00" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                         <FormField
                            control={reminderForm.control}
                            name="dueDate"
                            render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Due Date</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                        )}
                                    >
                                        {field.value ? (
                                        format(field.value, 'PPP')
                                        ) : (
                                        <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Add Reminder</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reminders.length > 0 ? reminders.map((reminder) => (
                  <Card key={reminder.id} className="shadow-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{reminder.title}</CardTitle>
                          <CardDescription>
                            Due: {format(new Date(reminder.dueDate), 'MMM d, yyyy')}
                          </CardDescription>
                        </div>
                        <Badge variant={reminder.status === 'Paid' ? 'default' : 'secondary'} className={cn('whitespace-nowrap', reminder.status === 'Paid' ? 'bg-green-500' : '')}>
                            {reminder.status === 'Pending' && <BellRing className="mr-1 h-3 w-3" />}
                            {reminder.status === 'Paid' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {reminder.status}
                          </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xl font-bold text-primary">
                        <span>₹{reminder.amount.toLocaleString()}</span>
                      </div>
                    </CardContent>
                    {reminder.status === 'Pending' && (
                      <CardFooter>
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsPaid(reminder.id)} className="w-full">Mark as Paid</Button>
                      </CardFooter>
                    )}
                  </Card>
                )) : (
                  <div className="text-center text-muted-foreground py-10">
                    <Wallet className="mx-auto h-12 w-12" />
                    <p className="mt-4">No reminders found.</p>
                    <p className="text-sm">Click the '+' button to add a new reminder.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
