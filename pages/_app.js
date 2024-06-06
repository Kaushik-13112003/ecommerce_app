import "../styles/globals.css";
import toast, { Toaster } from "react-hot-toast";
// import Header from "@/components/Header";
import { AppProvider } from "@/context/userContext";

// import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <AppProvider>
        {/* {!true ? "" : <Header />} */}
        <Toaster />
        <Component {...pageProps} />
      </AppProvider>
    </>
  );
}

// import "../styles/globals.css";
// import toast, { Toaster } from "react-hot-toast";

// import { SessionProvider } from "next-auth/react";

// export default function App({
//   Component,
//   pageProps: { session, ...pageProps },
// }) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//       <Toaster />
//     </SessionProvider>
//   );
// }
