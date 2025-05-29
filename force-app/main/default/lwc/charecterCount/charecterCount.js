import { LightningElement, track } from 'lwc';
export default class CharecterCount extends LightningElement {
    inputString;
    countMap = new Map();
    @track mapArray = [];

    handleInputChange(event){
        this.inputString = event.target.value;
    }

    handleClick(){       
        this.countMap.clear();
        for(let word of this.inputString) {
            if(this.countMap.has(word)) {
                this.countMap.set(word, this.countMap.get(word) + 1);
            } else {
                this.countMap.set(word, 1);
            }           
        }

        this.countMap.forEach( (value,key) => {
            this.mapArray.push({char: key, count: value})
        });

        console.log('****'+JSON.stringify(this.mapArray));

    }

    handleReset(){
        this.inputString = '';
        this.countMap.clear();
        this.mapArray = [];
    }
}