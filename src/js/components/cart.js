import { classNames, select, templates } from "../settings.js";
import CartProduct from'./cartProduct.js'
import utils from "../util.js";

class Koszyk{
    constructor(element){
      const thisKoszyk = this;
      thisKoszyk.products = []
      this.getElements(element)
      console.log("kosz:", Koszyk)
      thisKoszyk.initActions()
        
    }
  
    getElements(element){
     const thisKoszyk = this;
     thisKoszyk.dom = {};
     thisKoszyk.dom.wrapper = element;
     thisKoszyk.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
     thisKoszyk.dom.productList = element.querySelector(select.cart.productList);
    }
   
    initActions(){
      const thisKoszyk = this;
      thisKoszyk.dom.toggleTrigger.addEventListener('click', function(){
      thisKoszyk.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
     })
    }
  
    add(menuProduct){
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM))
      console.log(thisCart.products)
    }
  }
  export default Koszyk;