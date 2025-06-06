// import { Skeleton } from "@/components/ui/skeleton";
// import { initialSignInFormData, initialSignUpFormData } from "@/config";
// import { checkAuthService, loginService, registerService } from "@/services";
// import { createContext, useEffect, useState } from "react";
// import PropTypes from 'prop-types'; // Import PropTypes

// export const AuthContext = createContext(null);

// export default function AuthProvider({ children }) {
//   const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
//   const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
//   const [auth, setAuth] = useState({
//     authenticate: false,
//     user: null,
//   });
//   const [loading, setLoading] = useState(true);

//   async function handleRegisterUser(event) {
//     event.preventDefault();
//     const data = await registerService(signUpFormData);
//   }
//   async function handleLoginUser(event) {
//     event.preventDefault();
//     const data = await loginService(signInFormData);
//     console.log(data, "login response");
  
//     if (data.success) {
//       // Save token in sessionStorage (if needed for other purposes)
//       sessionStorage.setItem(
//         "accessToken",
//         JSON.stringify(data.data.accessToken)
//       );
      
//       // Directly set auth state from login response
//       setAuth({
//         authenticate: true,
//         user: data.data.user,
//       });
//       setLoading(false);
//     } else {
//       setAuth({
//         authenticate: false,
//         user: null,
//       });
//     }
//   }
  


//   // Check auth user
//   async function checkAuthUser() {
//     try {
//       const data = await checkAuthService();
//       if (data.success) {
//         setAuth({
//           authenticate: true,
//           user: data.data.user,
//         });
//         setLoading(false);
//       } else {
//         setAuth({
//           authenticate: false,
//           user: null,
//         });
//         setLoading(false);
//       }
//     } catch (error) {
//       console.log(error);
//       if (!error?.response?.data?.success) {
//         setAuth({
//           authenticate: false,
//           user: null,
//         });
//         setLoading(false);
//       }
//     }
//   }

//   function resetCredentials() {
//     setAuth({
//       authenticate: false,
//       user: null,
//     });
//   }

//   useEffect(() => {
//     checkAuthUser();
//   }, []);

//   console.log(auth, "gf");

//   return (
//     <AuthContext.Provider
//       value={{
//         signInFormData,
//         setSignInFormData,
//         signUpFormData,
//         setSignUpFormData,
//         handleRegisterUser,
//         handleLoginUser,
//         auth,
//         resetCredentials,
//       }}
//     >
//       {loading ? <Skeleton /> : children}
//     </AuthContext.Provider>
//   );
// }

// // PropTypes validation
// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired, // Ensure children is passed and is a valid React node
// };
import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import {
  checkAuthService,
  loginService,
  registerService,
  //logoutService,
} from "@/services";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  // Handle user registration
  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      // You can auto-login the user or show a success message here
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle user login
  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  // Handle user logout
  // async function logoutUser() {
  //   try {
  //     await logoutService(); // clear cookies on backend
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //   } finally {
  //     resetCredentials();
  //   }
  // }

  // Reset user credentials
  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  // Check if user is authenticated on first load
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        //logoutUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton className="w-full h-screen" /> : children}
    </AuthContext.Provider>
  );
}

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
