import React, { useEffect, useState } from 'react';
import SimpleLineChart from '../components/SimpleLineChart';
import sampleData from '../data/sampleData.json'; // Replace this with your API call
import VideoWithEffects from '../components/VideoEffects'
import VideoUploader from '../components/VideoUploader'; // Import the new component
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // New state for loading
  const [videoUrl, setVideoUrl] = useState(null);  // New state for video URL


  // useEffect(() => {
  //   // Simulate fetching data from an external API
  //   setData(sampleData);
  // }, []);

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    console.log(e);
    const file = e.target.files[0];
    if (!file) return;

    // Step 1: Authenticate and get an API token
    let token;
    let videoId;
    try {
      const authResponse = await axios.post('https://ws.api.video/auth/api-key', {
        apiKey: "8kn11mC7wSnjZavcpdRtaw7p2Wwj1ZdDQyXyRvdUjHI",
      });
      token = authResponse.data.access_token;
    } catch (error) {
      console.error('Error during authentication:', error);
      return;
    }

  // Step 2: Create a video object to get videoId
  try {
    const createVideoResponse = await axios.post(
      'https://ws.api.video/videos',
      { title: "My First Video" },
      {
        auth: {
          username: "8kn11mC7wSnjZavcpdRtaw7p2Wwj1ZdDQyXyRvdUjHI",
          password: ''
        },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    videoId = createVideoResponse.data.videoId;
  } catch (error) {
    setIsLoading(false);  // Set loading to false if request fails
    console.error('Error creating video object:', error);
    return;
  }

  // Step 3: Upload the actual video file
  const formData = new FormData();
  formData.append('file', file);

  try {
    const result = await axios.post(
      `https://ws.api.video/videos/${videoId}/source`,
      formData,
      {
        auth: {
          username: "8kn11mC7wSnjZavcpdRtaw7p2Wwj1ZdDQyXyRvdUjHI",
          password: ''
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

      //here need to update the JSON followin API call to python.
      // // Update your state or perform additional tasks
      // const newData = [{ /* new data based on the uploaded video */ }];
      // setData(newData);

      console.log(result);
      setIsVideoUploaded(true);
      setIsLoading(false);
      setVideoUrl(result.data.assets.mp4);
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
    }


};

return (
  <div>
    <h1>Dashboard</h1>
    {isLoading ? (
      <div>
        <img src="loading.gif" alt="Loading..." />  {/* Display the loading GIF */}
      </div>
    ) : (
      <>
        <VideoUploader onUpload={handleFileUpload}/>
        {isVideoUploaded && <VideoWithEffects data={data} setData={setData} originalData={sampleData} videoUrl={videoUrl}/>}
        <SimpleLineChart data={data} />
      </>
    )}
  </div>
);
};

export default Dashboard;
