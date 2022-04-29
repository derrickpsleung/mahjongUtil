
//https://www.xqbase.com/other/mahjongg_english.htm

function isCallingWin(mahjongStr) {

    //TODO logic
    return true;

}


function getSetOfCallingWinCards(mahjongStr) {

    /**assumption:
     * 1. only 1 type of cards e.g. only bamboo
     * 2. mahjongStr length is 13
     * **/

    if (isCallingWin(mahjongStr)) {

        /**calling win situations:
         * 1. 111 234 567 8^ 999: missing eye
         * 2. 111 234 567 ^89 99: missing Triplet / Sequence
         * 
         * win pattern:
         * 000 000 000 000 00
         * 
        */
        if (mahjongStr.length != 13) {
            return [];
        }


        let getSetOfCallingWinCards = function (triedSet, completedMahjongStr) {



        }

        let mahjongArr = mahjongStr.split('');
        mahjongArr.sort();

        for (let i = 0; i < 10; i++) {
            for (let idx = 0; idx < mahjongArr.length; i++) {
                console.log(myStringArray[i]);
                //Do something
            }
        }

        /*
        1. sort mahjongStr
        2. put 1-9 to the function A
        Function A (1):    
            a. find eye e.g. 111 123 456 789 99, there is 2 potential eye (1,9)
            b. 
        
        */

    }

}

