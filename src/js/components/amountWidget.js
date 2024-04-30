import { settings, select } from "../settings.js";
import BaseWidget from "./baseWidget.js";

class AmountWidget extends BaseWidget{
    constructor(element){
      super(element, settings.amountWidget.defaultValue)
    const thisWidget = this;


    thisWidget.getElements(element);
      if (thisWidget.input.value === '' || thisWidget.input.value === undefined ) {
        thisWidget.setValue(settings.amountWidget.defaultValue)
    } else {
        thisWidget.setValue(thisWidget.input.value);
    }

    thisWidget.initCount()
   
    }
  
    getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
  
  announc(){
    const thisWidget = this
    const event = new Event ('redo')
    thisWidget.element.dispatchEvent(event)
  }
  
  setValue(value){
    const thisWidget = this;
    const  newValue = parseInt(value)
      if(thisWidget.value !== newValue && !isNaN(newValue)) {
          thisWidget.value = newValue;
      }
      if(newValue == isNaN || newValue > 9 || newValue < 0){
      thisWidget.value = 1
      }
      thisWidget.input.value = thisWidget.value;
      thisWidget.announc()
  }
  
  
    initCount(){
      const thisWidget = this;
        thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      })
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value -1);
          })
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value +1);
      })
  }
  }

  export default AmountWidget