
import React, { useState } from 'react';
import { NailPolishIcon } from './Icons';

interface LoginPageProps {
    onLogin: (username: string, password: string) => boolean;
    onRegister: (username: string, password: string) => boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginView) {
            onLogin(username, password);
        } else {
            if (password !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }
            if (onRegister(username, password)) {
                // Switch to login view after successful registration
                setIsLoginView(true);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            }
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div className="min-h-screen bg-pink-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="flex justify-center items-center mb-6 space-x-3">
                    <NailPolishIcon className="h-10 w-10 text-pink-500"/>
                    <h1 className="text-3xl font-bold text-pink-800">NailDash</h1>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">{isLoginView ? 'Bem-vinda de volta!' : 'Crie sua conta'}</h2>
                    <p className="text-center text-slate-500 mb-8">{isLoginView ? 'Faça login para acessar seu painel.' : 'Organize sua paixão agora mesmo.'}</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700">Nome de usuário</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                required
                            />
                        </div>
                        {!isLoginView && (
                             <div>
                                <label htmlFor="confirmPassword"className="block text-sm font-medium text-slate-700">Confirmar Senha</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors">
                                {isLoginView ? 'Entrar' : 'Registrar'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-6 text-center text-sm text-slate-500">
                        {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button onClick={toggleView} className="font-medium text-pink-600 hover:text-pink-500 ml-1">
                            {isLoginView ? 'Registre-se' : 'Faça Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
