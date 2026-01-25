import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '../thunks/googleLoginThunk';

export default function GoogleSignInButton({ disabled }) {
  const dispatch = useDispatch();

  return (
    <div
      className={`flex flex-col items-center w-full max-w-full ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) return;
          try {
            await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
          } catch {
            /* error handled in slice */
          }
        }}
        onError={() => {
          /* user closed popup or Google error */
        }}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width={384}
      />
    </div>
  );
}
