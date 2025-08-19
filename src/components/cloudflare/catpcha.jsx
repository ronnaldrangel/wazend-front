import React, { useEffect, useState } from 'react';
import { NEXT_PUBLIC_SITE_KEY_CLOUDFLARE } from '../../config/config';

const Recaptcha = ({ onVerify }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Prevent multiple initialization attempts
        if (isLoaded) return;

        const loadTurnstile = () => {
            // Check if Turnstile is available in the window object
            if (window.turnstile) {
                try {
                    // Make sure the container exists before rendering
                    const container = document.getElementById('turnstile-container');
                    if (!container) return;
                    
                    // Explicitly check that the site key is available and valid
                    const siteKey = NEXT_PUBLIC_SITE_KEY_CLOUDFLARE;
                    if (!siteKey) {
                        console.error('Turnstile site key is missing');
                        return;
                    }
                    
                    // Add error handling to the Turnstile render
                    window.turnstile.render('#turnstile-container', {
                        sitekey: siteKey,
                        callback: (token) => {
                            onVerify(token);
                        },
                        'error-callback': (error) => {
                            console.error('Turnstile error:', error);
                            // Optionally reset the widget after a short delay if needed
                            // setTimeout(() => window.turnstile.reset('#turnstile-container'), 2000);
                        },
                        retry: 'auto',        // Can be 'auto' or 'never'
                        'retry-interval': 5000 // Retry every 5 seconds if needed
                    });
                    
                    setIsLoaded(true);
                } catch (error) {
                    console.error('Error rendering Turnstile:', error);
                }
            }
        };

        // Check if script is already loaded
        const scriptExists = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"]');
        
        if (!scriptExists) {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
            script.async = true;
            script.defer = true;
            
            script.onload = loadTurnstile;
            script.onerror = (error) => {
                console.error('Failed to load Turnstile script:', error);
            };
            
            document.head.appendChild(script);
        } else {
            loadTurnstile();
        }

        // Cleanup function
        return () => {
            // Optional: cleanup code if needed when component unmounts
        };
    }, [isLoaded, onVerify]);

    return <div id="turnstile-container"></div>;
};

export default Recaptcha;