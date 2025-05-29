import { LightningElement, track } from 'lwc';
import  getAccounts from '@salesforce/apex/lazyLoadingController.getAccounts';

export default class LazyLoading extends LightningElement {

    @track content = [];
    @track isLoading= false;
    @track offset = 0;
    @track limit = 20;

    connectedCallback(){
        this.loadContent();
    }

    loadContent(){
        this.isLoading = true;
        getAccounts({limits: this.limit, offsets: this.offset})
            .then(result => {
                this.content = [...this.content, ...result];
                this.offset = this.offset + this.limit;
                this.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                this.isLoading = false;
            })
            .finally(() => {
            });
    }

    handleScroll(event){
        console.log('1 :' + event.target.scrollTop + '2 :' + event.target.clientHeight);
        console.log('3 :' + event.target.scrollHeight + '4 :' + event.target.offsetHeight + '5 :' + event.target.offsetTop);
        if(event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight){
            this.loadContent();
        }

    }
}