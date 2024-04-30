import { templates, select, classNames } from "../settings.js";
import utils from "../util.js";
import AmountWidget from "./amountWidget.js";


class Product {
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu()
      thisProduct.getElements()
      console.log(thisProduct)
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }
  
    renderInMenu(){
      const thisProduct = this;
      const genaratedHTML = templates.menuProduct(thisProduct.data)
      thisProduct.el = utils.createDOMFromHTML(genaratedHTML)
      console.log(genaratedHTML)
      const mContainer = document.querySelector(select.containerOf.menu)
      mContainer.appendChild(thisProduct.el)
  }
  
  getElements(){
    const thisProduct = this;
  
    thisProduct.accordionTrigger = thisProduct.el.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.el.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.el.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.el.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.el.querySelector(select.menuProduct.imageWrapper)
    thisProduct.amountWidgetEl = thisProduct.el.querySelector(select.menuProduct.amountWidget)
  }
  
  initAmountWidget(){
   const thisProduct = this;
   thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetEl);
   thisProduct.amountWidgetEl.addEventListener('redo', function(){thisProduct.processOrder()});
  }
  
  
  
  initAccordion() {
    const thisProduct = this;
    thisProduct.accordionTrigger.addEventListener('click', function(event) {
    event.preventDefault();
    const activeProduct = document.querySelector(select.all.menuProductsActive)
      if (activeProduct !== null && activeProduct !== thisProduct.el) {
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive); 
      }
  
    thisProduct.el.classList.toggle(classNames.menuProduct.wrapperActive); 
    });
  }
  
    processOrder(){
      const thisProduct = this;
      console.log(this.processOrder)
      const om = utils.serializeFormToObject(thisProduct.form)
      console.log(om)
      let price = thisProduct.data.price;
  
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        console.log(paramId, param);
  
        for(let optionId in param.options) {
          const option = param.options[optionId];
          const optionImage = thisProduct.imageWrapper.querySelector(`.${paramId}-${optionId}`);
          //const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId); -- OPTIONAL
          const clickedElement = om[paramId] && om[paramId].includes(optionId);
          if (optionImage) {
            if (clickedElement) {
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            }
            else {
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
      
          if(clickedElement && option.default !== true) {
            price = price + option.price
          }
            else if((option.default == true) && !(om[paramId] && om[paramId].includes(optionId))) {
              price = price - option.price;
              }
            else {
            if(option.default == true) {
              price == price 
  
            }
          }
        }
    }
        price *= thisProduct.amountWidget.value;
        thisProduct.priceSingle = price;
        thisProduct.priceElem.innerHTML = price;
     }
  
  
    prepareCartProductParams() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = {};
  
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        console.log(paramId, param);
  
        params[paramId] = {
          label: param.label,
          options: {}
        }
          for(let optionId in param.options) {
  
            const option = param.options[optionId];
            const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
  
            if(optionSelected){
              params[paramId].options[optionId] = option.label;
              console.log(option.label)
            }
          }
      }
      return params;   
    }
  
  
    prepareCartProduct(){
      const thisProduct = this;
      const productSummary = {
      id: thisProduct.id,
      name: thisProduct.id,
      amount: thisProduct.amountWidget.value, 
      priceSingle: thisProduct.priceSingle / thisProduct.amountWidget.value ,
      price: thisProduct.priceSingle,
      params: thisProduct.prepareCartProductParams(),
     }
     return productSummary
    }
  
  
  
    initOrderForm(){
      const thisProduct = this;
      console.log(this.initOrderForm)
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart()
      });
    }
  
    addToCart() {
      const thisProduct = this;
   
      //  app.cart.add(thisProduct.prepareCartProduct());
      const event = new CustomEvent('add-to-cart', {
        bubbles: true,
        detail: {
          product: thisProduct.prepareCartProduct(),
        },
      }
      );
      thisProduct.element.dispatchEvent(event);
   }
  
  }

  export default Product