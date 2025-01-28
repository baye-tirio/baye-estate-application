import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../Components/ListingCard";
export default function Search() {
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    searchTerm: "",
    offer: false,
    parking: false,
    furnished: false,
    type: "all",
    sort: "createdAt",
    order: "desc",
  });
  const handleChange = (e) => {
    const searchParameters = new URLSearchParams(window.location.search);
    if (e.target.id === "searchTerm") {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    if (e.target.type === "checkbox") {
      if (
        e.target.id === "rent" ||
        e.target.id === "sale" ||
        e.target.id === "all"
      ) {
        setFormData({ ...formData, type: e.target.id });
        searchParameters.set("type", e.target.id);
        navigate(`/search?${searchParameters}`);
      } else {
        setFormData({
          ...formData,
          [e.target.id]:
            e.target.checked || e.target.checked === "true" ? true : false,
        });
        searchParameters.set(e.target.id, e.target.checked);
        navigate(`/search?${searchParameters}`);
      }
    }
    //let's handle the select input
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setFormData({ ...formData, sort, order });
      searchParameters.set("sort", sort);
      searchParameters.set("order", order);
      navigate(`/search?${searchParameters}`);
    }
  };
  const handleSubmit = (e) => {
    //we don't want a page reload
    e.preventDefault();
    //We wanna be able to modify the search parameters in the url so stay with me on this one type shit.
    const urlParams = new URLSearchParams(window.location.search);
    if (formData.searchTerm) urlParams.set("searchTerm", formData.searchTerm);
    if (formData.type) urlParams.set("type", formData.type);
    if (formData.offer) urlParams.set("offer", formData.offer);
    if (formData.parking) urlParams.set("parking", formData.parking);
    if (formData.furnished) urlParams.set("furnished", formData.furnished);
    if (formData.sort) urlParams.set("sort", formData.sort);
    if (formData.order) urlParams.set("order", formData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const fetchListings = async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams(window.location.search);
      const res = await fetch(
        `/api/listing/search/get-listings?${searchParams.toString()}`
      );
      const data = await res.json();
      if (data.length > 8) setShowMore(true);
      else setShowMore(false);
      setListings(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // The ability to change the search options from the url
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    console.log(searchParams.get("searchTerm"));
    setFormData({
      ...formData,
      searchTerm: searchParams.get("searchTerm")
        ? searchParams.get("searchTerm")
        : formData.searchTerm,
      type: searchParams.get("type") ? searchParams.get("type") : formData.type,
      offer: searchParams.get("offer")
        ? JSON.parse(searchParams.get("offer"))
        : formData.offer,
      parking: searchParams.get("parking")
        ? JSON.parse(searchParams.get("parking"))
        : formData.parking,
      furnished: searchParams.get("furnished")
        ? JSON.parse(searchParams.get("furnished"))
        : formData.furnished,
      sort: searchParams.get("sort") ? searchParams.get("sort") : formData.sort,
      order: searchParams.get("order")
        ? searchParams.get("order")
        : formData.order,
    });
    //fetching the listings
    fetchListings();
  }, [location.search]);
  console.log(listings);
    const handleShowMore = async () => {
    const listingsCount = listings.length;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("startIndex", listingsCount);
    const res = await fetch(
      `api/listing/search/get-listings?${searchParams.toString()}`
    );
    console.log(`api/listing/search/get-listings?${searchParams.toString()}`);
    const data = await res.json();
    console.log("The new listings fetched are : ");
    console.log(data);
    if(data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              type="text"
              className="border rounded-lg p-3 w-full"
              id="searchTerm"
              placeholder="Search..."
              onChange={handleChange}
              value={formData.searchTerm}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2 ">
              <input
                checked={formData.type === "all"}
                type="checkbox"
                className="w-5"
                id="all"
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                checked={formData.type === "rent"}
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                checked={formData.type === "sale"}
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                checked={formData.offer}
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2 ">
              <input
                checked={formData.parking}
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 ">
              <input
                checked={formData.furnished}
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              default="createdAt_desc"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="uppercase bg-slate-700 hover:opacity-95 text-white p-3 rounded-lg ">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5 ">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4 ">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700"> No listing found! </p>
          )}
          {loading && (
            <p className="text-xl text-slate-700  text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <div key={listing._id}>
                <ListingCard listing={listing} />
              </div>
            ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
