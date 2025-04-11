import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useLoginModal from "./useLoginModal";
import useRegisterModal from "./useRegisterModal";
import Modal from "./Modal";
import Input from "./InputTwo";
import Heading from "./Heading";
import Button from "./Button";
import { useAuth } from "@/app/AuthProvider";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const requiresEmailConfirmation = import.meta.env.VITE_REQUIRE_EMAIL_CONFIRMATION === "true";

  const createPublicUserProfile = async (
    userId: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Profile creation error:', error);
      throw error;
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    
    try {
      // 1. First create the auth user with minimal data
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: { // This goes to raw_user_meta_data
            first_name: data.firstname,
            last_name: data.lastname,
            full_name: `${data.firstname} ${data.lastname}` // For display name
          }
        },
      });
      
      if (authError) throw authError;
  
      // 2. Create public profile (wait 1 second if needed to ensure user is created)
      if (authData.user) {
        // Optional: Add slight delay if profile creation fails
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstname,
            last_name: data.lastname,
            updated_at: new Date().toISOString(),
          });
  
        if (profileError) throw profileError;
      }
  
      toast.success(
        requiresEmailConfirmation 
          ? 'Please check your email for confirmation' 
          : 'Registration successful!'
      );
      
      registerModal.onClose();
    } catch (error: any) {
      console.error('Registration Failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
  
      if (error) throw error;
  
    } catch (error: any) {
      toast.error(error.message || "Google sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Garvani" subtitle="Create an account!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validate={(value) =>
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
          "Invalid email address"
        }
      />
      <Input
        id="firstname"
        label="First name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="lastname"
        label="Last name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validate={(value) =>
          value.length >= 6 || "Password must be at least 6 characters"
        }
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-5 mt-[5px]">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      />

      <div className="text-neutral-500 text-center mb-[5px] font-medium">
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {" "}
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;