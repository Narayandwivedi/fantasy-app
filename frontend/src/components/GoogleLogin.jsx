import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const GoogleLogin = () => {
  const { BACKEND_URL, checkAuthStatus } = useContext(AppContext);
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const isGoogleLoaded = useRef(false);

  useEffect(() => {
    // Check if Google script is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts && !isGoogleLoaded.current) {
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
    if (!window.google) {
      console.error('Google SDK not loaded');
      return;
    }

    try {
      
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });


      // Render the Google button
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: '280',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'center'
          }
        );
      }
    } catch (error) {
      console.error('Google initialization error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        domain: window.location.origin
      });
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      
      // Get referral code from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');
      
      const result = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          credential: response.credential,
          referedBy: referralCode // Add referral code to request
        }),
      });


      const data = await result.json();

      if (data.success) {
        // Update auth state and redirect
        await checkAuthStatus();
        navigate('/');
      } else {
        console.error('Backend login failed:', data.message);
        toast.error(data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        backendUrl: BACKEND_URL
      });
      toast.error('Google login failed. Please try again.');
    }
  };

  const handleManualClick = () => {
    if (window.google && window.google.accounts) {
      // Trigger Google One Tap or popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If one-tap is not available, try popup
        }
      });
    } else {
      toast.error('Google Sign-In is not loaded. Please refresh and try again.');
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      {/* Custom styled button that will be replaced by Google */}
      <div 
        ref={googleButtonRef}
        className="w-full flex justify-center"
        style={{ minHeight: '44px' }}
      >
        {/* Fallback button if Google doesn't load */}
        <button
          onClick={handleManualClick}
          className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 border border-gray-300 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default GoogleLogin;