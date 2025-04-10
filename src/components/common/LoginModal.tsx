import { useCallback, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "./useRegisterModal";
import useLoginModal from "./useLoginModal";
import { supabase } from "@/lib/supabase/client";
import Modal from "./Modal";
import InputTwo from "./InputTwo";
import Heading from "./Heading";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

const LoginModal = () => {
  const navigate = useNavigate();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

// In your LoginModal.tsx, update the relevant parts:

const onSubmit: SubmitHandler<FieldValues> = async (data) => {
  setIsLoading(true);

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw error;
    }

    showSuccessToast("Login successful! Redirecting...");
    
    // Wait a bit before closing the modal to show the toast
    setTimeout(() => {
      loginModal.onClose();
      navigate("/dashboard");
    }, 2000);

  } catch (error: any) {
    showErrorToast(error.message || "An error occurred during login");
  } finally {
    setIsLoading(false);
  }
};

const handleGoogleSignIn = async () => {
  setIsLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }

   showSuccessToast("Google login successful! Redirecting...");
    
    // Wait a bit before closing the modal to show the toast
    setTimeout(() => {
      loginModal.onClose();
      window.location.reload();
    }, 2000);

  } catch (error: any) {
    showErrorToast(error.message || "Google login failed");
  } finally {
    setIsLoading(false);
  }
};

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
      <InputTwo
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <InputTwo
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-[5px]">
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
          First time using Garvani?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={loginModal.isOpen}
        title="Login"
        actionLabel="Continue"
        onClose={loginModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
      />
    </>
  );
};

export default LoginModal;