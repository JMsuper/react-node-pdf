const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
const { PDFWorker } = require('pdfjs-dist/legacy/build/pdf.worker.entry');

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;

const delimiters = ['<신'];

class PdfParser {
    static async parse(filePath) {
        const absolutePath = path.resolve(filePath);

        try {
            // 파일 읽기
            const data = new Uint8Array(fs.readFileSync(absolutePath));

            // PDF 파일 로드
            const pdf = await pdfjsLib.getDocument({ data }).promise;

            let textLines = await this.pdfToTextArray(pdf);

            // (3) 신구조문대비표 파싱
            // - '신·구조문대비표' <- 시작 문자열
            // - '현', ' ', '행', ' ', '개', ' ', '정', ' ', '안' <- 이 다음에 신구조문 시작
            // 아래 데이터들이 화면에 표출될 데이터를 의미함
            
            // '<신', ' ', '설>' or '③'(숫자 특수문자) 는 각각 1대1 매칭됨

            //
            
            let isStart = false;
            let prev = '';

            const doubleArray = [];
            let curArray = [];
            let strArray = [];
            // let strStr = '';
            for(let i = 0; i < textLines.length; i++){
                const str = textLines[i];
                if(str === '신·구조문대비표'){
                    isStart = true;
                    continue;
                }
                if(!isStart){ continue; }

                // '현 행 개 정 안' 에 대한 탈출코드
                if(curArray.length === 1 && curArray[0].join('').replace(/ /g, '') === '현행개정안'){
                    curArray = [];
                }
                
                // '- 8 -'에 대한 탈출코드
                if(this.isPageNumber(str)){

                }

                // 이전 문자열이 ' '이 아니고 && 이번 문자열이 '제(숫자)조~'일 경우
                if(prev !== ' ' && this.startsWithArticle(str)){
                    // 만약 curArray의 길이가 1이면, strStr을 curArray에 넣고, curArray를 doubleArray에 넣기
                    if(curArray.length === 1){
                        curArray.push(strArray);
                        doubleArray.push(curArray);
                        curArray = [];
                    }
                    else{
                        // 만약 curArray의 길이가 0이면, strStr 초기화
                        curArray.push(strArray);
                        strArray = [];
                    }
                    strArray = [];
                }
                // strStr 에 붙이기
                strArray.push(str);
                prev = str;
            }

            curArray.push(strArray);
            doubleArray.push(curArray);

            // doubleArray에 있는 내용에 대해, 
            // '<신', ' ', '설>' or '③'(숫자 특수문자) 는 각각 1대1 매칭되는 배열로 변환

            const resultArr = [];
            for(let i = 0; i < doubleArray.length; i++){
                const parsedArr1 = doubleArray[i][0];
                const parsedArr2 = doubleArray[i][1];
                
                const arr1 = this.parseStrWithDelimiter(parsedArr1,delimiters);
                const arr2 = this.parseStrWithDelimiter(parsedArr2,delimiters);
                resultArr.push([arr1,arr2]);
            }

            return resultArr;
        } catch (error) {
            console.error('Error parsing PDF:', error);
        }
    }

    // pdf를 읽어 text 배열 형태로 반환
    static async pdfToTextArray(pdf){
        const numPages = pdf.numPages;
            let fullText = '';
            let textLines = [];

            // 모든 페이지에서 텍스트 추출
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const textItems = textContent.items.map(item => item.str);
                textLines = textLines.concat(textItems);
            }

           return textLines;
    }

    // 숫자이면서 특수기호인지를 확인
    static startWithSpecialNumberCharacter(char) {
        if (char === '') {
            return false;
        }
        // 유니코드 값 확인
        const code = char.charCodeAt(0);
        // '①' (U+2460)에서 '⑨' (U+2468) 사이의 값인지 확인
        return code >= 9312 && code <= 9320;
    }

    // 문자열이 '제X조' 로 시작하는지 확인. X는 숫자
    static startsWithArticle(text){
        const regex = /^제\d+조/;
        return regex.test(text);
    }

    // 페이지 쪽('- 8 -')에 해당하는 문자열인지 확인
    static isPageNumber(str) {
        const regex = /^- \d+ -$/;
        return regex.test(str);
    }
    

    // 문자열 배열에 대해, 특정 문자열 시작 문자열로 조합을 생성하는 함수
    static parseStrWithDelimiter(arr, delimiter){

        const result = [];
        let concatedStr = '';
        let prevStr = '';

        for(let i = 0; i < arr.length; i++){
            let curStr = arr[i];

            // 기준 문자열 배열에, 현재 문자열이 포함될 경우
            if(delimiter.includes(curStr) || this.startWithSpecialNumberCharacter(curStr) || 
                (prevStr !== ' ' && this.startsWithArticle(curStr))){
                if(concatedStr !== ''){
                    result.push(concatedStr);
                }
                concatedStr = '';
            }
            concatedStr += curStr;
            prevStr = curStr;
        }

        if(concatedStr !== ''){
            result.push(concatedStr);
        }
        return result;
    }
}

module.exports = PdfParser;
