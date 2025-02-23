'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const InvoiceForm = dynamic(() => import('@/components/invoice-form'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Loading...</h2>
        <p className="text-muted-foreground">Memuat formulir invoice...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  const router = useRouter();

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-semibold">
              Formulir Kasus Rawat Inap
            </h1>
          </div>
          <p className="text-muted-foreground">
            Isi formulir berikut untuk membuat invoice kasus rawat inap
          </p>
        </div>
      </div>
      <main className="container px-4 py-8 max-w-screen mx-auto">
        <InvoiceForm />
      </main>
    </>
  );
}
