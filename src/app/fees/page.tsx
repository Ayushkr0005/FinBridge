'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';
import { useAppContext } from '@/contexts/app-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function FeesPage() {
  const { student, feeStructure, isClient, payments } = useAppContext();

  if (!isClient) {
    return null;
  }

  if (!student) {
    return (
        <div>
            <PageHeader
                title="Fee Structure"
                description="View the detailed fee breakdown for your child's course."
            />
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Student Selected</AlertTitle>
                <AlertDescription>
                Please provide student details to view the fee structure.
                </AlertDescription>
            </Alert>
      </div>
    );
  }

  const yearData = feeStructure.find((y) => y.year === student.year);
  const departmentFees = yearData?.departments[student.department] || [];
  const totalFees = departmentFees.reduce((acc, item) => acc + item.amount, 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const remainingBalance = totalFees - totalPaid;
  const paymentProgress = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;


  return (
    <div>
      <PageHeader
        title="Fee Status"
        description={`Showing fees for a ${student.year}st year student in ${student.department}.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>
                    {student.department} - Year {student.year}
                </CardTitle>
                <CardDescription>
                    Roll Number: {student.rollNumber}
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {departmentFees.map((item, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell className="text-right">
                            ₹{item.amount.toLocaleString()}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                    <TableRow className="bg-secondary/50">
                        <TableCell className="font-bold">Total Fees</TableCell>
                        <TableCell className="text-right font-bold">
                        ₹{totalFees.toLocaleString()}
                        </TableCell>
                    </TableRow>
                    </TableFooter>
                </Table>
                </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText />
                        Payment History
                    </CardTitle>
                    <CardDescription>A log of all payments made towards the fees.</CardDescription>
                </CardHeader>
                <CardContent>
                    {payments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{format(new Date(payment.date), 'MMM d, yyyy')}</TableCell>
                                        <TableCell>{payment.description}</TableCell>
                                        <TableCell className="text-right">₹{payment.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            No payments made yet.
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>

        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Fee Summary</CardTitle>
                    <CardDescription>Your current payment status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Paid</span>
                            <span className="font-medium text-green-600">₹{totalPaid.toLocaleString()}</span>
                        </div>
                        <Progress value={paymentProgress} className="h-2" />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Fees</span>
                            <span className="font-medium">₹{totalFees.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Fees</span>
                            <span className="font-semibold">₹{totalFees.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Amount Paid</span>
                            <span className="font-semibold">- ₹{totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span >Balance Due</span>
                            <span>₹{remainingBalance.toLocaleString()}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    {remainingBalance > 0 && (
                         <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Action Required</AlertTitle>
                            <AlertDescription>
                                You have an outstanding balance of ₹{remainingBalance.toLocaleString()}. Please make a payment soon.
                            </AlertDescription>
                        </Alert>
                    )}
                     {remainingBalance <= 0 && (
                         <Alert className="border-green-500 text-green-600">
                            <Info className="h-4 w-4" />
                            <AlertTitle>All Cleared!</AlertTitle>
                            <AlertDescription>
                                All fees have been paid. Thank you!
                            </AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
