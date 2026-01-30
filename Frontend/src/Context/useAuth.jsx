// import { useContext } from "react";
// import { AuthContext } from "./authContext";

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

import { useContext } from "react";
import { AuthContext } from "./authContext";

/**
 * Custom hook to access authentication context
 * Must be used inside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
