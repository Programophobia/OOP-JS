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
    thisProduct.processOrder();
  }
  renderInMenu(){
        const thisProduct = this;
    //generate html from template
    const genaratedHTML = templates.menuProduct(thisProduct.data)
    //DOM el
    thisProduct.el = utils.createDOMFromHTML(genaratedHTML)
    console.log(genaratedHTML)
    //container
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
     // set price to default price
  let price = thisProduct.data.price;

  // for every category (param)...
  for(let paramId in thisProduct.data.params) {
    // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
    const param = thisProduct.data.params[paramId];
    console.log(paramId, param);

    // for every option in this category
    for(let optionId in param.options) {
      // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
      const option = param.options[optionId];
      console.log(optionId, option);
    
      // check if there is param with a name of paramId in formData and if it includes optionId
      if(om[paramId] && om[paramId].includes(optionId) && option.default !== true) {
        // check if the option is not default
     
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

  // update calculated price in the HTML
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
