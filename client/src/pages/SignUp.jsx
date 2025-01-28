import { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import OAuth from "../Components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/authenticate/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(`The response from the server is `);
      console.log(data);
      // In case an error is encountered when signing into the platform.
      if (data.success === false) {
        console.log(`The error is : ${data.message}`);
        setError(data.message);
        setIsLoading(false);
      } else {
        setFormData({ username: "", email: "", password: "" });
        setError(null);
        setIsLoading(false);
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(`The error is : ${error}`);
      setError(data.message);
      setIsLoading(false);
    }
  };
  // console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg "
          id="username"
          onChange={handleInputChange}
          value={formData.username}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg "
          id="email"
          onChange={handleInputChange}
          value={formData.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg "
          id="password"
          onChange={handleInputChange}
          value={formData.password}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={isLoading}
        >
          {isLoading ? "Loading" : "Sign Up"}
        </button>
        <OAuth />
        <p className="text-red-400">{error ? error : null}</p>
      </form>
      <div className="flex gap-2 mt-5 ">
        <p>Have an account already ? </p>
        <Link to="/sign-in">
          <span className="text-blue-700 ">Sign In</span>
        </Link>
      </div>
    </div>
  );
}
