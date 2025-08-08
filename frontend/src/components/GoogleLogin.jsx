import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const GoogleLogin = () => {
  const { BACKEND_URL, checkAuthStatus } = useContext(AppContext);
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const isGoogleLoaded = useRef(false);
  const auth2Ref = useRef(null);

  useEffect(() => {
    // Check if Google API script is loaded
    const checkGoogleLoaded = () => {
      if (window.gapi && !isGoogleLoaded.current) {
        initializeGoogleSignIn();
        isGoogleLoaded.current = true;
      } else if (!isGoogleLoaded.current) {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.gapi) return;

    try {
      window.gapi.load('auth2', () => {
        // Initialize the GoogleAuth object
        auth2Ref.current = window.gapi.auth2.init({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          cookiepolicy: 'single_host_origin',
        });

        // Attach signin handler to custom button
        attachSignin(googleButtonRef.current);
      });
    } catch (error) {
      console.error('Google initialization error:', error);
    }
  };

  const attachSignin = (element) => {
    if (!auth2Ref.current || !element) return;

    console.log('Attaching signin to element:', element.id || 'custom-google-btn');
    
    auth2Ref.current.attachClickHandler(element, {},
      // Success callback
      async (googleUser) => {
        console.log('Google user signed in:', googleUser.getBasicProfile().getName());
        await handleGoogleSuccess(googleUser);
      },
      // Error callback
      (error) => {
        console.error('Google signin error:', error);
        toast.error('Google sign-in failed. Please try again.');
      }
    );
  };

  const handleGoogleSuccess = async (googleUser) => {
    try {
      // Get the ID token
      const idToken = googleUser.getAuthResponse().id_token;
      
      const result = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          credential: idToken
        }),
      });

      const data = await result.json();
      console.log('Backend response:', data);

      if (data.success) {
        // Update auth state and redirect
        await checkAuthStatus();
        navigate('/');
      } else {
        toast.error(data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Custom Google Sign-In Button following Google's article structure */}
      <div
        id="customGoogleBtn"
        ref={googleButtonRef}
        className="inline-flex items-center justify-center w-full bg-white text-gray-700 border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group overflow-hidden relative"
        style={{
          minWidth: '280px',
          height: '56px',
          whiteSpace: 'nowrap'
        }}
      >
        {/* Google Icon */}
        <span className="inline-flex items-center justify-center w-12 h-12 mr-4 flex-shrink-0">
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </span>
        
        {/* Button Text - matching article's span structure */}
        <span className="inline-flex items-center font-bold text-base text-gray-700 group-hover:text-gray-900 transition-colors font-roboto">
          Continue with Google
        </span>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
};

export default GoogleLogin;