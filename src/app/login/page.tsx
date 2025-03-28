'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { useLogin } from '@/context/LoginContext';
import { motion } from "framer-motion"

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(email, data.is_subaccount);
        if (data.has_subscription) {
          router.push('/agents');
        } else {
          router.push('/select-plan');
        }
      } else {
        setError(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 space-y-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EFAWER-7zbnvvhXXEaZJw8ARO6SARUgR4uBFo.png"
              alt="Wavii Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
          <p className="mt-2 text-gray-600">Sign in to your Wavii account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Create Account
              </Link>
            </div>

            <div className="text-sm">
              <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                Forgot your password?
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
            >
              Sign in
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function Login() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error attempting to play video:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Flowing+Neon+Curve+Lines_1-RreOUtWwOjjOZieYwW15alf86D2OYF.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.h2 
          className="text-5xl font-bold text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to Wavii
        </motion.h2>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
