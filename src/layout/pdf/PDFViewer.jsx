import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDFViewer = ({ path }) => {
  const [error, setError] = useState(false);

  const handleLoadError = () => {
    // Suppress the error message in the console
    console.clear();
    setError(true);
  };

  return (
    <div style={{ width: '100%', height: '900px' }}>
      {error ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '18px',
            color: 'red',
          }}
        >
          Text Not Found
        </div>
      ) : (
        <Worker workerUrl={`/node_modules/pdfjs-dist/build/pdf.worker.min.js`}>
          <Viewer
            fileUrl={path}
            onDocumentLoadError={handleLoadError} // Attach the error handler
          />
        </Worker>
      )}
    </div>
  );
};

export default PDFViewer;
