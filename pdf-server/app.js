const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*'
}));

// 테스트 로깅
app.use((req, res, next) => {
    const currentTime = new Date().toISOString(); // 현재 시간
    console.log(`[${currentTime}] ${req.method} ${req.url}`); // 요청 메서드와 URL 출력
    console.log('Headers:', req.headers); // 요청 헤더 출력
    console.log('Query:', req.query); // 쿼리 파라미터 출력
    next(); // 다음 미들웨어로 이동
})

// 파일 저장 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
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

app.get('/', (req, res) => {
    res.send("Connection Test");
});

app.post('/pdf-file', upload.single('file'), (req, res) => {
    console.log(req.file);
    if(!req.file){
        return res.status(400).send("파일 업로드 실패");
    }
    res.send(`파일이 성공적으로 업로드되었습니다: ${req.file.filename}`);
})

app.listen(PORT, () => {
    console.log("[서버 시작] PORT : " + PORT);
});