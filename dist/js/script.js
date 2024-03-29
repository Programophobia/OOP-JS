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

  //initAccordion(){
 //   const thisProduct = this;
/* find the clickable trigger (the element that should react to clicking) */
//const clickableTrigger = select.menuProduct.clickable;

/* START: add event listener to clickable trigger on event click */
//clickableTrigger.addEventListener('click', function(event) {
  /* prevent default action for event */
//event.preventDefault();
  /* find active product (product that has active class) */
//const activeProduct = document.querySelector(classNames.menuProduct.wrapperActive);
  /* if there is active product and it's not thisProduct.element, remove class active from it */
//if(activeProduct && activeProduct !== thisProduct.el){
 // thisProduct.el.classList.toggle('active')
//}
  /* toggle active class on thisProduct.element */
//});

//}
initAccordion() {
  const thisProduct = this;
  //find the clicable trigger (the element that should react to clicking)
  const clickableTrigger = thisProduct.el.querySelector(select.menuProduct.clickable);

  /* START: add event listener to clickable trigger on event click */
  clickableTrigger.addEventListener('click', function(event) {
   /* prevent default action for event */
   event.preventDefault();
    /* find active product (product that has active class) */
   // const activeProduct = document.querySelector(classNames.menuProduct.wrapperActive);
   const activeProduct = document.querySelector(select.all.menuProductsActive)
//if there is active product and it's not thisProduct.element, remove class active from it */
//for(let active of activeProduct){
if (activeProduct !== null && activeProduct !== thisProduct.el) {

  activeProduct.classList.remove(classNames.menuProduct.wrapperActive); //==activeProduct.classList.toggle('active')
}

  /* toggle active class on thisProduct.element */
  thisProduct.el.classList.toggle(classNames.menuProduct.wrapperActive); //== thisProduct.element.classList.toggle('active)
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
