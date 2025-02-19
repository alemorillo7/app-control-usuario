// import { useEffect, useState } from "react";
// import { auth, provider } from "../config/firebase"; // Ajusta la ruta según tu estructura
// import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
// import { signOut } from "firebase/auth";
// import googleLogo from "../assets/google-logo.svg";

// export const Boton = () => {
//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setUser(user);
//         // Verifica si el usuario es administrador
//         const idTokenResult = await user.getIdTokenResult();
//         setIsAdmin(!!idTokenResult.claims.role);
//       } else {
//         setUser(null);
//         setIsAdmin(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       console.log("Usuario autenticado:", user);
//     } catch (error) {
//       console.error("Error al autenticar:", error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       console.log("Usuario cerró sesión");
//     } catch (error) {
//       console.error("Error al cerrar sesión:", error);
//     }
//   };

//   return (
//     <div>
//       {!user && (
//         <button
//           onClick={handleLogin}
//           className="google-login-button-custom btn d-flex align-items-center"
//         >
//           <img
//             src={googleLogo}
//             alt="Google Logo"
//             className="google-logo me-2"
//           />
//           Iniciar sesión con Google
//         </button>
//       )}
//       {user && (
//         <div className="text-center">
//           <p>Bienvenido, {user.displayName}!</p>
//           <img src={user.photoURL} alt="Foto de perfil" className="profile-image" />
//           {isAdmin && (
//             <button
//               onClick={() => {
//                 // Lógica para agregar usuario
//                 console.log("Agregar usuario");
//               }}
//               className="btn btn-success mt-3"
//             >
//               Agregar usuario
//             </button>
//           )}
//           <button
//             onClick={handleLogout}
//             className="btn btn-danger mt-3"
//           >
//             Cerrar sesión
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };