import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import Masonry from 'react-masonry-css';
import {Image as ImageIcon } from "lucide-react";
import AppleButton from "../components/AppleButton";
import AppleInput from "../components/AppleInput";
import { API_BASE_URL } from '../config';
import { Button } from "../components/ui/button";

interface Product {
  id: number;
  prompt?: string;
  product_type?: string;
  product_image_url?: string;
  generated_image_url?: string;
  creator_name?: string;
  created_at?: string;
  name?: string;
  image?: string;
  type?: string;
}

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    personal_link: '',
    follower: 0,
    following: 0,
    like_received: 0,
    joined_date: '',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [generatedProducts, setGeneratedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const allUniqueProducts = useMemo(() => {
    const allProducts = [...likedProducts, ...generatedProducts];
    return Array.from(new Set(allProducts.map(item => item.id)))
      .map(id => allProducts.find(item => item.id === id));
  }, [likedProducts, generatedProducts]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const [userResponse, likedResponse, generatedResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/api/products/user/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/api/products/user/created`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setUserData({
          ...userResponse.data,
          joined_date: userResponse.data.created_at || 'August 2024',
          location: userResponse.data.location || ''
        });
        setLikedProducts(likedResponse.data);
        setGeneratedProducts(generatedResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/users/me`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-start mb-8">
        <Avatar className="w-24 h-24 mr-4">
          <AvatarImage src={userData.personal_link} alt={userData.username} />
          <AvatarFallback>{userData.username ? userData.username.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <AppleButton onClick={() => setIsEditing(true)}>Edit profile</AppleButton>
          </div>
          <p className="text-gray-600 mb-2">{userData.email}</p>
          {userData.bio ? (
            <p className="mb-2">{userData.bio}</p>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="mb-2"
            >
              + Add bio
            </Button>
          )}
          {userData.personal_link && (
            <a 
              href={userData.personal_link.startsWith('http') ? userData.personal_link : `https://${userData.personal_link}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline mb-2 inline-block"
            >
              {userData.personal_link}
            </a>
          )}
          <div className="text-sm text-gray-500">
            <span className="mr-4">📅 Joined {userData.joined_date}</span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</Label>
                <AppleInput
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="personal_link" className="block text-sm font-medium text-gray-700 mb-1">Personal Link</Label>
                <AppleInput
                  id="personal_link"
                  name="personal_link"
                  value={userData.personal_link}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-apple-blue focus:border-apple-blue"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <AppleButton type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</AppleButton>
              <AppleButton type="submit">Save Changes</AppleButton>
            </div>
          </form>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <AppleButton 
              variant={activeTab === 'All' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => setActiveTab('All')}
            >
              All
            </AppleButton>
            <AppleButton 
              variant={activeTab === 'Generated' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => setActiveTab('Generated')}
            >
              Generated
            </AppleButton>
            <AppleButton 
              variant={activeTab === 'Liked' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => setActiveTab('Liked')}
            >
              Liked
            </AppleButton>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="p-6">
            <Masonry
              breakpointCols={{
                default: 4,
                1100: 3,
                700: 2,
                500: 1
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {(activeTab === 'All' 
                ? allUniqueProducts
                : activeTab === 'Generated' ? generatedProducts 
                : likedProducts
              ).filter((item): item is Product => item !== undefined)
              .map((item: Product) => (
                <div key={item.id} className="mb-6 transform transition-all duration-200 hover:scale-105">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="relative group">
                      <img
                        src={item.product_image_url || item.image || item.generated_image_url}
                        alt={item.prompt || item.name || 'Product image'}
                        className="w-full object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mt-1">
                        {item.creator_name || 'Unknown Creator'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown Date'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Profile;
