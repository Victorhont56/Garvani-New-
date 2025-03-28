'use client'

import { SkeltonCard } from "./SkeletonCard";
import { NoItems } from "./NoItem";
import { ListingCard } from "./ListingCard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface Listing {
  id: string;
  title: string;
  photo: string;
  state: string;
  lga: string;
  mode: string;
  price: number;
  Favorite: Array<{ id: string }>;
}

interface SearchParams {
  filter?: string;
  state?: string;
  lga?: string;
  mode?: string;
  type?: string;
  guest?: string;
  livingrooms?: string;
  bedrooms?: string;
  bathrooms?: string;
}

export function ListingsContainer({ searchParams }: { searchParams?: SearchParams }) {
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check current session when component mounts
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId !== null) { // Changed from undefined check to null check
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Create URLSearchParams properly
          const params = new URLSearchParams();
          
          // Add userId if it exists
          if (userId) {
            params.append('userId', userId);
          }
          
          // Add other search parameters if they exist
          if (searchParams) {
            Object.entries(searchParams).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== '') {
                params.append(key, String(value));
              }
            });
          }
          
          const queryString = params.toString();
          const response = await fetch(`/api/listings?${queryString}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          
          const data = await response.json();
          setData(data);
        } catch (err) {
          console.error("Fetch error:", err);
          setError(err instanceof Error ? err.message : 'Failed to fetch listings');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [searchParams, userId]);

  if (loading) {
    return (
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <SkeltonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <NoItems
        title="Error loading listings"
        description={error}
      />
    );
  }

  return (
    <>
      {data.length === 0 ? (
        <NoItems
          description="Please check another category or create your own listing!"
          title="Sorry no listings found for this category..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.id}
              title={item.title}
              imagePath={item.photo}
              state={item.state}
              lga={item.lga}
              mode={item.mode}
              price={item.price}
              userId={userId}
              favoriteId={item.Favorite[0]?.id}
              isInFavoriteList={item.Favorite.length > 0}
              homeId={item.id}
              pathName="/"
            />
          ))}
        </div>
      )}
    </>
  );
}