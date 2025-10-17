'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { parseFinancialDocument } from '@/ai/flows/parse-financial-documents';
import { Loader2, UploadCloud, FileText, AlertTriangle } from 'lucide-react';

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleParseDocument = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a document to parse.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const documentDataUri = reader.result as string;
        try {
          const response = await parseFinancialDocument({ documentDataUri });
          setResult(response.extractedInformation);
          toast({
            title: 'Document Parsed',
            description: 'Information has been extracted successfully.',
          });
        } catch (e: any) {
          setError('Failed to parse document. The AI model could not process the request.');
          toast({
            title: 'Parsing Failed',
            description: e.message || 'An unexpected error occurred.',
            variant: 'destructive',
          });
        } finally {
            setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setIsLoading(false);
      };
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Document Parser"
        description="Upload financial documents like fee structures or loan agreements to get a clear breakdown."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Select a file from your device to begin processing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center">
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                    Drag & drop a file here or click to select
                </p>
                <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                <Button variant="outline" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                    Browse File
                </Button>
            </div>

            {file && (
              <div className="flex items-center space-x-3 p-3 bg-secondary rounded-md">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
              </div>
            )}
            
            <Button onClick={handleParseDocument} disabled={!file || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                'Parse Document'
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
            <CardDescription>Review the key information from your document below.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            {isLoading && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Analyzing document...</p>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center gap-2 text-destructive text-center">
                <AlertTriangle className="h-8 w-8" />
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {result && (
              <div className="prose prose-sm dark:prose-invert max-w-none w-full whitespace-pre-wrap text-card-foreground">
                {result}
              </div>
            )}
            {!isLoading && !error && !result && (
              <div className="text-center text-muted-foreground">
                <p>Results will appear here once a document is parsed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
