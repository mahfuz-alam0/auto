import { JSX, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaArrowRightFromBracket } from "react-icons/fa6";


const Goback = ({ title }: any): JSX.Element => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const prev = sessionStorage.getItem("previousPath");
    sessionStorage.setItem("previousPath", location.pathname);
  }, [location]);

  const canGoBack = window.history.length > 1 && location.pathname !== "/";

  const goBack = (): void => {
    navigate(-1);
  };

  return (
    <div className="goback">
      <div className="left">
        {canGoBack && <FaArrowLeft className="back-icon" onClick={goBack} />}
        <h2>{title}</h2>
      </div>
      {user && location.pathname === "/" && (
        <button className="btn danger" onClick={logout}>
          Logout <FaArrowRightFromBracket />
        </button>
      )}
    </div>
  );
};

export default Goback;
