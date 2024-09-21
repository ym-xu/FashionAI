import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import Masonry from 'react-masonry-css';
import { Heart, Image as ImageIcon } from "lucide-react";
import AppleButton from "../components/AppleButton";
import AppleInput from "../components/AppleInput";

const mockFavoriteProducts = [
  { id: 1, name: "Product 1", image: "https://placehold.co/300x300?text=Product+1", type: "Favorite" },
  { id: 2, name: "Product 2", image: "https://placehold.co/300x300?text=Product+2", type: "Favorite" },
  { id: 3, name: "Product 3", image: "https://placehold.co/300x300?text=Product+3", type: "Favorite" },
];

const mockGeneratedImages = [
  { id: 1, name: "Generated 1", image: "https://placehold.co/300x300?text=Generated+1", type: "Generated" },
  { id: 2, name: "Generated 2", image: "https://placehold.co/300x300?text=Generated+2", type: "Generated" },
  { id: 3, name: "Generated 3", image: "https://placehold.co/300x300?text=Generated+3", type: "Generated" },
];

const PlaceholderImage = ({ text, className }: { text: string, className?: string }) => (
  <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
    <div className="text-gray-500 flex flex-col items-center p-4">
      <ImageIcon className="w-12 h-12 mb-2" />
      <span className="text-sm text-center">{text}</span>
    </div>
  </div>
);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData({
          ...response.data,
          joined_date: response.data.joined_date || 'August 2024',
          location: response.data.location || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
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
      await axios.put('/api/users/me', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-start mb-8">
        <Avatar className="w-24 h-24 mr-4">
          <AvatarImage src={userData.personal_link} alt={userData.username} />
          <AvatarFallback>{userData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <AppleButton onClick={() => setIsEditing(true)}>Edit profile</AppleButton>
          </div>
          <p className="text-gray-600 mb-2">{userData.email}</p>
          <p className="mb-2">{userData.bio || '+ Add bio'}</p>
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
          <Masonry
            breakpointCols={{
              default: 3,
              1100: 2,
              700: 1
            }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {(activeTab === 'All' ? [...mockFavoriteProducts, ...mockGeneratedImages] :
              activeTab === 'Generated' ? mockGeneratedImages :
              mockFavoriteProducts).map((item) => (
              <div key={item.id} className="mb-4">
                <div className="relative group">
                  {item.image.startsWith('http') ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full object-cover rounded-lg"
                    />
                  ) : (
                    <PlaceholderImage text={item.name} className="w-full rounded-lg" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <AppleButton className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" variant="secondary">
                      <Heart className="mr-2 h-4 w-4" /> Like
                    </AppleButton>
                  </div>
                </div>
                <h3 className="font-semibold mt-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.type}</p>
              </div>
            ))}
          </Masonry>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Profile;
