import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import { persistor, store } from "./Redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import Listing from "./pages/Listing.jsx";
import EditListing from "./pages/EditListing.jsx";
import Search from "./pages/Search.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/About" element={<About />} />
      <Route path="/Sign-in" element={<SignIn />} />
      <Route path="/Sign-up" element={<SignUp />} />
      <Route path="/Listing/:id" element={<Listing />} />
      <Route path="/search" element={<Search />} />
      {/* This right here protects the profile route in case someone who is not yet signed in tries to access it */}
      <Route element={<PrivateRoute />}>
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Create-listing" element={<CreateListing />} />
        <Route path="/Edit-listing/:id" element={<EditListing />} />
      </Route>
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
