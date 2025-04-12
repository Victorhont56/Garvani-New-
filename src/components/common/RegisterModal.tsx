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
import { useNavigate } from "react-router-dom";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useAuth();
  const navigate = useNavigate();

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
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
          data: {
            first_name: data.firstname,
            last_name: data.lastname,
            full_name: `${data.firstname} ${data.lastname}`
          }
        },
      });
      
      if (authError) throw authError;

      // 2. Check if email confirmation is required
      if (requiresEmailConfirmation) {
        toast.success('Please check your email to confirm your account');
        registerModal.onClose();
        return;
      }

      // 3. If no email confirmation required, create profile
      if (authData.user) {
        await createPublicUserProfile(
          authData.user.id,
          data.email,
          data.firstname,
          data.lastname
        );

        toast.success('Registration successful! Redirecting...');
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error: any) {
      console.error('Registration Failed:', error);
      
      let errorMessage = 'Registration failed';
      if (error.message.includes('User already registered')) {
        errorMessage = 'This email is already registered';
      } else if (error.message.includes('Database error')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      toast.error(errorMessage);
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
  
      toast.success("Google login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
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