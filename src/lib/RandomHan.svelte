<script lang="ts">
    import {transAdjective, transConnectedAdjective, Han2Eng} from './KoreanUtils'
    import hangulDict from '../dataset/KoreanWords.json'
    function RandomHanNouns(wordsNum: number, joinStr: string){
        let nounList: string[] = [];
        let newNoun: string = "";
        for(let i = 0; i < wordsNum; ++i){
            do {
                let nounIndex = Math.floor(Math.random() * hangulDict["noun"].length);
                newNoun = hangulDict["noun"][nounIndex];
            }while(nounList.includes(newNoun));
            nounList.push(newNoun);
        }
        return nounList.join(joinStr);
    }

    function RandomHanAdjsNouns(adjNum: number, joinStr: string){
        let wordList: string[] = [];
        let newWord: string = "";
        for(let i = 0; i < adjNum; ++i){
            do {
                let adjIndex = Math.floor(Math.random() * hangulDict["adjective"].length);
                newWord = hangulDict["adjective"][adjIndex];
            }while(wordList.includes(newWord));
            wordList.push(newWord);
        }

        for(let i = 0; i < adjNum; ++i){
            if (i < (adjNum - 1)){
                wordList[i] = transConnectedAdjective(wordList[i]);
            } else {
                wordList[i] = transAdjective(wordList[i]);
            }
        }

        let nounIndex = Math.floor(Math.random() * hangulDict["noun"].length);
        wordList.push(hangulDict["noun"][nounIndex]);

        return wordList.join(joinStr);
    }

    let isUseAdjective = false;
    let isCapitalEssential = false;
    let wordNum = 1;
    let spaceStr = "-";
    let generatedHangulPasswd = "";
    let generatedEnglishPasswd = "";

    function switchIsUseAdjective(){
        isUseAdjective = !isUseAdjective;
        generateHangulPasswd();
    }

    function switchIsCapitalEssential(){
        isCapitalEssential = !isCapitalEssential;
        generateHangulPasswd();
    }

    function generateHangulPasswd(){
        const checkCapital = new RegExp(/.*[A-Z].*/g);
        let isCapital = false;
        let isLoop = false;
        console.log("request generate passwd");
        do{
            if (isUseAdjective && wordNum > 1){
                generatedHangulPasswd = RandomHanAdjsNouns(wordNum - 1, spaceStr);
            } else {
                generatedHangulPasswd = RandomHanNouns(wordNum, spaceStr);
            }
            transformHangul2English();
            isCapital = checkCapital.exec(generatedEnglishPasswd) !== null;
            isLoop = isCapitalEssential && (!isCapital);
        } while(isLoop);
    }

    function transformHangul2English(){
        generatedEnglishPasswd = Han2Eng(generatedHangulPasswd);
    }

    function copyPasswd(){
        navigator.clipboard.writeText(generatedEnglishPasswd);
    }
</script>

<h2>???????????? ??????</h2>
<div>
<button class="button" class:button-outline={!isUseAdjective} on:click={switchIsUseAdjective}>
    {#if isUseAdjective}
    ????????? ??????
    {:else}
    ????????? ?????? ??????
    {/if}
</button>
<button class="button" class:button-outline={!isCapitalEssential} on:click={switchIsCapitalEssential}>
    {#if isCapitalEssential}
    ????????? ??????
    {:else}
    ????????? ?????? ??????
    {/if}
</button>
</div>
<label for="wordNumInput">?????? ??????</label>
<input type="number" min="1" id="wordNumInput" bind:value={wordNum} on:change={generateHangulPasswd}>
<label for="spaceStrInput">?????? ??????</label>
<input type="text" id="spaceStrInput" bind:value={spaceStr} on:change={generateHangulPasswd}>
<button class="button" on:click={generateHangulPasswd}>??????</button>
<h2>?????? ????????????</h2>
<label for="hanPasswd">?????? ?????? ???????????? (?????? ??????)</label>
<input type="text" id="hanPasswd" bind:value={generatedHangulPasswd} on:change={transformHangul2English}>
<div>
<label for="engPasswd">?????? ?????? ????????????</label>
<pre><code id="engPasswd">{generatedEnglishPasswd}</code></pre>
<button class="button" on:click={copyPasswd}>???????????? ??????</button>
</div>
