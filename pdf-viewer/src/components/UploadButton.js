import React, { useState } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button'


const UploadButton = ({setFileUrl}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const apiUrl = process.env.REACT_APP_SERVER_URL;

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        
        if(file && file.type !== 'application/pdf'){
            event.target.value = '';
            alert('파일 업로드는 PDF형식으로 제한됩니다.');
            setSelectedFile(null);
        }else{
            setSelectedFile(file);
        }

        console.log(file);
    };

    const uploadFileToServer = (file) => {
        if(file === null){
            alert("'파일 선택'이후 서버로 업로드가 가능합니다.");
            return;
        }

        if(Object.prototype.toString.call(file) === '[object File]'){
            const formData = new FormData();
            formData.append('file',file);

            fetch(apiUrl + "/pdf-file", {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if(response.ok){
                    alert('[성공]파일 업로드 성공')
                    return response.text();
                }else{
                    alert('[실패]파일 업로드 실패')
                }
            })
            .then(fileUrl => {
                if(fileUrl){
                    console.log(fileUrl)
                    setFileUrl(apiUrl + fileUrl)
                }
            })
            .catch(error => {
                console.log(error);
                alert('[에러]파일 업로드 중 에러 발생');
            })

        }else{
            alert("파일이 유효하지 않습니다.");
        }
    }

    return (
        <div>
            <TextField
                type="file"
                inputProps={{accept:"application/pdf"}}
                onChange={handleFileUpload}
                variant="outlined"
            />
            <Button
                onClick={() => uploadFileToServer(selectedFile)}
                variant="contained"
                color="primary"
                style={{ marginTop: '10px' }}
            >
                Upload
            </Button>
        </div>
    );
};

export default UploadButton;