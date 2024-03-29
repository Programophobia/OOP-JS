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
    console.log(thisProduct)
    thisProduct.initAccordion();
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


initAccordion() {
  const thisProduct = this;
 
  const clickableTrigger = thisProduct.el.querySelector(select.menuProduct.clickable);

  clickableTrigger.addEventListener('click', function(event) {

   event.preventDefault();

   const activeProduct = document.querySelector(select.all.menuProductsActive)

if (activeProduct !== null && activeProduct !== thisProduct.el) {

  activeProduct.classList.remove(classNames.menuProduct.wrapperActive); 
}


  thisProduct.el.classList.toggle(classNames.menuProduct.wrapperActive); 
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
