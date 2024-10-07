'use client'

import { useState, useEffect, useCallback, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import Masonry from 'react-masonry-css'
import { Button } from "../components/ui/button"
import { ScrollArea } from "../components/ui/scroll-area"
import {
  Heart,
  Image as ImageIcon,
} from "lucide-react"
import { Input } from "../components/ui/input"
import { cn } from "../lib/utils"
import axios from 'axios';

interface Product {
  id: number;
  prompt: string;
  product_type: string;
  generated_image_url: string;
  product_image_url: string;
  creator_name: string;
  created_at: string;
}

// const PlaceholderImage = ({ text, className }: { text: string, className?: string }) => (
//   <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
//     <div className="text-gray-500 flex flex-col items-center p-4">
//       <ImageIcon className="w-12 h-12 mb-2" />
//       <span className="text-sm text-center">{text}</span>
//     </div>
//   </div>
// )

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState("All")
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const { ref, inView } = useInView({
    threshold: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<Product[]>('http://localhost:8000/api/products/', {
          params: {
            search: searchTerm
          }
        });
        setProducts(response.data);
        setVisibleProducts(response.data.slice(0, 20));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const loadMoreProducts = useCallback(() => {
    setVisibleProducts(prev => {
      const currentLength = prev.length;
      return [...prev, ...products.slice(currentLength, currentLength + 20)];
    });
  }, [products]);

  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView, loadMoreProducts]);

  console.log('Selected type:', selectedType);
  console.log('Visible products:', visibleProducts);
  const filteredProducts = useMemo(() => {
    return visibleProducts.filter(product => 
      selectedType === "All" || product.product_type.toLowerCase() === selectedType.toLowerCase()
    );
  }, [visibleProducts, selectedType]);
  console.log('Filtered products:', filteredProducts);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const productTypes = ["All", "T-Shirt", "Hoodie", "Wall Art", "Mug", "Sweatshirt", "Pillow", "Tote Bag"];

  const handleLike = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to like a product');
        return;
      }
      const response = await axios.post(
        'http://localhost:8000/api/products/like',
        { product_id: productId },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Product liked successfully', response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error liking product:', error.response.data);
        alert(error.response.data.detail || 'An error occurred while liking the product');
      } else {
        console.error('Error liking product:', error);
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Marketplace</h1>
        
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/3">
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <div className="flex-grow overflow-x-auto">
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
              {productTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "px-4 py-2 text-sm rounded-full transition-all duration-200 whitespace-nowrap",
                    selectedType === type
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-6">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: Product) => (
                <div key={product.id} className="mb-6 transform transition-all duration-200 hover:scale-105">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="relative group">
                      <img
                        src={product.product_image_url}
                        alt={product.prompt}
                        className="w-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                        <Button 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                          variant="secondary"
                          onClick={() => handleLike(product.id)}
                        >
                          <Heart className="mr-2 h-4 w-4" /> Like
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      {/* <h3 className="font-semibold text-lg text-gray-800">{product.prompt}</h3> */}
                      <p className="text-sm text-gray-600 mt-1">{product.creator_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(product.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No products found</div>
            )}
          </Masonry>
          <div ref={ref} className="h-10" />
        </div>
      </ScrollArea>
    </div>
  )
}