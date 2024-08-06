import React, { useState } from 'react';
import UploadButton from './UploadButton';
import PdfViewer from './PdfViewer';
import Button from '@mui/material/Button'
import DoubleArrViewer from './DoubleArrViewer';

const Home = () => {
    const [filePath, setFilePath] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
    const [doubleArrViewerOpen, setDoubleArrViewerOpen] = useState(false);

    const openPdfViewer = () => {
        setPdfViewerOpen(true);
    }

    const closePdfViewer = () => {
        setPdfViewerOpen(false);
    }

    const openDoubleArrViewer = () => {
        setDoubleArrViewerOpen(true);
    }

    const closeDoubleArrViewer = () => {
        setDoubleArrViewerOpen(false);
    }

    return (
        <div>
            <h1>PDF 뷰잉 및 이중 배열 추출</h1>
            <UploadButton setFilePath={setFilePath} setFileUrl={setFileUrl}/>
            <Button variant="outlined" color="primary" onClick={openPdfViewer} disabled={fileUrl === null || fileUrl === undefined}>
              PDF Viewer Open
            </Button>
            <Button variant="outlined" color="primary" onClick={openDoubleArrViewer} disabled={filePath === null || filePath === undefined}>
              Double Array Viewer Open
            </Button>
            {pdfViewerOpen && <PdfViewer url={fileUrl} isOpen={pdfViewerOpen} onClose={closePdfViewer}/>}
            {doubleArrViewerOpen && <DoubleArrViewer filePath={filePath} isOpen={doubleArrViewerOpen} onClose={closeDoubleArrViewer}/>}
        </div>
    );
};

export default Home;