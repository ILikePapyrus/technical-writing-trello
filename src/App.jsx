import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Board from './components/Board';
import AuthCallback from './pages/AuthCallback';
import '/src/App.css';

export default function App() {
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        async function check() {
            const { data } = await supabase.auth.getSession();
            setAuthed(Boolean(data?.session));
        }
        check();
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthed(Boolean(session));
        });
        return () => sub?.subscription?.unsubscribe?.();
    }, []);

    return (
        <div>
            <header className="app-header">
                <h1>Mini Trello — Tablero</h1>
            </header>
            <main>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/board" element={authed ? <Board /> : <Navigate to="/login" replace />} />
                    <Route path="/" element={<Navigate to={authed ? '/board' : '/login'} replace />} />
                </Routes>
            </main>
        </div>
    );
}
