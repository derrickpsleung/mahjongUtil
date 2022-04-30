
//https://www.xqbase.com/other/mahjongg_english.htm


function MahjongUtil() {
}

MahjongUtil.prototype.isCallingWin = function () {
    //TODO
    return true;
}


MahjongUtil.prototype.isTriplet = function (arrOfThreeCards) {
    debugger;
    if (!arrOfThreeCards || arrOfThreeCards.length != 3) {
        return false;
    }
    let result = (Number(arrOfThreeCards[0]) === Number(arrOfThreeCards[1]) === Number(arrOfThreeCards[2]));
    console.log(arrOfThreeCards);
    console.log('isTriplet result: ', result);

    return result;
};


MahjongUtil.prototype.findSequence = function (remainingMahjongArr) {

    //e.g. [4,4,5,5,6,6]
    if (!remainingMahjongArr || remainingMahjongArr.length % 3 != 0) {
        return false;
    }

    let resultArr = [];

    let incrementVal = remainingMahjongArr[0]; //e.g. 4
    resultArr.push(incrementVal);

    for (let i = 0; i < remainingMahjongArr.length; i++) {
        if(resultArr.length == 3){
            return resultArr;
        }
        if (remainingMahjongArr[i] == incrementVal + 1) {
            incrementVal = incrementVal + 1;
            resultArr.push(incrementVal);
        }
    }

    return [];

};

MahjongUtil.prototype.findPotentialEyes = function (mahjongArr) {
    //in: mahjongArr with length 14
    //out: num[]
    if (!mahjongArr) {
        return [];
    }

    let resultArr = [];
    for (let i = 0; i < mahjongArr.length; i++) {
        if (i % 3 == 0) {
            if (mahjongArr[i] == mahjongArr[i + 1]) {
                resultArr.push(mahjongArr[i]);
            }
        }
    }
    return resultArr;

};

MahjongUtil.prototype.getSetOfCallingWinCards = function (mahjongStr) {

    /**assumption:
     * 1. only 1 type of cards e.g. only bamboo
     * 2. mahjongStr length is 13
     * **/

    if (this.isCallingWin(mahjongStr)) {

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

        let mahjongArr = mahjongStr.split('').map(function(item) {
            return parseInt(item, 10);
        });
        mahjongArr.sort();
        
        debugger;

        let getIndexToBeInserted = function (array, value) {
            var low = 0,
                high = array.length;

            while (low < high) {
                var mid = (low + high) / 2;
                if (array[mid] < value) low = mid + 1;
                else high = mid;
            }
            return low;
        };

        let getNumOfOccurenceOfValInArr = function (arr, val) {
            const counts = {};
            arr.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
            return counts[val];
        };

        /*
        1. sort mahjongStr and convert it to mahjongArr
        1. for idx in 1-9, put idx to mahjongArr
        1. call findPotentialEyes
        2. call findWinningSet
        */


        let resultMap = {};

        for (let idx = 1; idx < 2; idx++) {

            //TODO

            console.log('current idx: ' + idx);
            let numOfOccur = getNumOfOccurenceOfValInArr(mahjongArr, idx);

            if (numOfOccur < 4) {

                //insert idx into fullSetMahjongArr
                let indexToBeInserted = getIndexToBeInserted(mahjongArr, idx);
                let fullSetMahjongArr = JSON.parse(JSON.stringify(mahjongArr));

                debugger;
                fullSetMahjongArr.splice(indexToBeInserted, 0, idx);

                let potentialEyesArr = this.findPotentialEyes(fullSetMahjongArr);

                if (!!potentialEyesArr && potentialEyesArr.length > 0) {

                    let resultSetOfArr = this.findWinningSet(potentialEyesArr, fullSetMahjongArr);

                    if (!!resultSetOfArr && resultSetOfArr.length == 5) {
                        resultMap[idx] = resultSetOfArr;
                    }
                }
            }

        }

        return resultMap;

    }
    return null;
}


MahjongUtil.prototype.copyObj = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}

MahjongUtil.prototype.removeFromArrayByVal = function (arr, val, numOfEleToRemove) {

    if (!numOfEleToRemove || !arr || !val) {
        return null;
    }

    for (let i = 0; i < numOfEleToRemove; i++) {
        var index = arr.indexOf(val);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }
    return arr;

};


MahjongUtil.prototype.findFourMelds = function (meldsArr, mjArr) {


    if (!meldsArr) {
        meldsArr = [];
    }
    
    console.log("meldsArr: ", meldsArr);
    console.log("mjArr: ", mjArr);

    if (meldsArr.length == 4) {
        return meldsArr;
    }

    let idx = 0;
    let threeCards = mjArr.slice(idx, idx + 3); //get 111 from 111 222 333 444

    debugger;
    if (this.isTriplet(threeCards)) {

        meldsArr.push(threeCards);
        mjArr = this.removeFromArrayByVal(mjArr, threeCards[0], 3);

        return this.findFourMelds(meldsArr, mjArr);

    } else {

        let sequenceMeld = this.findSequence(mjArr);

        if (!!sequenceMeld && sequenceMeld.length > 0) {

            //has sequence meld

            meldsArr.push(sequenceMeld);
            for (let seqVal of sequenceMeld) {
                mjArr = this.removeFromArrayByVal(mjArr, seqVal, 1);
            }

            return this.findFourMelds(meldsArr, mjArr);

        } else {
            return [];
        }

    }

};

MahjongUtil.prototype.findWinningSet = function (potentialEyesArr, fullSetMahjongArr) {

    /*
    findWinningSet:
        a. find all potential eyes e.g. 111 123 456 789 99, there is 2 potential eyes (1,9) > potentialEyesList
        b. for each eyes in potentialEyesList
            1. copy mahjongArr to tmpArray
            2. remove the eyes from tmpArray
            3. for each in tmpArray
                if idx % 3 == 0
                    check findTriplet(array[current index to current index + 2]) > rsltArr1
                    if rsltArr1 is empty
                        check findSequence(array[current index to last item]) > rsltArr2
    */

    //one meld = e.g. 111 / 123

    for (let i = 0; i < potentialEyesArr.length; i++) {

        let eyeVal = potentialEyesArr[i];
        let arrayWithTwelveCards = this.copyObj(fullSetMahjongArr);
        arrayWithTwelveCards = this.removeFromArrayByVal(arrayWithTwelveCards, eyeVal, 2);

        console.log('doing eyes: ' + eyeVal);
        let fourMeldsArr = this.findFourMelds([], arrayWithTwelveCards);
        if (!!fourMeldsArr && fourMeldsArr.length == 4) {
            let winningSet = fourMeldsArr.push([eyeVal, eyeVal]);
            return winningSet;
        }

    }

}



