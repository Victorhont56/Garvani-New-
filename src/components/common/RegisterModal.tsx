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
import { Profile } from "@/types/profile";
import { useAuth } from "@/app/AuthProvider";


const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { supabase } = useAuth(); // Get supabase client from AuthProvider

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
  ): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName
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
    setPasswordError("");
  
    try {
      // 1. Validate password
      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
  
      // 2. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstname,
            last_name: data.lastname,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      });
  
      if (authError) {
        console.error('SignUp Error Details:', {
          code: authError.code,
          status: authError.status,
          message: authError.message
        });
        throw authError;
      }
  
      // 3. Check if email confirmation is required
      if (authData.user && authData.user.identities?.length === 0) {
        toast.success('Please check your email for confirmation');
      }
  
      setIsSuccess(true);
      setShowStatusModal(true);
  
    } catch (error: any) {
      console.error('Registration Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      toast.error(error.message || "Registration failed. Please try again.");
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
      {passwordError && (
        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
      )}
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


      <div className="text-neutral-500 text-center mt-[5px] font-light">
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