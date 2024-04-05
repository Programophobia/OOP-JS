/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
  templateOf: {
    menuProduct: "#template-menu-product",
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };


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
 thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetEl)
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
      console.log(optionId, option);
      const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
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

  thisProduct.priceElem.innerHTML = price;
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
    });
  }
}

class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value)
    thisWidget.initCount()
    console.log(thisWidget);
    console.log(element)
  }

  getElements(element){
    const thisWidget = this;
  
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value){
const thisWidget = this;
const  newValue = parseInt(value)
/* TODO: Add validation */
if(thisWidget.value !== newValue && !isNaN(newValue)) {
  thisWidget.value = newValue;
}
if(newValue == isNaN || newValue > 9){
thisWidget.value = 1
  }
  thisWidget.input.value = thisWidget.value;
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


  const app = {
    initData: function(){
      const thisData = this;
      thisData.data = dataSource;
      console.log(thisData.data)
    },

    initMenu: function(){
      const thisApp = this;
      console.log(thisApp.data)
      
     for(let productData in thisApp.data.products){
      new Product(productData, thisApp.data.products[productData])
      console.log(thisApp.data.products[productData])
     }
    },
    
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      app.initData();
      app.initMenu();
      
    }
   
  };

  app.init();
}
