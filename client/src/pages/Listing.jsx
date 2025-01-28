import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/swiper-bundle.css";
import ContactLandLord from "../Components/ContactLandLord";
import { FaBath, FaParking, FaBed, FaChair, FaShare ,FaMapMarkerAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
export default function Listing() {
  //To check whether the user has been signed in because this page can be accessed even by users who are not signed into the system
  const { currentUser } = useSelector((state) => state.user);
  //Let's play around the swipper package and see how it helps us in our project.
  //Swiper is a package you could utilize to create the sliding images effect you gon see once this shit gets done.
  SwiperCore.use([Navigation]);
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contactLandLord, setContactLandLord] = useState(false);
  const [listing, setListing] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  //function to load the listing to be edited
  const loadListing = async () => {
    try {
      setError(false);
      setLoading(true);
      const res = await fetch(`/api/listing/${id}`);
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setListing({ ...listing, ...data });
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    }
  };
  //loading the Listings once the component has been rendered for the first time.
  useEffect(() => {
    loadListing();
  }, []);
  console.log(listing);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl "> Loading... </p>}
      {error && <p className="text-center my-7 text-2xl "> {error} </p>}
      {listing && !loading && !error && (
        // <h1 className="text-center my-7 text-2xl "> {listing.name}</h1>
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px] "
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* rendering the share icon */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link Copied !
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - {"Tsh "}
              {listing.discountedPrice ? (
                <span>{listing.discountedPrice.toLocaleString("en-US")}</span>
              ) : (
                <span>{listing.regularPrice.toLocaleString("en-US")}</span>
              )}
              {""}
              {listing.type === "rent" && "/Month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              {/* icon itakaa apa */}
              <FaMapMarkerAlt className="text-lg" />

              {listing.address}
            </p>
            <div className="flex gap-4 ">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md ">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md ">
                  Tsh{" "}
                  {(
                    +listing.regularPrice - +listing.discountedPrice
                  ).toLocaleString("en-US")}{" "}
                  discount
                </p>
              )}
            </div>
            <p className="text-slate-700">
              {" "}
              <span className="font-semibold text-black ">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex item-center gap-1 whitespace-nowrap ">
                {/* render the bed icon first */}
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} bedrooms`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex item-center gap-1 whitespace-nowrap">
                {/* render the bathroom icon first */}
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bedrooms`
                  : `${listing.bathrooms} bed`}
              </li>
              <li className="flex item-center gap-1 whitespace-nowrap">
                {/* render the furniture icon first */}
                <FaChair className="text-lg" />
                {listing.furnished ? `Furnished` : `Not Furnished`}
              </li>
              <li className="flex item-center gap-1 whitespace-nowrap">
                {/* render the parking icon first */}
                <FaParking className="text-lg" />
                {listing.parking ? `Parking Available` : `No Parking`}
              </li>
            </ul>
            {currentUser &&
            currentUser._id !== listing.userRef &&
            !contactLandLord ? (
              <button
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                onClick={() => setContactLandLord(true)}
              >
                Contact the Land Lord
              </button>
            ) : (
              <></>
            )}
            {contactLandLord && <ContactLandLord listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
