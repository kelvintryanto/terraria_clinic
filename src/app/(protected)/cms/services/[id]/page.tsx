'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Service } from '../../../../../../data/types';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch service');
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!service) return <div>Service not found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/cms/products')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detail Layanan</h1>
        </div>
        <Button asChild>
          <Link href={`/cms/services/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{service.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Harga Dasar</h3>
            <p>{formatRupiah(service.basePrice)}</p>
          </div>
          {service.description && (
            <div>
              <h3 className="font-semibold">Deskripsi</h3>
              <p>{service.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
