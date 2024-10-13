import { createContext } from "react";

// Create Auth Context
// const AuthContext = createContext();
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});
export default AuthContext;
