import { select } from "../settings.js";
import AmountWidget from './amountWidget.js'


class CartProduct {
    constructor(menuProduct, element){
      const thisCartProduct = this;
      element = menuProduct.element;
  
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name; 
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.params = menuProduct.params;   
  
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      console.log('cart product:', thisCartProduct);
    }
  
    getElements(element){
      const thisCartProduct = this;
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = document.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = document.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = document.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = document.querySelector(select.cartProduct.remove);
    }
  
    initAmountWidget(){
      const thisCartProduct = this;
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      thisCartProduct.dom.amountWidget.addEventListener('redo', function() {
        thisCartProduct.price = thisCartProduct.amountWidget.value * thisCartProduct.priceSingle;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
        });
    }
  }

  export default CartProduct