'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const InvoiceForm = dynamic(() => import('@/components/invoice-form'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Loading...</h2>
        <p className="text-muted-foreground">Memuat formulir invoice...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('inpatient');

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-4">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold truncate">
                Detail Pembayaran
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                Pilih jenis perawatan dan isi formulir
              </p>
            </div>
          </div>
          <div className="w-full sm:w-[400px]">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted h-9">
                <TabsTrigger
                  value="inpatient"
                  className="text-xs text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Rawat Inap
                </TabsTrigger>
                <TabsTrigger
                  value="outpatient"
                  className="text-xs text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Rawat Jalan
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </nav>
      </header>

      <main className="flex-1 h-[calc(100vh-88px)] overflow-y-auto">
        <div className="mx-auto w-full p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsContent value="inpatient" className="space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Form Rawat Inap</h2>
                <p className="text-xs text-muted-foreground">
                  Isi formulir berikut untuk membuat invoice rawat inap. Tanggal
                  masuk dan tanggal keluar wajib diisi.
                </p>
              </div>
              <div className="w-full">
                <InvoiceForm type="inpatient" />
              </div>
            </TabsContent>

            <TabsContent value="outpatient" className="space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Form Rawat Jalan</h2>
                <p className="text-xs text-muted-foreground">
                  Isi formulir berikut untuk membuat invoice rawat jalan. Hanya
                  tanggal masuk yang perlu diisi.
                </p>
              </div>
              <div className="w-full">
                <InvoiceForm type="outpatient" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
