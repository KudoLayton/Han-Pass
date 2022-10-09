<script lang="ts">
                                       //ㄱ,ㄲ,ㄴ,ㄷ,ㄸ,ㄹ, ㅁ, ㅂ, ㅃ, ㅅ, ㅆ,  o,  ㅈ, ㅉ, ㅊ, ㅋ, ㅌ,  ㅍ, ㅎ
    let firstCode2Consonant: number[] = [0, 1, 3, 6, 7, 8, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
                                        //ㄱ ㄲ ㄳ ㄴ ㄵ ㄶ  ㄷ ㄹ ㄺ  ㄻ  ㄼ  ㄽ  ㄾ  ㄿ   ㅀ  ㅁ  ㅂ  ㅄ  ㅅ  ㅆ   ㅇ  ㅈ  ㅊ  ㅋ  ㅌ  ㅍ   ㅎ
    let thirdCode2Consonanat: number[] = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29];
    const hangulCombStart = "가".charCodeAt(0);
    const hangulCombEnd = "힣".charCodeAt(0);
    const hangulConsonentStart = "ㄱ".charCodeAt(0);
    const hangulVowelStart = "ㅏ".charCodeAt(0);

    // 음운 단위로 분리
    function splitKoreanPhoneme (inChar: string){

        let out: string = "";
        let ch = inChar.charAt(0);
        let charCode = inChar.charCodeAt(0);
        if ((charCode >= hangulCombStart) && (charCode <= hangulCombEnd)) {
            let charCodeOffset = charCode - hangulCombStart;

            // 초성
            let firstCodeIndex = Math.floor(charCodeOffset / (21 * 28));
            let firstCode = firstCode2Consonant[firstCodeIndex] + hangulConsonentStart;
            let firstChar = String.fromCharCode(firstCode);
            out += firstChar

            // 중성
            let secondCode = Math.floor(charCodeOffset / 28) % 21 + hangulVowelStart;
            let secondChar = String.fromCharCode(secondCode);
            out += secondChar

            // 종성
            let thirdIndex = charCodeOffset % 28;

            // 종성이 있는 경우
            if (thirdIndex > 0) {
                let thirdCode = thirdCode2Consonanat[thirdIndex - 1] + hangulConsonentStart;
                let thirdChar = String.fromCharCode(thirdCode);
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
            let firstIndex = firstCode2Consonant.indexOf(inStr.charCodeAt(0) - hangulConsonentStart);
            let secondIndex = inStr.charCodeAt(1) - hangulVowelStart;
            let thirdIndex = 0;
            if (inStr.length > 2){
                thirdIndex = thirdCode2Consonanat.indexOf(inStr.charCodeAt(2) - hangulConsonentStart) + 1;
            }
            if(firstIndex !== undefined && secondIndex !== undefined && thirdIndex !== undefined){
                let outCode = firstIndex * 21 * 28 + secondIndex * 28 + thirdIndex + hangulCombStart;
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
            let lastChar = transAdj.charAt(transAdj.length - 1);
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
            let transAdj = inAdj.slice(0, -1);
            return transAdj + "고";
        } else{
            return inAdj
        }
    }

    let splitHanDictDubeul: Record<string, string> = {
        // 자음
        "ㄱ": "r",
        "ㄲ": "R",
        "ㄳ": "rt",
        "ㄴ": "s",
        "ㄵ": "sw",
        "ㄶ": "sg",
        "ㄷ": "e",
        "ㄸ": "E",
        "ㄹ": "f",
        "ㄺ": "fr",
        "ㄻ": "fa",
        "ㄼ": "fq",
        "ㄽ": "ft",
        "ㄾ": "fx",
        "ㅀ": "fg",
        "ㅁ": "a",
        "ㅂ": "q",
        "ㅃ": "Q",
        "ㅄ": "qt",
        "ㅅ": "t",
        "ㅆ": "T",
        "ㅇ": "d",
        "ㅈ": "w",
        "ㅉ": "W",
        "ㅊ": "C",
        "ㅋ": "z",
        "ㅌ": "x",
        "ㅍ": "v",
        "ㅎ": "g",
        // 모음
        "ㅏ": "k",
        "ㅐ": "o",
        "ㅑ": "i",
        "ㅒ": "O",
        "ㅓ": "j",
        "ㅔ": "p",
        "ㅕ": "u",
        "ㅖ": "P",
        "ㅗ": "h",
        "ㅘ": "hk",
        "ㅙ": "ho",
        "ㅚ": "hl",
        "ㅛ": "y",
        "ㅜ": "n",
        "ㅝ": "nj",
        "ㅞ": "np",
        "ㅟ": "nl",
        "ㅠ": "b",
        "ㅡ": "m",
        "ㅢ": "ml",
        "ㅣ": "l"
    }

    function Han2Eng(inStr: string){
        const hangulCombStart = "가".charCodeAt(0);
        const hangulCombEnd = "힣".charCodeAt(0);
        const hangulConsonentStart = "ㄱ".charCodeAt(0);
        const hangulVowelStart = "ㅏ".charCodeAt(0);
        let out: string = "";
        for(let i = 0; i < inStr.length; ++i){
            let ch = inStr.charAt(i);
            if (splitHanDictDubeul[ch] !== undefined){
                out += splitHanDictDubeul[ch];
            } else {
                let charCode = inStr.charCodeAt(i);
                if ((charCode >= hangulCombStart) && (charCode <= hangulCombEnd)) {
                    let charCodeOffset = charCode - hangulCombStart;

                    // 초성
                    let firstCodeIndex = Math.floor(charCodeOffset / (21 * 28));
                    let firstCode = firstCode2Consonant[firstCodeIndex] + hangulConsonentStart;
                    let firstChar = String.fromCharCode(firstCode);
                    out += splitHanDictDubeul[firstChar];

                    // 중성
                    let secondCode = Math.floor(charCodeOffset / 28) % 21 + hangulVowelStart;
                    let secondChar = String.fromCharCode(secondCode);
                    out += splitHanDictDubeul[secondChar];

                    // 종성
                    let thirdIndex = charCodeOffset % 28;
                    // 종성이 있는 경우
                    if (thirdIndex > 0) {
                        let thirdCode = thirdCode2Consonanat[thirdIndex - 1] + hangulConsonentStart;
                        let thirdChar = String.fromCharCode(thirdCode);
                        out += splitHanDictDubeul[thirdChar];
                    }
                }else{
                    out += ch;
                }
            }
        }
        return out;
    }

    let testStr = '아름답다'

    const testEvent = () => {
        testStr = transAdjective(testStr);
    }

    import KoreanDict from '../dataset/KoreanWords.json'
    KoreanDict["adjective"].forEach(element => {
        console.log('%s -> %s', element, transConnectedAdjective(element));
    });
</script>

<button on:click={testEvent}>
    {testStr}
</button>