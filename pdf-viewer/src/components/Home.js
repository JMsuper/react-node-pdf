import React, { useState } from 'react';
import UploadButton from './UploadButton';
import PdfViewer from './PdfViewer';
import Button from '@mui/material/Button'

const Home = () => {
    const [fileUrl, setFileUrl] = useState(null);
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

    const openPdfViewer = () => {
        setPdfViewerOpen(true);
    }

    const closePdfViewer = () => {
        setPdfViewerOpen(false);
    }

    return (
        <div>
            <h1>Welcome to the Homepage!</h1>
            <UploadButton setFileUrl={setFileUrl}/>
            <Button variant="outlined" color="primary" onClick={openPdfViewer} disabled={!fileUrl}>
              PDF Viewer Open
            </Button>
            {pdfViewerOpen && <PdfViewer url={fileUrl} isOpen={pdfViewerOpen} onClose={closePdfViewer}/>}
            
        </div>
    );
};

export default Home;