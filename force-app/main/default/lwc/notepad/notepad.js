import { LightningElement, track } from 'lwc';
export default class Notepad extends LightningElement {

    @track inputField = '';

    handleOnchange(event){
        console.log('****'+event.target.value);
        //let inputField = this.refs.inputText;
        this.inputField = event.target.value;    
        // let char = this.refs.charCount;
        // let word = this.refs.wordCount;
        // let space = this.refs.spaceCount;

        //let content = inputField.value;

        // char.textContent = ' ' + content.length

        // space.textContent = ' ' + content.split(' ').length - 1;

        // content = content.trim();

        // let wordList = content.split(/\s/);

        // let words = wordList.filter(function (element) {
        //     return element !="";
        // });

        // word.textContent = words.length;

    }

    get wordCount(){
        return this.inputField.trim().split(/\s+/).filter(Boolean).length;
    }

    get charecterCount(){
        return this.inputField.trim().length;
    }

    get spaceCount(){
        return (this.inputField.match(/ /g) || []).length;
    }

}