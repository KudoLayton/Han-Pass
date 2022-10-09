<script lang="ts">
    import {splitKoreanPhoneme, mergeKoreanPhoneme, transAdjective, transConnectedAdjective, Han2Eng} from './KoreanUtils'
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

    let testStr = "아무거나";
    const testCase = () => {
         //testStr = RandomHanAdjsNouns(2, "-");
         testStr = Han2Eng("가");
    }
</script>

<button on:click={testCase}>
    {testStr}
</button>