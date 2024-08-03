import React, { useState } from 'react';

const UploadButton = () => {
    const [selectedFile, setSelectedFile] = useState(null);

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
            console.log('uploading file to server');
        }else{
            alert("파일이 유효하지 않습니다.");
        }
    }

    return (
        <div>
            <input type="file" accept='.pdf' onChange={handleFileUpload} />
            <button onClick={() => uploadFileToServer(selectedFile)}>Upload</button>
        </div>
    );
};

export default UploadButton;