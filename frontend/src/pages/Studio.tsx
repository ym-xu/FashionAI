import React, { useState } from 'react';
import {ImageIcon } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { uploadToCloudflare } from '../utils/cloudflare';

interface StudioProps {
  onClose: () => void;
}

const styles = [
  "Realistic", "Cartoon", "Anime", "Abstract", "Watercolor", "Oil Painting", "Digital Art", "Sketch"
];

const PlaceholderImage = ({ text, className }: { text: string, className?: string }) => (
  <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
    <div className="text-gray-500 flex flex-col items-center p-4">
      <ImageIcon className="w-12 h-12 mb-2" />
      <span className="text-sm text-center">{text}</span>
    </div>
  </div>
);

type ProductType = 'T-Shirt' | 'Hoodie' | 'Wall Art' | 'Mug' | 'Sweatshirt' | 'Pillow' | 'Tote Bag';

type ProductImages = {
  [key in ProductType]: {
    placeholder: string;
    final: string[];
    mockup_uuid: string;
    smart_object_uuid: string;
  }
};

const productImages: ProductImages = {
  'T-Shirt': {
    placeholder: 'https://placehold.co/300x300?text=T-Shirt+Preview',
    final: ['https://placehold.co/300x300?text=T-Shirt+Front', 'https://placehold.co/300x300?text=T-Shirt+Back'],
    mockup_uuid: '46886c5d-24df-404d-ab7f-478c95ff2708',
    smart_object_uuid: 'bb813c7e-702a-4420-814c-1baa123fd3f8'
  },
  'Hoodie': {
    placeholder: 'https://placehold.co/300x300?text=Hoodie+Preview',
    final: ['https://placehold.co/300x300?text=Hoodie+Front', 'https://placehold.co/300x300?text=Hoodie+Back'],
    mockup_uuid: 'eecd6941-9e79-4b5f-a8f0-84293660a351', // TODO: Add actual UUID for Hoodie
    smart_object_uuid: 'd576fa03-c818-450b-80e4-f054eadfba14' // TODO: Add actual UUID for Hoodie
  },
  'Wall Art': {
    placeholder: 'https://placehold.co/300x300?text=Wall+Art+Preview',
    final: ['https://placehold.co/300x300?text=Wall+Art'],
    mockup_uuid: 'cdfa29b5-ea24-4b9b-ad2f-fcfd714f0e74', // TODO: Add actual UUID for Wall Art
    smart_object_uuid: 'cba0affc-6efd-43b1-9b5a-bdebd0aa7bb5' // TODO: Add actual UUID for Wall Art
  },
  'Mug': {
    placeholder: 'https://placehold.co/300x300?text=Mug+Preview',
    final: ['https://placehold.co/300x300?text=Mug+Front', 'https://placehold.co/300x300?text=Mug+Back'],
    mockup_uuid: '30ab35b2-9cd5-42ea-ba69-203edba05ecd', // TODO: Add actual UUID for Mug
    smart_object_uuid: '52293076-0ac7-4814-8890-763d21a60ee4' // TODO: Add actual UUID for Mug
  },
  'Sweatshirt': {
    placeholder: 'https://placehold.co/300x300?text=Sweatshirt+Preview',
    final: ['https://placehold.co/300x300?text=Sweatshirt+Front', 'https://placehold.co/300x300?text=Sweatshirt+Back'],
    mockup_uuid: 'b1051cf9-fcc0-4608-ae56-39fd653b7624', // TODO: Add actual UUID for Sweatshirt
    smart_object_uuid: 'd6bf7c2c-6e78-424f-8e7a-7225599c4e78' // TODO: Add actual UUID for Sweatshirt
  },
  'Pillow': {
    placeholder: 'https://placehold.co/300x300?text=Pillow+Preview',
    final: ['https://placehold.co/300x300?text=Pillow+Front', 'https://placehold.co/300x300?text=Pillow+Back'],
    mockup_uuid: '00001ebe-0ff5-431e-bc36-ad9162af9f2e', // TODO: Add actual UUID for Pillow
    smart_object_uuid: 'ee4e3666-7ead-488f-a6d2-07015d741104' // TODO: Add actual UUID for Pillow
  },
  'Tote Bag': {
    placeholder: 'https://placehold.co/300x300?text=Tote+Bag+Preview',
    final: ['https://placehold.co/300x300?text=Tote+Bag+Front', 'https://placehold.co/300x300?text=Tote+Bag+Back'],
    mockup_uuid: '1fa458ea-658c-4cf0-8c5b-44cff9641734', // TODO: Add actual UUID for Tote Bag
    smart_object_uuid: '9fe1699b-06ba-4da7-a59c-d7ff375c93e4' // TODO: Add actual UUID for Tote Bag
  }
};

const generateProductImage = async (productType: ProductType, imageBlob: Blob, user: string, prompt: string, style: string) => {
  const maxRetries = 3;
  let retries = 0;

  // Upload image to Cloudflare Images and get URL
  const cloudflareImageUrl = await uploadToCloudflare(imageBlob);

  const { mockup_uuid, smart_object_uuid } = productImages[productType];

  // Check if the product type is implemented
  if (!mockup_uuid || !smart_object_uuid) {
    throw new Error(`Product type ${productType} is not yet implemented`);
  }

  const data = {
    mockup_uuid: mockup_uuid,
    smart_objects: [
      {
        uuid: smart_object_uuid,
        asset: {
          url: cloudflareImageUrl
        }
      }
    ],
    metadata: {
      user: user,
      prompt: prompt,
      style: style,
      productType: productType
    }
  };

  while (retries < maxRetries) {
    try {
      console.log(`Attempt ${retries + 1}: Sending request to backend API...`);
      console.log('Cloudflare image URL:', cloudflareImageUrl);
      console.log('Product type:', productType);
      console.log('Request data:', JSON.stringify(data, null, 2));

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/products/generate-product-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Received response from backend API:', JSON.stringify(responseData, null, 2));
      
      if (responseData.success && responseData.data && responseData.data.export_path) {
        return [responseData.data.export_path]; // Return as an array to maintain consistency
      } else {
        console.error('API response does not contain the expected data. Response:', responseData);
        throw new Error('API response does not contain the expected data');
      }
    } catch (error) {
      console.log(`Attempt ${retries + 1} failed:`, error);
      retries++;
      if (retries >= maxRetries) {
        throw new Error(`Failed to generate product image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      console.log(`Waiting ${2 ** retries} seconds before retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2 ** retries * 1000));
    }
  }
  throw new Error('Maximum retry count reached');
};

const Studio: React.FC<StudioProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; selected: boolean }>>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [finalProducts, setFinalProducts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedImages, setHasGeneratedImages] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const handleGenerateImages = async () => {
    if (!prompt || !selectedStyle) {
      alert('Please enter a prompt and select a style before generating images.');
      return;
    }

    setIsGenerating(true);
    const imagesToGenerate = 2;
    const newGeneratedImages: Array<{ url: string; selected: boolean }> = [];

    try {
      for (let i = 0; i < imagesToGenerate; i++) {
        console.log(`Sending request to Worker... (Image ${i + 1}/${imagesToGenerate})`);
        const response = await fetch('https://divine-tree-dee6.yiming-xu96.workers.dev', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            style: selectedStyle
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Server responded with ${response.status}: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        newGeneratedImages.push({ url: imageUrl, selected: false });
      }

      setGeneratedImages(newGeneratedImages);
      setHasGeneratedImages(true);
    } catch (error) {
      console.error('Error generating images:', error);
      alert(`Failed to generate images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateProduct = async () => {
    if (selectedProduct && generatedImages.length > 0) {
      setIsCreatingProduct(true);
      try {
        console.log('Starting product creation...');
        const selectedImage = generatedImages.find(img => img.selected);
        if (!selectedImage) {
          throw new Error('No image selected');
        }

        // Check if the product type is implemented
        const { mockup_uuid, smart_object_uuid } = productImages[selectedProduct];
        if (!mockup_uuid || !smart_object_uuid) {
          throw new Error(`Product type ${selectedProduct} is not yet implemented`);
        }

        // Fetch the image as a blob
        const response = await fetch(selectedImage.url);
        const imageBlob = await response.blob();

        const productImageUrls = await generateProductImage(selectedProduct, imageBlob, 'currentUser', prompt, selectedStyle);
        console.log('Product image generated successfully:', productImageUrls);
        setFinalProducts(productImageUrls);

      } catch (error) {
        console.error('Error creating product:', error);
        if (error instanceof Error) {
          alert(`Failed to create product: ${error.message}`);
        } else {
          alert('Failed to create product. Please try again.');
        }
      } finally {
        setIsCreatingProduct(false);
      }
    } else {
      alert('Please select a product type and a generated image.');
    }
  };

  const handlePublish = async () => {
    try {
      if (!selectedProduct || finalProducts.length === 0) {
        throw new Error('No product created yet');
      }

      const selectedImage = generatedImages.find(img => img.selected);
      if (!selectedImage) {
        throw new Error('No image selected');
      }

      const response = await fetch(selectedImage.url);
      const imageBlob = await response.blob();

      const cloudflareImageUrl = await uploadToCloudflare(imageBlob);

      const productData = {
        prompt: prompt,
        product_type: selectedProduct,
        generated_image_url: cloudflareImageUrl,
        product_image_url: finalProducts[0]
      };

      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to publish a product.');
        return;
      }

      const saveResponse = await fetch('/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!saveResponse.ok) {
        if (saveResponse.status === 403) {
          alert('Your session has expired. Please log in again.');
          // 这里应该添加重定向到登录页面的逻辑
          return;
        }
        throw new Error(`Failed to save product to database: ${saveResponse.statusText}`);
      }

      console.log('Product saved successfully');
      alert('Product published to marketplace successfully!');
      onClose();
    } catch (error) {
      console.error('Error publishing product:', error);
      if (error instanceof Error) {
        alert(`Failed to publish product: ${error.message}`);
      } else {
        alert('Failed to publish product. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-5/6 h-5/6 shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-gray-100 p-3 flex items-center border-b border-gray-200">
          <div className="flex space-x-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></button>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h2 className="text-center flex-grow font-semibold text-lg text-gray-700">Studio</h2>
        </div>
        <div className="flex-grow flex p-6 space-x-6 overflow-hidden bg-gray-50">
          <div className="w-2/5 flex flex-col space-y-4 overflow-y-auto pr-4">
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="style">Style</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {styles.map((style) => (
                  <Button
                    key={style}
                    variant={selectedStyle === style ? "default" : "outline"}
                    onClick={() => setSelectedStyle(style)}
                    className={`text-xs ${selectedStyle === style ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'} hover:bg-blue-600 hover:text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300`}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleGenerateImages}
              disabled={isGenerating}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              {isGenerating ? 'Generating...' : 'Generate Images'}
            </Button>
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image.url} 
                    alt={`Generated ${index + 1}`} 
                    className={`w-full h-40 object-cover rounded-lg ${image.selected ? 'border-4 border-blue-500' : ''}`} 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 rounded-lg">
                    <Button 
                      variant="secondary" 
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => {
                        const updatedImages = generatedImages.map((img, i) => ({
                          ...img,
                          selected: i === index ? !img.selected : false
                        }));
                        setGeneratedImages(updatedImages);
                      }}
                    >
                      {image.selected ? 'Deselect' : 'Select'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-3/5 flex flex-col space-y-4">
            <div>
              <Label htmlFor="product">Select Product</Label>
              <div className="flex space-x-2 mt-1">
                {(Object.keys(productImages) as ProductType[]).map((product) => (
                  <Button
                    key={product}
                    variant={selectedProduct === product ? "default" : "outline"}
                    onClick={() => {
                      if (hasGeneratedImages) {
                        setSelectedProduct(product);
                        setFinalProducts([]);
                      } else {
                        // Show a reminder to generate images first
                        alert("Please generate images first before selecting a product.");
                      }
                    }}
                    disabled={!hasGeneratedImages}
                    className={`text-xs ${selectedProduct === product ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'} hover:bg-blue-600 hover:text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300`}
                  >
                    {product}
                  </Button>
                ))}
              </div>
            </div>
            {selectedProduct && hasGeneratedImages && (
              <div className="flex-grow flex flex-col">
                <div className="flex-grow relative">
                  {finalProducts.length > 0 ? (
                    <div className="absolute inset-0 grid grid-cols-2 gap-4">
                      {finalProducts.map((product, index) => (
                        <img key={index} src={product} alt={`Final Product ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <PlaceholderImage text={`${selectedProduct} Preview`} className="absolute inset-0 rounded-lg" />
                  )}
                </div>
                <div className="mt-4">
                  {finalProducts.length > 0 ? (
                    <Button
                      onClick={handlePublish}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                    >
                      Publish to Marketplace
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreateProduct}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                      disabled={isCreatingProduct}
                    >
                      {isCreatingProduct ? 'Creating...' : 'Create Product'}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {!hasGeneratedImages && (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-gray-500 text-center">Generate images on the left to start creating products</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;