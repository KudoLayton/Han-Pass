<script lang="ts">
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
                                       //ㄱ,ㄲ,ㄴ,ㄷ,ㄸ,ㄹ, ㅁ, ㅂ, ㅃ, ㅅ, ㅆ,  o,  ㅈ, ㅉ, ㅊ, ㅋ, ㅌ,  ㅍ, ㅎ
    let firstCode2Consonant: number[] = [0, 1, 3, 6, 7, 8, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
                                        //ㄱ ㄲ ㄳ ㄴ ㄵ ㄶ  ㄷ ㄹ ㄺ  ㄻ  ㄼ  ㄽ  ㄾ  ㄿ   ㅀ  ㅁ  ㅂ  ㅄ  ㅅ  ㅆ   ㅇ  ㅈ  ㅊ  ㅋ  ㅌ  ㅍ   ㅎ
    let thirdCode2Consonanat: number[] = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29];

    function Han2Eng(inStr: string){
        const hangulCombStart = "가".charCodeAt(0);
        const hangulCombEnd = "힣".charCodeAt(0);
        const hangulConsonentStart = "ㄱ".charCodeAt(0);
        const hangulVowelStart = "ㅏ".charCodeAt(0);
        let out: string;
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
                    let thirdIndex = Math.floor(charCode % (21 * 28));
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

    let testStr = '갉'

    const testEvent = () => {
        testStr = Han2Eng(testStr);
    }
</script>

<button on:click={testEvent}>
    {testStr}
</button>