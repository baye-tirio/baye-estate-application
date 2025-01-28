import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../Components/ListingCard";
export default function HomePage() {
  SwiperCore.use([Navigation]);
  const [offers, setOffers] = useState([]);
  const [sales, setSales] = useState([]);
  const [rents, setRents] = useState([]);
  const fetchHomeListings = async () => {
    try {
      const res = await fetch(
        "/api/listing/search/get-listings?offer=true&limit=4"
      );
      const data = await res.json();
      setOffers(data);
      fetchSales();
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSales = async () => {
    try {
      const res = await fetch(
        "/api/listing/search/get-listings?type=sale&limit=4"
      );
      const data = await res.json();
      setSales(data);
      fetchRents();
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRents = async () => {
    try {
      const res = await fetch(
        "/api/listing/search/get-listings?type=rent&limit=4"
      );
      const data = await res.json();
      setRents(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchHomeListings();
  }, []);
  return (
    <div>
      {/* top part */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Baye Estate is the best place to find your next place to leave
          <br /> We have a wide range of properties for you to choose from{" "}
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's start now
        </Link>
      </div>
      {/* swiper part */}
      <Swiper navigation>
        {offers &&
          offers.length > 0 &&
          offers.map((offer) => (
            <SwiperSlide key={offer._id}>
              <div
                className="h-[500px] "
                style={{
                  background: `url(${offer.imageUrls[0]}}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* results section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10 ">
        {offers && offers.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent Offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {offers.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {sales && sales.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent listings for sale
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more listings for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {sales.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rents && rents.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent listings for rent
              </h2>
              <Link
                to={"/search?type=rent"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more listings for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {rents.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
