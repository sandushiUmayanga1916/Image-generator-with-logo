import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ImageGenerator() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedStory, setGeneratedStory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://gen.enfection.com/generate-story-and-image', formData, {
        responseType: 'json',
      });

      setGeneratedStory(response.data.story);
      setGeneratedImage(`data:image/jpeg;base64,${response.data.image}`);
    } catch (error) {
      console.error('Error generating story and image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Upload an Image</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={handleFileChange} className="input" />
        <button type="submit" disabled={!selectedFile || loading} className="button">
          {loading ? 'Generating...' : 'Generate Image with Logo'}
        </button>
      </form>

      {uploadedImage && (
        <div className="imageContainer">
          <h2>Uploaded Image</h2>
          <img src={uploadedImage} alt="Uploaded" className="image" />
        </div>
      )}

      {generatedStory && (
        <div className="storyContainer">
          <h2>Generated Story</h2>
          <p>{generatedStory}</p>
        </div>
      )}

      {generatedImage && (
        <div className="imageContainer">
          <h2>Generated Image with Logo</h2>
          <img src={generatedImage} alt="Generated with DALL·E and Logo" className="image" />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;