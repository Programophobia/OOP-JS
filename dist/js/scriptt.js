/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', 
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
        input: 'input.amount', 
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
   
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
   
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  
    cart: {
      wrapperActive: 'active',
    },
 
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, 
    cart: {
      defaultDeliveryFee: 20,
    },
  
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    
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

  addToCart(){
    const thisProduct = this;
    app.cart.add(thisProduct.prepareCartProduct())
  }

}


class AmountWidget{
  constructor(element){
  const thisWidget = this;
  thisWidget.getElements(element);
    if (thisWidget.input.value === '' || thisWidget.input.value === undefined ) {
      thisWidget.setValue(settings.amountWidget.defaultValue)
  } else {
      thisWidget.setValue(thisWidget.input.value);
  }
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


  const app = {
    initData: function(){
      const thisData = this;
      thisData.data = dataSource;
      console.log(thisData.data);
    },

    initMenu: function(){
      const thisApp = this;
      console.log(thisApp.data);
      
     for(let productData in thisApp.data.products){
      new Product(productData, thisApp.data.products[productData]);
      console.log(thisApp.data.products[productData]);
     }
    },

    initCart: function(){
      const thisApp = this;
      const cartEl = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Koszyk(cartEl);
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
      app.initCart();
      
    }
   
  };

  app.init();
}



