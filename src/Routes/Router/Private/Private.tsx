import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import ReactSkeleton from "../../../components/skeleton/Skeleton";
import { useAuth } from "../../../contexts/AuthContext";
import { useCommon } from "../../../contexts/CommonContext";

interface PrivateProps {
  children: ReactNode;
}

const Private: React.FC<PrivateProps> = ({ children }) => {
  const { user } = useAuth();
  const { isLoading } = useCommon();
  const location = useLocation();

  if (isLoading) {
    return <ReactSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default Private;
