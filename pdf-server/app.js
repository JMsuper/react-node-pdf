const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const PdfParser = require('./pdfParser');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*'
}));

// 파일 저장 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const currentTime = Date.now();
        
        console.log(file.originalname);

        const encodedFileName = Buffer.from(file.originalname,'latin1').toString('utf8');

        // 공백 및 경로에 혼동을 줄 수 있는 문자들을 밑줄로 대체
        const parsedFileName = encodedFileName.replace(/[\s\/\\\?\%\*\:\|\<\>]/g, "_");
        
        cb(null,"[" + currentTime + "]" + parsedFileName);
    }
})

// PDF 파일 필터링 설정
const fileFilter = (req, file, cb) => {
    // 허용할 파일 확장자
    const fileTypes = /pdf/;
    // 파일 확장자 검사
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    
    if(extname){
        return cb(null, true);
    }else{
        return cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
    res.send("Connection Test");
});

app.get('/pdf-parse', async (req, res) => {
    const {path} = req.query;
    const filePath = 'public/' + path;
    const result = await PdfParser.parse(filePath);
    res.send(result);
})

app.post('/pdf-file', upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).send("파일 업로드 실패");
    }
    res.send("/uploads/" + req.file.filename);
})

app.listen(PORT, () => {
    console.log("[서버 시작] PORT : " + PORT);
});