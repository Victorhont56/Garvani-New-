import { useCallback, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "./useRegisterModal";
import useLoginModal from "./useLoginModal";
import { supabase } from "@/lib/supabase/client";
import Modal from "./Modal";
import InputTwo from "./InputTwo";
import Heading from "./Heading";
import Button from "./Button";
import { useNavigate, useLocation } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { checkAdminStatus } from "@/lib/supabase/admin";

const LoginModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (location.search.includes('confirmed=true')) {
      showSuccessToast('Email confirmed successfully! Please login.');
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const checkAndRedirect = async (userId: string) => {
    try {
      const isAdmin = await checkAdminStatus(userId);
      if (isAdmin) {
        showSuccessToast("Admin login successful! Redirecting to admin dashboard...");
        setTimeout(() => {
          loginModal.onClose();
          navigate("/admin");
        }, 1000);
      } else {
        showSuccessToast("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          loginModal.onClose();
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      // Default to regular dashboard if admin check fails
      showSuccessToast("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        loginModal.onClose();
        navigate("/dashboard");
      }, 1000);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.user) {
        await checkAndRedirect(authData.user.id);
      }
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

      if (error) throw error;

      // For OAuth, we'll check admin status after the redirect
      showSuccessToast("Google login successful! Redirecting...");
      setTimeout(() => {
        loginModal.onClose();
        navigate("/dashboard");
      }, 1000);
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

  // ... rest of the component remains the same ...
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
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {" "}
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

  return (
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
  );
};

export default LoginModal;