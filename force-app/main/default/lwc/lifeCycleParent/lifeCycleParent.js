import { LightningElement, track} from 'lwc';
import {default as mainTemplate} from './lifeCycleParent.html';
import {default as anotherTemplate} from './exampleTemplate.html'



export default class LifeCycleParent extends LightningElement {
  constructorProperty = null
  connectedCallbackProperty = null
  @track renderedCallbackProperty = null
  @track renderedCallbackCount=0
  @track showChild=false
  @track useAnotherTemplate = false
  constructor(){
      super()
      this.constructorProperty='contructor loaded successfully !!'
      
  }
  connectedCallback(){
      // fires when a component is inserted into the DOM
      this.connectedCallbackProperty='connectedCallback loaded successfully !!'
      
  }
  render() {
      return this.useAnotherTemplate ?  anotherTemplate:mainTemplate
  }
  renderedCallback(){
      //fires when component has finished the rendering phase (inclucing child)
      // change in any property trigger again this hook
      this.renderedCallbackProperty='renderedCallback loaded successfully !!'
  }

  // demo related methods
  toggleRendering(){
      this.showChild = !this.showChild
  }
  renderTemplate(){
      this.useAnotherTemplate = !this.useAnotherTemplate
  }
  get getClassName(){
      return this.showChild ? 'btn childBtn red': 'btn childBtn'
  }
  get getBtnText(){
      return this.showChild ? 'Click me to remove child':'Click me to render child';
  }
}