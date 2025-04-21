import { Navbar } from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ListingCard } from "@/components/common/ListingCard";
import { NoItems } from "@/components/common/NoItem";
import { useAuth } from "@/app/AuthProvider";
import { useState } from "react";
import { getHome, updateListingStatus, deleteListing } from "@/lib/action";
import { ListingCardProps, ListingStatus } from "@/types/profile";
import ListModal from "@/components/common/ListModal";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FiPlus, FiArrowLeft, FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import useListModal from "@/components/common/useListModal";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";

const MyListings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const listModal = useListModal();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch listings using React Query
  const { 
    data: listings = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['listings', user?.id],
    queryFn: () => getHome(user?.id || '').then(homes => 
      homes.map(item => ({
        ...item,
        status: item.status || "inactive"
      }))
    ),
    enabled: !!user?.id,
    retry: 2,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Mutations for status updates and deletions
      const updateStatusMutation = useMutation<
      ListingCardProps[], // Data returned on success
      Error, // Error type
      { ids: string[]; status: ListingStatus } // Variables type
    >({
      mutationFn: ({ ids, status }) => 
        Promise.all(ids.map(id => updateListingStatus(id, status))),
      onSuccess: (data, { ids, status }) => {
        queryClient.setQueryData<ListingCardProps[]>(['listings', user?.id], (old) =>
          old?.map(item => 
            ids.includes(item.id) ? { ...item, status } : item
          ) || []
        );
        setSelectedListings([]);
        setShowActionDialog(false);
      },
      onError: (error) => {
        console.error('Error updating status:', error);
      }
    });

    const deleteMutation = useMutation<
      boolean[], // Assuming deleteListing returns boolean
      Error,
      string[] // ids parameter
    >({
      mutationFn: (ids) => Promise.all(ids.map(id => deleteListing(id))),
      onSuccess: (data, ids) => {
        queryClient.setQueryData<ListingCardProps[]>(['listings', user?.id], (old) =>
          old?.filter(item => !ids.includes(item.id)) || []
        );
        setSelectedListings([]);
        setShowActionDialog(false);
      },
      onError: (error) => {
        console.error('Error deleting listings:', error);
      }
    });

  // Classify listings by status
  const activeListings = listings.filter(item => item.status === "active");
  const inactiveListings = listings.filter(item => item.status === "inactive");
  const pendingListings = listings.filter(item => item.status === "pending");

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      setSelectedListings([]);
    }
  };

  const toggleListingSelection = (id: string) => {
    const newSelected = selectedListings.includes(id) 
      ? selectedListings.filter(item => item !== id) 
      : [...selectedListings, id];
    
    setSelectedListings(newSelected);
    
    // Show action dialog if we have selections, hide if empty
    setShowActionDialog(newSelected.length > 0);
  };

  const handleStatusUpdate = (newStatus: ListingStatus) => {
    updateStatusMutation.mutate({ ids: selectedListings, status: newStatus });
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedListings);
  };

  if (authLoading) return <div className="p-4 text-center">Checking authentication...</div>;
  
  if (isLoading) return (
    <div className="p-4 space-y-6">
      <Skeleton className="h-10 w-1/3 mb-4" />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-center text-red-500">
      <p>Error loading homes:</p>
      <p className="font-medium">{(error as Error).message || 'Unknown error'}</p>
      <div className="flex gap-2 justify-center mt-4">
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Refresh Page
        </Button>
        <Button 
          onClick={() => refetch()}
          className="bg-primary hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <section className="container mx-auto mt-[70px] px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Property Portfolio</h1>
              <p className="text-gray-600 mt-2">
                {listings.length} {listings.length === 1 ? 'property' : 'properties'} listed
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <FiArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
              
              {listings.length > 0 && (
                <Button 
                  onClick={toggleEditMode}
                  variant={editMode ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <FiEdit className="h-4 w-4" />
                  {editMode ? "Done Editing" : "Edit Listings"}
                </Button>
              )}
              
              <Button 
                onClick={listModal.onOpen}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <FiPlus className="h-4 w-4" />
                New Listing
              </Button>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <NoItems
                description="Get started by listing your first property on Garvani to see it appear here"
                title="Your property portfolio is empty"
              />
              <Button 
                onClick={listModal.onOpen}
                className="mt-6 flex items-center gap-2 mx-auto bg-primary hover:bg-primary/90"
                size="lg"
              >
                <FiPlus className="h-4 w-4" />
                List Your First Property
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {activeListings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Active Listings ({activeListings.length})</h2>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    {activeListings.map((item) => (
                      <ListingWithCheckbox 
                        key={item.id}
                        item={item}
                        editMode={editMode}
                        selected={selectedListings.includes(item.id)}
                        onSelect={toggleListingSelection}
                        userId={user?.id ?? ""}
                      />
                    ))}
                  </div>
                </div>
              )}

              {inactiveListings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Inactive Listings ({inactiveListings.length})</h2>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    {inactiveListings.map((item) => (
                      <ListingWithCheckbox 
                        key={item.id}
                        item={item}
                        editMode={editMode}
                        selected={selectedListings.includes(item.id)}
                        onSelect={toggleListingSelection}
                        userId={user?.id ?? ""}
                      />
                    ))}
                  </div>
                </div>
              )}

              {pendingListings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Pending Approval ({pendingListings.length})</h2>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    {pendingListings.map((item) => (
                      <ListingWithCheckbox 
                        key={item.id}
                        item={item}
                        editMode={editMode}
                        selected={selectedListings.includes(item.id)}
                        onSelect={toggleListingSelection}
                        userId={user?.id ?? ""}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        {editMode && selectedListings.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button 
              onClick={() => setShowActionDialog(true)}
              className="rounded-full p-4 shadow-lg"
              size="lg"
            >
              <FiEdit className="h-6 w-6" />
              <span className="ml-2">Manage Selected</span>
            </Button>
          </div>
        )}
      </main>

      <ActionDialog
        open={showActionDialog}
        onOpenChange={setShowActionDialog}
        listings={listings}
        selectedListings={selectedListings}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
        isLoading={updateStatusMutation.isPending || deleteMutation.isPending}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18D619',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4e82e3',
              secondary: 'white',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          },
        }} 
      />
      <ListModal />
      <Footer />
    </div>
  );
};


const ListingWithCheckbox = ({
  item,
  editMode,
  selected,
  onSelect,
  userId
}: {
  item: ListingCardProps;
  editMode: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  userId: string;
}) => (
  <div className={`relative ${selected ? 'ring-2 ring-primary rounded-lg' : ''}`}>
    {editMode && (
      <div className="absolute top-3 left-3 z-10"> {/* Slightly adjusted positioning */}
        <CustomCheckbox
          checked={selected}
          onChange={() => onSelect(item.id)}
        />
      </div>
    )}
    <ListingCard
      item={{
        ...item,
        status: item.status || "inactive"
      }}
      userId={userId}
      pathName="/my-listings"
    />
  </div>
);

const ActionDialog = ({
  open,
  onOpenChange,
  listings,
  selectedListings,
  onStatusUpdate,
  onDelete,
  isLoading
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listings: ListingCardProps[];
  selectedListings: string[];
  onStatusUpdate: (status: ListingStatus) => void;
  onDelete: () => void;
  isLoading: boolean;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Manage Selected Listings</DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        {selectedListings.some(id => {
          const listing = listings.find(item => item.id === id);
          return listing?.status === "active";
        }) && (
          <Button 
            variant="outline" 
            onClick={() => onStatusUpdate("inactive")}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <FiEyeOff className="h-4 w-4" />
            Deactivate
          </Button>
        )}
        
        {selectedListings.some(id => {
          const listing = listings.find(item => item.id === id);
          return listing?.status === "inactive";
        }) && (
          <Button 
            variant="outline" 
            onClick={() => onStatusUpdate("active")}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <FiEye className="h-4 w-4" />
            Activate
          </Button>
        )}
        
        <Button 
          variant="destructive" 
          onClick={onDelete}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <FiTrash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default MyListings;