// src/components/reviews/RatingsAndReviews.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/app/AuthProvider';
import { Star, StarHalf } from 'lucide-react';

interface Props {
    homeId: string | undefined; // Allow undefined
  }

interface Review {
    id: string;
    user_id: string;
    home_id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: {
      first_name: string | null;
      last_name: string | null;
    } | null; // Supabase returns null if no relation exists
  }

interface PaymentStatus {
  hasPaid: boolean;
}

export default function RatingsAndReviews({ homeId }: Props) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState('');

  if (!homeId) {
    return <div className="text-red-500">Missing listing ID</div>;
  }



  // Check if user has paid for this listing
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .eq('home_id', homeId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        setPaymentStatus({
          hasPaid: !!data
        });
      } catch (err) {
        console.error('Payment check error:', err);
      }
    };

    checkPaymentStatus();
  }, [user, homeId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select(`
              id,
              user_id,
              home_id,
              rating,
              comment,
              created_at,
              profiles (first_name, last_name)
            `)
            .eq('home_id', homeId)
            .order('created_at', { ascending: false });
      
          if (error) throw error;
      
          // Type-safe transformation
          const typedReviews: Review[] = (data || []).map((review: any) => ({
            id: review.id,
            user_id: review.user_id,
            home_id: review.home_id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            profiles: review.profiles ? {
              first_name: review.profiles.first_name,
              last_name: review.profiles.last_name
            } : null
          }));
      
          setReviews(typedReviews);
        } catch (err) {
          console.error('Error fetching reviews:', err);
          setError('Failed to load reviews');
        } finally {
          setLoading(false);
        }
      };
    fetchReviews();
  }, [homeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (!paymentStatus?.hasPaid) {
      setError('You must have paid for this listing to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            home_id: homeId,
            rating,
            comment
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add the new review to the list
      setReviews(prev => [
        {
          ...data,
          profiles: {
            first_name: user.user_metadata?.first_name || 'Anonymous',
            last_name: user.user_metadata?.last_name || ''
          }
        },
        ...prev
      ]);

      // Reset form
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Render star rating
  const renderStars = (value: number, forInput = false) => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 >= 0.5;
    const size = forInput ? 'w-6 h-6' : 'w-5 h-5';
  
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star 
            key={i} 
            className={`${size} fill-yellow-400 text-yellow-400`} 
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf 
            key={i} 
            className={`${size} fill-yellow-400 text-yellow-400`} 
          />
        );
      } else {
        stars.push(
          <Star 
            key={i} 
            className={`${size} text-yellow-400`}
            fill="none"  // This makes it outlined
          />
        );
      }
    }
  
    return stars;
  };

  if (loading) return <div className="text-center py-8">Loading reviews...</div>;

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
      
      {/* Average Rating */}
      <div className="flex items-center mb-6">
        <div className="flex mr-2">
          {renderStars(averageRating)}
        </div>
        <span className="text-gray-700">
          {averageRating.toFixed(1)} ({reviews.length} reviews)
        </span>
      </div>

      {/* Review Form (only for authenticated users who have paid) */}
      {user && paymentStatus?.hasPaid && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-medium mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-4">
              <span className="mr-2">Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                    >
                    <Star
                        className="w-6 h-6"
                        fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                        color={(hoverRating || rating) >= star ? "#fbbf24" : "#d1d5db"}
                    />
                    </button>
                ))}
                </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block mb-2">
                Review:
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Share your experience..."
                required
              />
            </div>
            
            {error && <div className="text-red-500 mb-4">{error}</div>}
            
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (

            reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                    <div className="font-medium mr-2">
                    {review.profiles?.first_name || 'Anonymous'} {review.profiles?.last_name || ''}
                    </div>
                    <div className="flex">
                    {renderStars(review.rating)}
                    </div>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}