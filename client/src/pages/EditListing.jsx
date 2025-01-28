import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
export default function EditListing() {
  //getting the Listing to be edited from the parameters (search parameter)
  const { id } = useParams();
  //getting the current user for the userRef key if needed because I've already tacked it in the server
  const { currentUser } = useSelector((state) => state.user);
  const [listingImages, setListingImages] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [createListingError, setCreateListingError] = useState(null);
  const [createListingLoading, setCreateListingLoading] = useState(false);
  //console.log(listingImages);
  const handleListingImagesUpload = async () => {
    if (Array.from(listingImages).length + formData.imageUrls.length > 0 && Array.from(listingImages).length + formData.imageUrls.length < 6) {
      setImageUploadLoading(true);
      setImageUploadError(null);
      // read the data files of all selected images
      const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => resolve(fileReader.result);
          fileReader.onerror = (error) => reject(error);
          fileReader.readAsDataURL(file);
        });
      };
      //create an array with all read images
      //const listingImagesArray = list
      const listingImagesData = await Promise.all(
        Array.from(listingImages).map((file) => readFileAsDataURL(file))
      );
      //upload all the images to cloudinary
      await Promise.all(
        listingImagesData.map(async (image) => {
          const res = await fetch("/api/cloudinary/listing-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image }),
          });
          const data = await res.json();
          if (!data.success) {
            console.log(data.message);
          }
          console.log("The listing image cloudinary url");
          console.log(data.imageUrl);
          setFormData((prevState) => ({
            ...prevState,
            imageUrls: [data.imageUrl, ...prevState.imageUrls],
          }));
        })
      );
    } else {
      setImageUploadLoading(false);
      setImageUploadError("You can only upload up to 6 images per listing");
    }
    setImageUploadLoading(false);
  };
  //defining the actual store images function
  const handleFormDataChange = (e) => {
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  //For the image upload preview functionality
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleCreateListing = async (e) => {
    //submit buttons usually refresh the page among other unwanted behavior that's why we use the e.preventDefault method
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setImageUploadError("You must upload at least one image");
      //   The plus sign there is to make sure that the data types are numbers in case they might be strings which might be the case for number input types
      if (+formData.regularPrice < +formData.discountedPrice)
        return setImageUploadError(
          "The discounted price has to be lower than the regular price"
        );
      setCreateListingLoading(true);
      setCreateListingError(false);
      const res = await fetch(`/api/listing/update/${formData._id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setCreateListingLoading(false);
        setCreateListingError(data.message);
        return;
      }
      setCreateListingLoading(false);
      console.log("The edited listing is : ");
      console.log(data.listing);
      navigate(`/Listing/${data.listing._id}`);
      console.log(data);
    } catch (error) {
      setCreateListingLoading(false);
      setCreateListingError(error.message);
    }
  };
  //function to load the listing to be edited
  const loadEditedListing = async () => {
    const res = await fetch(`/api/listing/${id}`);
    const data = await res.json();
    // const editedListing = data.find((listing)=>listing._id === id)
    setFormData({ ...formData, ...data });
  };
  //loading the Listings
  useEffect(() => {
    loadEditedListing();
  }, []);
  console.log(formData);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Edit Listing</h1>
      <form
        onSubmit={handleCreateListing}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* The div to render the left hand side elements on the large screen */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handleFormDataChange}
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
            value={formData.name}
          />
          <textarea
            onChange={handleFormDataChange}
            type="text"
            placeholder="Description"
            id="description"
            className="border p-3 rounded-lg"
            required
            value={formData.description}
          />
          <input
            onChange={handleFormDataChange}
            type="text"
            placeholder="Address"
            id="address"
            className="border p-3 rounded-lg"
            required
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleFormDataChange}
                type="checkbox"
                id="type"
                className="w-5 "
                checked={formData.type === "sale"}
                value={"sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormDataChange}
                type="checkbox"
                id="type"
                className="w-5 "
                checked={formData.type === "rent"}
                value={"rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormDataChange}
                type="checkbox"
                id="parking"
                className="w-5 "
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormDataChange}
                type="checkbox"
                id="furnished"
                className="w-5 "
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormDataChange}
                type="checkbox"
                id="offer"
                className="w-5 "
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* div for the beds baths and regular price .. the numbers shit */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={handleFormDataChange}
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-grey-300 rounded-lg "
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleFormDataChange}
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-grey-300 rounded-lg "
                value={formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleFormDataChange}
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-grey-300 rounded-lg "
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center ">
                <p>Regular Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">Tsh/Month</span>
                )}
              </div>
            </div>
            {formData.offer ? (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleFormDataChange}
                  type="number"
                  id="discountedPrice"
                  required
                  className="p-3 border border-grey-300 rounded-lg "
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center ">
                  <p>Discounted Price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">Tsh/Month</span>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* the right div on larger screens  */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold ">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2 ">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              onChange={(e) => setListingImages(e.target.files)}
              multiple
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleListingImagesUpload}
              disabled={Array.from(listingImages).length === 0}
            >
              {imageUploadLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls ? (
            formData.imageUrls.map((imageUrl, index) => {
              return (
                <div
                  key={imageUrl}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={imageUrl}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 "
                  >
                    Delete
                  </button>
                </div>
              );
            })
          ) : (
            <></>
          )}
          <p className="text-red-700 text-sm">
            {createListingError && createListingError}
          </p>
          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={createListingLoading || imageUploadLoading}
          >
            {createListingLoading ? "Editing..." : "Edit Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
