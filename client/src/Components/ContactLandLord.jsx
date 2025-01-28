import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ContactLandLord(propObject) {
  const { listing } = propObject;
  const [landLoard, setLandLord] = useState(null);
  const [message, setMessge] = useState("");
  const getLandLord = async () => {
    try {
      const res = await fetch(`/api/user/${listing.userRef}`);
      const data = await res.json();
      setLandLord(data.landLord);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLandLord();
  }, []);
  return (
    <>
      {landLoard && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="font-semibold">
              {landLoard.username} about{" "}
              <span className="font-semibold">
                {listing.name.toLowerCase()}
              </span>
            </span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg "
            name="message"
            id="message"
            placeholder="Enter your message"
            rows={2}
            value={message}
            onChange={(e) => setMessge(e.target.value)}
          ></textarea>
          {/* so it looks like that mailto shit when navigated instructs chrome to open up the default mail client in your machine so le't see what this shit is going to do for me  */}
          <Link
            to={`mailto:${landLoard.email}?subject=Regarding${listing.name}&body=${message}`}
            className="uppercase bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95"
          >
            send message
          </Link>
        </div>
      )}
    </>
  );
}
