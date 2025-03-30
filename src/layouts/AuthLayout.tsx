// src/layouts/AuthLayout.tsx
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* Only include minimal layout here or none at all */}
      <Outlet /> {/* This will render ONLY the Dashboard content */}
    </div>
  );
}