import React, { useEffect, useRef, useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import Masonry from 'react-masonry-css'
import styles from './LandingPage.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

axios.defaults.withCredentials = true;

interface ImagePair {
  front: string;
  back: string;
}

const images: ImagePair[] = [
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/94c81233-0640-4f54-0f16-55f2e4764600/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/bd699776-b70d-4145-a97e-04d8546fdfb0_4eeaa36a-d983-40b3-99b3-e167ed5045bc.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/e0b25076-a579-4822-2fb0-91345133b200/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/12a9dc19-a639-4889-91f7-bb26431678d5_d2319d8a-b687-4c75-aa5a-bf7a7251c13f.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/eba245e5-4d7d-4f85-46e3-e7ce39dfbb00/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/e43fcc44-572b-493c-b4e1-3cfca10a8fea_372b4ab1-2bff-4634-b88e-911ea2bf7a14.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/8c8eb434-da3d-4b76-9c2e-84449cc08400/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/0b1abc06-fa0e-4d2d-94ec-00f6b86ac9da_caf35b76-2d08-484a-8e74-2a456b0a049c.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/3a50515d-be12-406b-8f7b-d41a7b99b500/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/f13215c2-6eb0-4b9a-9777-5f395665e2e2_a6ed355b-e6cf-4272-87d6-94289efdaeb4.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/a04d4414-1b24-4f5c-e5c2-f3fce6b7df00/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/dc381406-4745-4838-bfb4-0050f7c1d9e5_2d6b89fe-3a54-4e30-951a-e48da24ab6df.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/9590d594-f74a-4b3a-0cbc-1d486b3b0000/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/88927bb8-7811-4cbc-9c6c-93c2de98d109_422b1692-ac5e-4a4a-b547-d441d44e1407.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/94c81233-0640-4f54-0f16-55f2e4764600/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/bd699776-b70d-4145-a97e-04d8546fdfb0_4eeaa36a-d983-40b3-99b3-e167ed5045bc.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/e0b25076-a579-4822-2fb0-91345133b200/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/12a9dc19-a639-4889-91f7-bb26431678d5_d2319d8a-b687-4c75-aa5a-bf7a7251c13f.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/eba245e5-4d7d-4f85-46e3-e7ce39dfbb00/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/e43fcc44-572b-493c-b4e1-3cfca10a8fea_372b4ab1-2bff-4634-b88e-911ea2bf7a14.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/8c8eb434-da3d-4b76-9c2e-84449cc08400/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/0b1abc06-fa0e-4d2d-94ec-00f6b86ac9da_caf35b76-2d08-484a-8e74-2a456b0a049c.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/3a50515d-be12-406b-8f7b-d41a7b99b500/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/f13215c2-6eb0-4b9a-9777-5f395665e2e2_a6ed355b-e6cf-4272-87d6-94289efdaeb4.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/a04d4414-1b24-4f5c-e5c2-f3fce6b7df00/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/dc381406-4745-4838-bfb4-0050f7c1d9e5_2d6b89fe-3a54-4e30-951a-e48da24ab6df.png"
  },
  {
    front: "https://imagedelivery.net/pVlqCQboayhUOfvj_Dt3aw/9590d594-f74a-4b3a-0cbc-1d486b3b0000/public",
    back: "https://app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com/variation-exports/88927bb8-7811-4cbc-9c6c-93c2de98d109_422b1692-ac5e-4a4a-b547-d441d44e1407.png"
  }
];

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [flippedImages, setFlippedImages] = useState<Set<number>>(new Set())
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

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
      setLoginError('');
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post(`${API_BASE_URL}/api/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      navigate('/marketplace');
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setLoginError('email or password is incorrect');
        } else if (error.response.status === 404) {
          setLoginError('user not found');
        } else {
          setLoginError('login failed, please try again later');
        }
      } else {
        setLoginError('login failed, please try again later');
      }
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
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        email,
        password,
        username: email.split('@')[0]
      }, {
        withCredentials: true
      });
      console.log('Register response:', response.data);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      navigate('/marketplace');
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
    <div className="flex flex-col lg:grid lg:grid-cols-3 min-h-screen bg-background">
      {/* Login/Register Section */}
      <div className="order-1 lg:order-2 lg:col-span-1 p-6 flex items-center justify-center">
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
            {loginError && (
              <div className="text-red-500 text-sm">{loginError}</div>
            )}
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

      {/* Scrolling Pictures */}
      <div className="order-2 lg:order-1 lg:col-span-2 p-6 bg-muted overflow-hidden">
        <div 
          ref={scrollRef}
          className="h-[50vh] lg:h-[calc(100vh-3rem)] overflow-hidden relative"
          style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}
        >
          <div className="absolute top-0 left-0 w-full">
            <Masonry
              breakpointCols={3}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {[...images, ...images].map((img, index) => {
                const actualIndex = index % images.length
                return (
                  <div 
                    key={index} 
                    className={`mb-4 ${styles.imageContainer}`}
                    onClick={() => handleImageClick(actualIndex)}
                  >
                    <img
                      src={flippedImages.has(actualIndex) ? img.back : img.front}
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
    </div>
  )
}
