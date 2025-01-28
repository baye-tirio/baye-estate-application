import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserSuccess,
  signOutUserFailure,
} from "../Redux/User/UserSlice";
import { useDispatch } from "react-redux";
export default function Profile() {
  const dispatch = useDispatch();
  //I think that the useSelector extracts the user state which is stored globally and then assigns it to the current user variable local to the component
  const { currentUser, loading, error } = useSelector((state) => state.user);
  //This is a reference to the file input element and is initially set to null as it is basically a convention for refs referencing to actual DOM elements
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();
  const [showListings, setShowListings] = useState(false);
  const [showListingsLoading, setShowListingsLoading] = useState(false);
  const [showListingsError, setShowListingsError] = useState(null);
  const [Listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    username: undefined,
    email: undefined,
    password: undefined,
    avatar: undefined,
  });
  const [updateSuccessStatus, setUpdateSuccessStatus] = useState(false);
  // console.log("The selected file is : ");
  // console.log(file);
  // console.log(Listings);
  //whenever the file state changes
  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);
  //the logic to upload the profile image to firebase
  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await fetch("/api/cloudinary/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: file }),
      });
      const data = await res.json();
      setIsUploading(false);
      if (!data.success) {
        setUploadError(data.message);
        return;
      } else {
        console.log("avatar upload result from the server");
        console.log(data);
        setFormData({ ...formData, avatar: data.avatarUrl });
      }
    } catch (error) {
      setUploadError(error.message);
      setIsUploading(false);
      console.log(error);
    }
  };
  //function to populate the formdata before sending the formdata to the backend (server)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update-user/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        if (data.message === "Unauthorized Access !") navigate("/sign-in");
        else {
          dispatch(updateUserFailure(data.message));
          return;
        }
      }
      dispatch(updateUserSuccess(data.user));
      setUpdateSuccessStatus(true);
      console.log(data.message);
    } catch (error) {
      //In case anything went wrong when trying to send the user updates to the server
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete-user/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        if (data.message === "Unauthorized Access !") navigate("/sign-in");
        else {
          dispatch(deleteUserFailure(data.message));
          return;
        }
      }
      dispatch(deleteUserSuccess());
      // console.log(data);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/sign-out`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.success === false) {
        if (data.message === "Unauthorized Access !") navigate("/sign-in");
        else {
          dispatch(signOutUserFailure(data.message));
          return;
        }
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(null);
      setShowListingsLoading(true);
      const response = await fetch(`/api/listing/user/${currentUser._id}`);
      const listings = await response.json();
      // console.log("The response from the server is : ");
      // console.log(listings)
      setShowListingsLoading(false);
      setListings(listings);
      setShowListings(true);
    } catch (error) {
      setShowListingsLoading(false);
      showListingsError(error.message);
    }
  };
  const handleListingDelete = async (index) => {
    try {
      //getting the id of the listing to be deleted
      const { _id } = Listings.find((_, i) => i === index);
      //updating the listings state that is used to render the user listings
      setListings(Listings.filter((_, i) => i !== index));
      // console.log('The deleted listing id is ' + _id);
      alert(
        "You are about to permanently delete the Listing from the system. Do you want to continue?"
      );
      const res = await fetch(`/api/listing/delete/${currentUser._id}/${_id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("Response from the listing delete api" + data);
    } catch (error) {
      console.log(
        "There was an error while deleting a listing from the server and the error is"
      );
      console.log(error.message);
    }
  };
  const handleAvatarSelection = (e) => {
    try {
      const avatar = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setFile(fileReader.result);
      };
      fileReader.readAsDataURL(avatar);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(formData);
  // console.log(currentUser.avatar);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          placeholder="choose an image"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => handleAvatarSelection(e)}
        />
        <img
          className=" rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 "
          // formData.avatar || currentUser.avatar
          src={formData.avatar ? formData.avatar : currentUser.avatar}
          alt="Profile Picture"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {uploadError && (
            <span className="text-red-700">
              {" "}
              Error Image Upload {uploadError}{" "}
            </span>
          )}
          {isUploading && (
            <span className="text-slate-700">
              Uploading Avatar <Loader />
            </span>
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.password}
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "loading" : "update"}
        </button>
        {/* create listings button */}
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/Create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between m-5">
        <span
          onClick={handleUserDelete}
          className="text-red-700 cursor-pointer"
        >
          {" "}
          delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          {" "}
          sign out
        </span>
      </div>
      {/* show listings button comes up here */}
      <p className="text-red-700 mt-5">
        {/* we display the error itself because we dispatch a message already */}
        {/* {error ? <span>{error}</span> : <></>} */}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccessStatus ? <span>User Successfully Updated !</span> : <></>}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full uppercase"
      >
        {showListingsLoading ? "Loading Listings...." : "Show Listings"}
      </button>
      <p className="text-red-700 mt-5">
        {/* we display the error itself because we dispatch a message already */}
        {showListingsError ? <span>{showListingsError}</span> : <></>}
      </p>
      {/* this is where we render the listings if the user wants to show them */}

      {showListings && Listings.length > 0 ? (
        <div className="flex flex-col gap-4 ">
          <p className="text-center mt-7  text-2xl font-semibold ">
            Your Listings
          </p>
          {Listings.map((listing, index) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  className="text-green-700 uppercase"
                  onClick={() => {
                    navigate(`/Edit-listing/${listing._id}`);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-700 uppercase"
                  onClick={() => handleListingDelete(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
