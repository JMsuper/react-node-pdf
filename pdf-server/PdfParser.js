// const fs = require('fs');
// const path = require('path');
// const { getDocument } = require('pdfjs-dist/legacy/build/pdf');

// class PdfParser {
//     static async parse(filePath) {
//         const absolutePath = path.resolve(filePath);

//         // 파일 읽기
//         const data = new Uint8Array(fs.readFileSync(absolutePath));

//         // PDF 파일 로드
//         const pdf = await getDocument({ data }).promise;

//         // 첫 번째 페이지 가져오기
//         const page = await pdf.getPage(1);

//         // 페이지의 텍스트 콘텐츠 가져오기
//         const textContent = await page.getTextContent();

//         // 텍스트 추출
//         const text = textContent.items.map(item => item.str).join(' ');

//         console.log('PDF Text:', text);
//     }
// }

// module.exports = PdfParser;