// import { createContext, useEffect, useState } from "react";
// import axios from "axios";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(() => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("token");
//   });

//   const [user, setUser] = useState(null);

//   const logout = () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("token");
//     }
//     setToken(null);
//     setUser(null);
//   };

 

//   const login = (jwt) => {
//     localStorage.setItem("token", jwt);
//     setToken(jwt);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext };

import { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage
  const [token, setToken] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  // Initialize user from localStorage
  const [user, setUser] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("admin")
      ? JSON.parse(localStorage.getItem("admin"))
      : null
  );

  // Login function
  const login = ({ token: jwt, admin }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", jwt);
      localStorage.setItem("admin", JSON.stringify(admin));
    }
    setToken(jwt);
    setUser(admin);

    // Optional: set default axios header
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
  };

  // Logout function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    }
    setToken(null);
    setUser(null);

    // Remove axios default header
    delete axios.defaults.headers.common["Authorization"];
  };

  // Auto-set axios header if token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
