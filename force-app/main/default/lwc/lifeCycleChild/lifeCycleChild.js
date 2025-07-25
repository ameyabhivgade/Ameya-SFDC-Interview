import { LightningElement, track } from 'lwc';

export default class LifeCycleChild extends LightningElement {

    @track constructorProperty = null
    @track connectedCallbackProperty = null
    @track renderedCallbackProperty = null
    constructor(){
        super()
        this.constructorProperty="Child contructor loaded successfully !!"
    }
    connectedCallback(){
        // fires when a component is inserted into the DOM
        
        this.connectedCallbackProperty="Child connectedCallback loaded successfully !!"
        //throw new Error('Whoops!');
    }
    
    renderedCallback(){
        //fires when component has finished the rendering phase (inclucing child)
        this.renderedCallbackProperty="Child renderedCallback loaded successfully !!"
        
    }
    disconnectedCallback(){
        alert('Child disconnectedCallback called !!')
    }
}