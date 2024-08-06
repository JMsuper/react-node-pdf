import React, { useEffect, useRef, useState } from "react";
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material';

const DoubleArrViewer = ({filePath,isOpen, onClose}) => {
    const [doubleArr, setDoubleArr] = useState([]);
    const apiUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        fetch(apiUrl + "/pdf-parse?path=" + encodeURIComponent(filePath), {
            method: 'GET',
        })
        .then(response => {
            if(response.ok){
                return response.text();
            }else{
                alert('[실패]이중 배열 요청 실패')
            }
        })
        .then(data => {
            if(data){
                const array = JSON.parse(data);
                setDoubleArr(array);
            }
        })
        .catch(error => {
            console.log(error);
        })
    },[filePath])

    return (
        <Dialog open={isOpen === true} onClose={onClose} maxWidth="xl">
          <DialogTitle id="pdfViewerDialogTitle">
            Double Array Viewer
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
            <Grid container spacing={2}>
            {doubleArr.map((outerArray, outerIndex) => (
                <Grid item xs={12} key={outerIndex}>
                    <Grid container spacing={2}>
                        {outerArray.map((innerArray, innerIndex) => (
                            <Grid item xs={6} key={innerIndex}>
                                <div>
                                    {innerArray.map((text, textIndex) => (
                                        <Typography variant="body1" key={textIndex}>
                                            {text}
                                        </Typography>
                                    ))}
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={onClose}
              color="primary"
            >
              close
            </Button>
          </DialogActions>
        </Dialog>
    );
};

export default DoubleArrViewer;