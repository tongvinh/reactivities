import { Navigate } from "react-router-dom";
import { useStore } from "../stores/store";

export default function PrivateRoute({ children }: any) {
  const {
    userStore: { isLoggedIn },
  } = useStore();
  return isLoggedIn ? children : <Navigate to="/" />;
}
