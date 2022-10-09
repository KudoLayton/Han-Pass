                                       //ㄱ,ㄲ,ㄴ,ㄷ,ㄸ,ㄹ, ㅁ, ㅂ, ㅃ, ㅅ, ㅆ,  o,  ㅈ, ㅉ, ㅊ, ㅋ, ㅌ,  ㅍ, ㅎ
const firstCode2Consonant: number[] = [0, 1, 3, 6, 7, 8, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
                                        //ㄱ ㄲ ㄳ ㄴ ㄵ ㄶ  ㄷ ㄹ ㄺ  ㄻ  ㄼ  ㄽ  ㄾ  ㄿ   ㅀ  ㅁ  ㅂ  ㅄ  ㅅ  ㅆ   ㅇ  ㅈ  ㅊ  ㅋ  ㅌ  ㅍ   ㅎ
const thirdCode2Consonanat: number[] = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29];
const hangulCombStart = '가'.charCodeAt(0);
const hangulCombEnd = '힣'.charCodeAt(0);
const hangulConsonentStart = 'ㄱ'.charCodeAt(0);
const hangulVowelStart = 'ㅏ'.charCodeAt(0);

// 음운 단위로 분리
function splitKoreanPhoneme(inChar: string){
   let out = '';
   const ch = inChar.charAt(0);
   const charCode = inChar.charCodeAt(0);
   if ((charCode >= hangulCombStart) && (charCode <= hangulCombEnd)) {
       const charCodeOffset = charCode - hangulCombStart;

       // 초성
       const firstCodeIndex = Math.floor(charCodeOffset / (21 * 28));
       const firstCode = firstCode2Consonant[firstCodeIndex] + hangulConsonentStart;
       const firstChar = String.fromCharCode(firstCode);
       out += firstChar

       // 중성
       const secondCode = Math.floor(charCodeOffset / 28) % 21 + hangulVowelStart;
       const secondChar = String.fromCharCode(secondCode);
       out += secondChar

       // 종성
       const thirdIndex = charCodeOffset % 28;

       // 종성이 있는 경우
       if (thirdIndex > 0) {
           const thirdCode = thirdCode2Consonanat[thirdIndex - 1] + hangulConsonentStart;
           const thirdChar = String.fromCharCode(thirdCode);
           out += thirdChar
       }
   }else{
       out += ch;
   }
   return out;
}

// 분리된 음운을 다시 결합
function mergeKoreanPhoneme (inStr: string){
   const checkPhonemeRegex = new RegExp(/^[ㄱ-ㅎ][ㅏ-ㅣ][ㄱ-ㅎ]*$/g);
   if(checkPhonemeRegex.exec(inStr)){
       const firstIndex = firstCode2Consonant.indexOf(inStr.charCodeAt(0) - hangulConsonentStart);
       const secondIndex = inStr.charCodeAt(1) - hangulVowelStart;
       let thirdIndex = 0;
       if (inStr.length > 2){
           thirdIndex = thirdCode2Consonanat.indexOf(inStr.charCodeAt(2) - hangulConsonentStart) + 1;
       }
       if(firstIndex !== undefined && secondIndex !== undefined && thirdIndex !== undefined){
           const outCode = firstIndex * 21 * 28 + secondIndex * 28 + thirdIndex + hangulCombStart;
           return String.fromCharCode(outCode);
       }else{
           return undefined;
       }
   } else {
       return undefined;
   }
}

// 형용사를 '은'/'는' 어미로 변형
function transAdjective(inAdj: string){
   // 형용사는 '다'로 끝남
   if(inAdj.endsWith("다")) {
       let transAdj = inAdj.slice(0, -1);
       const lastChar = transAdj.charAt(transAdj.length - 1);
       // 하 변칙
       if (lastChar === "하"){
           transAdj = transAdj.slice(0, -1) + "한";
       }
       else {
           // 아래 변칙을 따르지 않고 바로 '은'을 붙이는 경우
           const directUnCharacters = ["곧", "굳", "좋", "좁"];
           if (directUnCharacters.includes(lastChar)){
               return transAdj + "은";
           }
           let splitLastChar = splitKoreanPhoneme(lastChar);
           // 종성 있음
           if (splitLastChar.length > 2){
               // ㄷ 변칙
               if (splitLastChar.charAt(2) === "ㄷ"){
                   splitLastChar = splitLastChar.slice(0, -1) + "ㄹ";
                   transAdj = transAdj.slice(0, -1) + mergeKoreanPhoneme(splitLastChar) + "은";
               }
               // ㅂ 변칙
               else if (splitLastChar. charAt(2) === "ㅂ"){
                   splitLastChar = splitLastChar.slice(0, -1);
                   transAdj = transAdj.slice(0, -1) + mergeKoreanPhoneme(splitLastChar) + "운";
               }
               else if (splitLastChar.charAt(2) === "ㅄ"){
                   transAdj = transAdj + "는";
               }
               // ㅅ 변칙
               else if (splitLastChar.charAt(2) === "ㅅ"){
                   splitLastChar = splitLastChar.slice(0, -1);
                   transAdj = transAdj.slice(0, -1) + mergeKoreanPhoneme(splitLastChar) + "은";
               }
               else if (splitLastChar.charAt(2) === "ㅆ"){
                   transAdj = transAdj + "는";
               }
               // ㅎ 변칙
               else if (splitLastChar.charAt(2) === "ㅎ"){
                   splitLastChar = splitLastChar.slice(0, -1) + "ㄴ";
                   transAdj = transAdj.slice(0, -1) + mergeKoreanPhoneme(splitLastChar);
               }
               // ㄹ 변칙
               else if (splitLastChar.charAt(2) === "ㄹ"){
                   splitLastChar = splitLastChar.slice(0, -1) + "ㄴ";
                   transAdj = transAdj.slice(0, -1) + mergeKoreanPhoneme(splitLastChar);
               }
               // 규칙 형용사
               else {
                   transAdj = transAdj + "은"
               }
           } else {
               splitLastChar = splitLastChar + "ㄴ";
               transAdj = transAdj.slice(0, -1) + mergeKoreanPhoneme(splitLastChar);
           }
       }
       return transAdj;
   } else{
       return inAdj
   }
}

// 형용사를 '고' 어미로 변형
function transConnectedAdjective(inAdj: string){
   // 형용사는 '다'로 끝남
   if(inAdj.endsWith("다")) {
       const transAdj = inAdj.slice(0, -1);
       return transAdj + "고";
   } else{
       return inAdj
   }
}

import splitHanDictDubeol from '../dataset/KoreanDubeol2English.json'

function Han2Eng(inStr: string){
   const hangulCombStart = "가".charCodeAt(0);
   const hangulCombEnd = "힣".charCodeAt(0);
   const hangulConsonentStart = "ㄱ".charCodeAt(0);
   const hangulVowelStart = "ㅏ".charCodeAt(0);
   let out = "";
   for(let i = 0; i < inStr.length; ++i){
       const ch = inStr.charAt(i);
       if (ch in splitHanDictDubeol){
           out += splitHanDictDubeol[ch];
       } else {
           const charCode = inStr.charCodeAt(i);
           if ((charCode >= hangulCombStart) && (charCode <= hangulCombEnd)) {
               const charCodeOffset = charCode - hangulCombStart;

               // 초성
               const firstCodeIndex = Math.floor(charCodeOffset / (21 * 28));
               const firstCode = firstCode2Consonant[firstCodeIndex] + hangulConsonentStart;
               const firstChar = String.fromCharCode(firstCode);
               out += splitHanDictDubeol[firstChar];

               // 중성
               const secondCode = Math.floor(charCodeOffset / 28) % 21 + hangulVowelStart;
               const secondChar = String.fromCharCode(secondCode);
               out += splitHanDictDubeol[secondChar];

               // 종성
               const thirdIndex = charCodeOffset % 28;
               // 종성이 있는 경우
               if (thirdIndex > 0) {
                   const thirdCode = thirdCode2Consonanat[thirdIndex - 1] + hangulConsonentStart;
                   const thirdChar = String.fromCharCode(thirdCode);
                   out += splitHanDictDubeol[thirdChar];
               }
           }else{
               out += ch;
           }
       }
   }
   return out;
}

export{splitKoreanPhoneme, mergeKoreanPhoneme, transAdjective, transConnectedAdjective, Han2Eng}
