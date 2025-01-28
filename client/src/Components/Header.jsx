import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
//somewhat used when trying to access the global state ... not comfortable with it just yet but we gon get there
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
export default function Header() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmit = (e) => {
    //so that we don't reload the page and other unnecessary stuff
    e.preventDefault();
    //getting the search parameters ... althought we could use react router dom for this but let's continue
    const urlParams = new URLSearchParams(window.location.search);
    //setting the search query parameter
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  //to set the search input value if the searchTerm in the url changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearchTerm = urlParams.get("searchTerm");
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500"> Baye </span>
            <span className="text-slate-700"> Estate </span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex justify-between items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            {" "}
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/About">
            {" "}
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          {currentUser ? (
            <Link to="/profile">
              <img
                className="rounded-full h-7 w-7 object-cover "
                src={currentUser.avatar}
                alt="profile"
              />
            </Link>
          ) : (
            <Link to="/Sign-in">
              <li className="sm:inline text-slate-700 hover:underline">
                Sign In
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
