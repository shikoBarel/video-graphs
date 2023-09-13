import React from 'react';

const VideoUploader = ({ onUpload  }) => {
  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={onUpload } />
    </div>
  );
};


export default VideoUploader;
