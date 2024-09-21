import React, { useEffect, useRef, useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import Masonry from 'react-masonry-css'
import styles from './LandingPage.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const images = [
  "https://placehold.co/300x400?text=AI+Image+1",
  "https://placehold.co/300x300?text=AI+Image+2",
  "https://placehold.co/300x500?text=AI+Image+3",
  "https://placehold.co/300x350?text=AI+Image+4",
  "https://placehold.co/300x450?text=AI+Image+5",
  "https://placehold.co/300x300?text=AI+Image+6",
  "https://placehold.co/300x400?text=AI+Image+7",
  "https://placehold.co/300x350?text=AI+Image+8",
  "https://placehold.co/300x500?text=AI+Image+9",
  "https://placehold.co/300x300?text=AI+Image+10",
  "https://placehold.co/300x450?text=AI+Image+11",
  "https://placehold.co/300x400?text=AI+Image+12",
]

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [flippedImages, setFlippedImages] = useState<Set<number>>(new Set())
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Smooth scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let scrollPosition = 0

    const scroll = () => {
      scrollPosition += 0.5
      if (scrollPosition >= scrollContainer.scrollHeight / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollTop = scrollPosition
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // Random flip effect
  useEffect(() => {
    const flipInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * images.length)
      setFlippedImages(prev => {
        const newSet = new Set(prev)
        if (newSet.has(randomIndex)) {
          newSet.delete(randomIndex)
        } else {
          newSet.add(randomIndex)
        }
        return newSet
      })
    }, 1000)

    return () => clearInterval(flipInterval)
  }, [])

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post('/api/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Add error handling, e.g., display an error message
    }
  };

  const handleImageClick = (index: number) => {
    setFlippedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleRegister = async () => {
    console.log('Register button clicked');
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      const response = await axios.post('/api/register', { 
        email, 
        password,
        username: email.split('@')[0]
      });
      console.log('Register response:', response.data);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen bg-background">
      {/* Left side: Scrolling Pictures */}
      <div className="lg:col-span-2 p-6 bg-muted overflow-hidden">
        <div 
          ref={scrollRef}
          className="h-[calc(100vh-3rem)] overflow-hidden relative"
          style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}
        >
          <div className="absolute top-0 left-0 w-full">
            <Masonry
              breakpointCols={3}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {[...images, ...images].map((src, index) => {
                const actualIndex = index % images.length
                return (
                  <div 
                    key={index} 
                    className={`mb-4 ${styles.imageContainer}`}
                    onClick={() => handleImageClick(actualIndex)}
                  >
                    <img
                      src={src}
                      alt={`Generated ${actualIndex + 1}`}
                      className={`w-full object-cover rounded-lg shadow-md transition-all duration-1000 cursor-pointer ${flippedImages.has(actualIndex) ? styles.imageFlip : ''}`}
                    />
                  </div>
                )
              })}
            </Masonry>
          </div>
        </div>
      </div>

      {/* Right side: Login */}
      <div className="p-6 flex items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome to AI Picture Pro</h1>
            <p className="text-muted-foreground">Sign in or register to start creating amazing AI-generated pictures</p>
          </div>

          <div className="flex space-x-2 mb-4">
            <Button 
              className={`w-1/2 ${isLogin ? '' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} 
              onClick={() => setIsLogin(true)}
            >
              Log In
            </Button>
            <Button 
              className={`w-1/2 ${!isLogin ? '' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} 
              onClick={() => setIsLogin(false)}
            >
              Register
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={isLogin ? handleLogin : handleRegister}>
              {isLogin ? 'Log In' : 'Register'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}