import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../Redux/User/UserSlice';
import { useNavigate } from 'react-router-dom';
export default function OAuth () {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick =  async () => {
 try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app)
    const result = await signInWithPopup(auth,provider);
    // console.log(result);
    const res = await fetch('api/authenticate/google',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            },
        body:JSON.stringify({
            name:result.user.displayName,
            email:result.user.email,
            photo:result.user.photoURL
        })
    })
    const data = await res.json();
    // console.log(data);
    dispatch(signInSuccess(data.user));
    navigate('/');
 } catch (error) {
    console.log('Could not sign in with google',error);
 }
    }
    return (
        <button 
        onClick={handleGoogleClick}
        type="button"
        className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 ">
            Continue with Google
        </button>
    )
}