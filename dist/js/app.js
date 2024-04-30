import { select} from "./settings.js";
import Product  from './components/product.js';
import Koszyk from'./components/cart.js'
import dataSource from "./data.js";

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
      thisApp.productList = document.querySelector(select.containerOf.menu);
      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.cart.add(event.details.product)
      })
     },
   initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages)
   },



    init: function(){
      const thisApp = this;
      app.initData();
      app.initMenu();
      app.initCart();
      app.initPages();
      
    }
   
  };

  app.init();
