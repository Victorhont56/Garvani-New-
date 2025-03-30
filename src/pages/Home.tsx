// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { ListingsContainer } from '@/components/common/ListingsContainer';
import { SkeltonCard } from '@/components/common/SkeletonCard';

export default function Home() {
  const [searchParams, setSearchParams] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams({
      filter: params.get('filter') || undefined,
      state: params.get('state') || undefined,
      // ... other params you need
    });
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <SkeltonCard key={index} />
          ))}
        </div>
      ) : (
        <ListingsContainer searchParams={searchParams} />
      )}
    </>
  );
}

