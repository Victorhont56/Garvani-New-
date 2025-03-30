import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMemo } from "react";
import useListModal from "./useListModal";
import Modal from "./Modal";
import Counter from "./CounterTwo";
import CategoryInput from "./CategoryInput";
import { categoryItems } from "./MapFilterItems";
import InputTwo from "./InputTwo";
import Heading from "./Heading";
import nigerianStatesWithLga from "./NigerianStatesWithLga";
import SuccessModal from "./SuccessModal";
import { X } from "lucide-react";
import { useAuth } from "@/app/AuthProvider";
import { supabase } from "@/lib/supabase/client";

enum STEPS {
  TYPE = 0,
  MODE = 1,
  CATEGORY = 2,
  STATE = 3,
  LGA = 4,
  INFO = 5,
  IMAGES = 6,
  DESCRIPTION = 7,
  PRICE = 8,
}

const ListModal = () => {
  const listModal = useListModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.TYPE);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth(); // Get user from AuthProvider

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      livingroomCount: 0,
      bedroomCount: 0,
      bathroomCount: 0,
      mode: "Rent",
      type: "Building",
      state: "",
      lga: "",
      images: [],
      price: 1,
      title: "",
      description: "",
      userId: user?.id,
    },
  });

  // Update form when userId changes
  useEffect(() => {
    setValue("userId", user?.id);
  }, [user, setValue]);

  const state = watch("state");
  const mode = watch("mode");
  const type = watch("type");
  const category = watch("category");
  const livingroomCount = watch("livingroomCount");
  const bedroomCount = watch("bedroomCount");
  const bathroomCount = watch("bathroomCount");

  let bodyContent = <div></div>;

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onNext = () => {
    if (step === STEPS.MODE && type === "Land") {
      // Skip CATEGORY step for Land
      setStep(STEPS.STATE);
    } else if (step === STEPS.LGA && type === "Land") {
      // Skip INFO step for Land, go directly to IMAGES
      setStep(STEPS.IMAGES);
    } else {
      setStep((value) => value + 1);
    }
  };
  
  const onBack = () => {
    if (step === STEPS.IMAGES && type === "Land") {
      // Go back to LGA from IMAGES for Land
      setStep(STEPS.LGA);
    } else if (step === STEPS.STATE && type === "Land") {
      // Go back to MODE from STATE for Land
      setStep(STEPS.MODE);
    } else {
      setStep((value) => value - 1);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      
      if (files.length + selectedFiles.length > 20) {
        toast.error("Maximum 20 images allowed");
        return;
      }

      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);
      
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.PRICE) return onNext();
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Get fresh session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("Session expired. Please log in again.");
      }
  
      // Upload images if any
      const imageUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `homes/${fileName}`;
  
          const { error: uploadError } = await supabase.storage
          .from('home-images')
          .upload(filePath, file, {
            contentType: file.type || 'image/png',
            upsert: false,
            cacheControl: '3600',
            headers: {
              'X-Client-Info': 'garvani-web/1.0'
            }
          });
  
          if (uploadError) throw uploadError;
  
          const { data: { publicUrl } } = supabase.storage
            .from('home-images')
            .getPublicUrl(filePath);
          
          imageUrls.push(publicUrl);
        }
      }
  
      // Prepare home data
      const homeData = {
        user_id: user.id,
        title: data.title,
        description: data.description || (type === 'Land' ? 'Land property' : ''),
        price: Number(data.price),
        type: data.type,
        mode: data.mode,
        state: data.state,
        lga: data.lga,
        photo: imageUrls[0] || null,
        images: imageUrls,
        added_category: data.type === 'Building',
        added_description: data.type === 'Building',
        bathrooms: data.bathroomCount.toString(),
        ...(data.type === 'Building' && {
          category_name: data.category,
          bedrooms: data.bedroomCount.toString(),
          livingrooms: data.livingroomCount.toString(),
        }),
      };
  
      // Insert with RLS headers
      const { data: home, error } = await supabase
        .from('homes')
        .insert(homeData)
        .select()
        .single();
  
      if (error) throw error;
  
      // Success
      setIsSuccessModalOpen(true);
      reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
      setStep(STEPS.TYPE);
      listModal.onClose();
  
    } catch (error) {
      console.error('Detailed error:', error);
      toast.error(
        error instanceof Error ? 
        error.message : 
        "Failed to create listing. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.TYPE) {
      return undefined;
    }
    return "Back";
  }, [step]);

  // TYPE step (now first)
  if (step === STEPS.TYPE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What type of property is this?"
          subtitle="Select Building or Land"
        />
        <div className="flex">
          <button
            type="button"
            onClick={() => setCustomValue("type", "Building")}
            className={`flex-1 py-2 border rounded-l-lg ${
              type === "Building" ? "bg-secondary text-white" : "bg-gray-100"
            }`}
          >
            Building
          </button>
          <button
            type="button"
            onClick={() => setCustomValue("type", "Land")}
            className={`flex-1 py-2 border rounded-r-lg ${
              type === "Land" ? "bg-secondary text-white" : "bg-gray-100"
            }`}
          >
            Land
          </button>
        </div>
      </div>
    );
  }

  // MODE step (second)
  if (step === STEPS.MODE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What is your property listed for?"
          subtitle="Select Rent or Sale"
        />
        <div className="flex">
          <button
            type="button"
            onClick={() => setCustomValue("mode", "Rent")}
            className={`flex-1 py-2 border rounded-l-lg ${
              mode === "Rent" ? "bg-secondary text-white" : "bg-gray-100"
            }`}
          >
            Rent
          </button>
          <button
            type="button"
            onClick={() => setCustomValue("mode", "Sale")}
            className={`flex-1 py-2 border rounded-r-lg ${
              mode === "Sale" ? "bg-secondary text-white" : "bg-gray-100"
            }`}
          >
            Sale
          </button>
        </div>
      </div>
    );
  }



  
  // CATEGORY step (only shown for Building type)
  if (step === STEPS.CATEGORY && type === "Building") {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div>
          <Heading
            title="Which of these best describes your place?"
            subtitle="Pick a category"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          {categoryItems.map((item) => (
            <div key={item.label} className="col-span-1">
              <CategoryInput
                onClick={(category) => setCustomValue("category", category)}
                selected={category === item.label}
                label={item.label}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STATE step
  if (step === STEPS.STATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What state is your property located?"
          subtitle="Help guests find you!"
        />
        <select
          {...register("state", { required: true })}
          className="w-full p-2 border rounded"
          onChange={(e) => setCustomValue("state", e.target.value)}
        >
          <option value="">Select a state</option>
          {Object.keys(nigerianStatesWithLga).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // LGA step
  if (step === STEPS.LGA) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What is the local government area of your property?"
          subtitle="Help guests find you!"
        />
        <select
          {...register("lga", { required: true })}
          className="w-full p-2 border rounded"
          disabled={!state}
          onChange={(e) => setCustomValue("lga", e.target.value)}
        >
          <option value="">Select an LGA</option>
          {nigerianStatesWithLga[state as keyof typeof nigerianStatesWithLga]?.map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // INFO step (only shown for Building type)
if (step === STEPS.INFO && type === "Building") {
  bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Share some basics about your place"
        subtitle="What amenities do you have?"
      />
      <Counter
        onChange={(value) => setCustomValue("bedroomCount", value)}
        value={bedroomCount}
        title="Bedrooms"
        subtitle="How many bedrooms do you have?"
      />
      <hr />
      <Counter
        onChange={(value) => setCustomValue("livingroomCount", value)}
        value={livingroomCount}
        title="Livingrooms"
        subtitle="How many living rooms do you have?"
      />
      <hr />
      <Counter
        onChange={(value) => setCustomValue("bathroomCount", value)}
        value={bathroomCount}
        title="Bathrooms"
        subtitle="How many bathrooms do you have?"
      />
    </div>
  );
}

// Skip INFO step for Land - automatically go to IMAGES after LGA
if (step === STEPS.INFO && type === "Land") {
  setStep(STEPS.IMAGES);
  return null;
}

  // IMAGES step
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add photos of your place (5-20 images)"
          subtitle="Show guests what your place looks like!"
        />
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-secondary font-medium">Click to upload</span>
              <span className="text-sm text-gray-500">or drag and drop</span>
              <span className="text-xs text-gray-400">PNG, JPG, JPEG (Max 10MB each)</span>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isLoading}
              multiple
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
        
        {previewUrls.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {previewUrls.length} {previewUrls.length === 1 ? "image" : "images"} selected
              </span>
              <span className="text-xs text-gray-500">
                {5 - previewUrls.length > 0 ? `Minimum ${5 - previewUrls.length} more required` : "Maximum 20 images"}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // DESCRIPTION step
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <InputTwo
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <InputTwo
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  // PRICE step
  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle={`How much do you charge per ${mode === "Rent" ? "month" : "unit"}?`}
        />
        <InputTwo
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (!listModal.isOpen) return null;

  return (
    <>
      <Modal
        disabled={isLoading || (step === STEPS.IMAGES && previewUrls.length < 5)}
        isOpen={listModal.isOpen}
        title="Create Listing"
        actionLabel={actionLabel}
        onSubmit={handleSubmit(onSubmit)}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.TYPE ? undefined : onBack}
        onClose={listModal.onClose}
        body={bodyContent}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
};

export default ListModal;