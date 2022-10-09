<script lang="ts">
    import hangulDict from '../dataset/KoreanWords.json'
    function RandomHanNouns(wordsNum: Number, joinStr: string){
        let nounList: string[] = [];
        let newNoun: string = "";
        for(let i = 0; i < wordsNum; ++i){
            do {
                let nounIndex = Math.floor(Math.random() * hangulDict["noun"].length)
                newNoun = hangulDict["noun"][nounIndex];
            }while(nounList.includes(newNoun));
            nounList.push(newNoun);
        }
        return nounList.join(joinStr);
    }

    let testStr = "아무거나";
    const testCase = () => {
         testStr = RandomHanNouns(3, "-");
    }
</script>

<button on:click={testCase}>
    {testStr}
</button>