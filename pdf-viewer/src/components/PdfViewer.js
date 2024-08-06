import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { Typography } from "@mui/material";

pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.js";

const PdfViewer = ({url,isOpen, onClose}) => {
    const [pdf, setPdf] = useState(null);
    const [curPage, setCurPage] = useState(1);
    const [isRender, setIsRender] = useState(false);
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const fetchPdf = async () => {
            if (url) {
                const loadingTask = pdfjsLib.getDocument({url});
                try {
                    const pdfInstance = await loadingTask.promise;
                    setPdf(pdfInstance);
                    setCurPage(1);
                } catch (error) {
                    console.error("Error loading PDF:", error);
                }
            }
        };
    
        fetchPdf();
    }, [url]);

    useEffect(() => {
        if (pdf && curPage) {
            renderPdf(pdf, curPage);
        }
    }, [pdf, curPage]);

    const renderPdf = async (pdf, curPage) => {
        if (canvasRef.current && !isRender) {
            setIsRender(true);
            const page = await pdf.getPage(curPage);
            const viewport = page.getViewport({ scale: 1.0 });
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;
            setIsRender(false);
        }
    };

    const nextPage = () => {
        return pdf && curPage < pdf.numPages && setCurPage(curPage + 1);
    }

    const prevPage = () => {
        return pdf && curPage > 1 && setCurPage(curPage - 1);
    }

    return (
        <Dialog open={isOpen === true} onClose={onClose} maxWidth="xl">
          <DialogTitle id="pdfViewerDialogTitle">
            PDF Viewer
            <Button
                    aria-label="close"
                    type="text"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    Close
                </Button>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
            <canvas ref={canvasRef} style={{width: '100%', height:'auto'}}></canvas>
            </DialogContentText>
          </DialogContent>
    
          <DialogActions style={{display:'flex', justifyContent: 'space-around'}}>
            <Button
              onClick={()=>prevPage()}
              color="primary"
            >
              prev
            </Button>
            <Typography variant="body1" color="initial">
               {pdf && `${curPage} / ${pdf.numPages}`} 
            </Typography>
            {/* </Text> */}
            <Button
              onClick={()=>nextPage()}
              color="primary"
            >
              next
            </Button>
          </DialogActions>
        </Dialog>
    );
};

export default PdfViewer;