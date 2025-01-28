import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart ,signInSuccess ,signInFailure} from "../Redux/User/UserSlice";
import OAuth from "../Components/OAuth";
export default function SignUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const {loading,error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    dispatch(signInStart());
    try {
      const response = await fetch("/api/authenticate/sign-in", {
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
        // console.log(`The error is : ${data.message}`);
        // setError(data.message);
        dispatch(signInFailure(data.message));
        // setIsLoading(false);
      } else {
        // setFormData({ username: "", email: "", password: "" });
        // setError(null);
        // setIsLoading(false);
        dispatch(signInSuccess(data.user));
        navigate("/");
      }
    } catch (err) {
      // console.log(`The error is : ${error}`);
      // setError(data.message);
      // setIsLoading(false);
      dispatch(signInFailure(err.message));
      //The above line of code more so captures unprecedented error
    }
  };
  // console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        {/* <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg "
          id="username"
          onChange={handleInputChange}
          value={formData.username}
        /> */}
        <input
          type="email"
          placeholder="email/username"
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
          disabled={loading}
        >
          {loading ? "Loading" : "Sign In"}
        </button>
        {/* <OAuth /> */}
        {/* <p className="text-red-400">{error ? error : null}</p> */}
      </form>
      <div className="flex gap-2 mt-5 ">
        {/* putting an appostrophe might cause problems during production  */}
        <p>Dont have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-700 ">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
