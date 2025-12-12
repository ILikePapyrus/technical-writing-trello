import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { createProfileForCurrentUser } from "../profileApi.js";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        async function finishAuth(){
            try {
                // Parse token from URL
                const { data, error: urlError } = await supabase.auth._getSessionFromURL({ storeSession: true });
                if (urlError) throw urlError;

                const { data: sessionData } = await supabase.auth.getSession();
                const session = sessionData?.session ?? null;

                if (!session) {
                    throw new Error("No session after callback!");
                }

                await createProfileForCurrentUser();

                navigate('/board', { replace: true });
            } catch (err) {
                console.error('Auth callback error', err);
                setError(err?.message ?? String(err));
            }
        }

        finishAuth();
    }, [navigate]);

    if (error) {
        return (
            <div style={{ padding: 24 }}>
                <h3>Authentication failed</h3>
                <div style={{ color: 'crimson' }}>{error}</div>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            Finishing sing-in...
        </div>
    )
}