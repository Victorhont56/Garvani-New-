import { FcGoogle } from "react-icons/fc";
import { useCallback, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useLoginModal from "./useLoginModal";
import useRegisterModal from "./useRegisterModal";
import Modal from "./Modal";
import Input from "./InputTwo";
import Heading from "./Heading";
import Button from "./Button";
import StatusModal from "./StatusModal";
import { useAuth } from "@/app/AuthProvider";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { supabase } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Check if email confirmation is required from environment
  const requiresEmailConfirmation = import.meta.env.VITE_REQUIRE_EMAIL_CONFIRMATION === "true";

  useEffect(() => {
    if (isSuccess && showStatusModal) {
      const timer = setTimeout(() => {
        setShowStatusModal(false);
        registerModal.onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, showStatusModal, registerModal]);

  const createPublicUserProfile = async (
    userId: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      throw new Error('Failed to create user profile');
    }

    return data;
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            first_name: data.firstname || '',
            last_name: data.lastname || '',
          }
        },
      });
      

      if (authError) {
        console.error('Auth Error:', {
          code: authError.code,
          message: authError.message,
          status: authError.status
        });
        throw authError;
      }

      // 2. Create public profile if user was created
      if (authData.user) {
        await createPublicUserProfile(
          authData.user.id,
          data.email,
          data.firstname,
          data.lastname
        );
      }

      // 3. Handle success
      setIsSuccess(true);
      setShowStatusModal(true);

      // Show appropriate message based on email confirmation requirement
      if (requiresEmailConfirmation) {
        toast.success('Please check your email for confirmation');
      } else {
        toast.success('Registration successful! You can now login.');
      }

    } catch (error: any) {
      console.error('Registration Failed:', error);
      setIsSuccess(false);
      setShowStatusModal(true);

      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        toast.error('This email is already registered');
      } else if (error.message.includes('Database error')) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(error.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of your component remains the same ...
  
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
      setIsSuccess(false);
      setShowStatusModal(true);
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
    <>
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

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        isSuccess={isSuccess}
        title={isSuccess ? "Registration successful" : "Registration failed"}
        body={
          isSuccess ? (
            <p>
             {import.meta.env.VITE_REQUIRE_EMAIL_CONFIRMATION === "true"
                ? "Please check your email to confirm your account"
                : "Your account has been created successfully! Please login to continue"}
            </p>
          ) : (
            <p>Something went wrong. Please try again.</p>
          )
        }
      />
    </>
  );
};

export default RegisterModal;