import { classNames, select} from "./settings.js";
import Product  from './components/product.js';
import Koszyk from'./components/cart.js'
import dataSource from "./data.js";

  const app = {
    initData: function(){
      const thisData = this;
      thisData.data = dataSource;
      console.log(thisData.data);
    },
    initPages: function(){
      const thisApp = this;
  
      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelectorAll(select.nav.links);
        const IFromHash = window.location.hash.replace('#/', '');
        let pageMatchId = thisApp.pages[0].id;
  
        for(let page of thisApp.pages){
          if( page.id == IFromHash)
            pageMatchId = page.id;
            break
         
        }
  
      thisApp.activatePage(IFromHash);
  
      for(let link of thisApp.navLinks){
          link.addEventListener('click', function(event){
              const clickedEl = this;
              event.preventDefault()
              const hrefId = clickedEl.getAttribute('href').replace('#', '')
              thisApp.activatePage(hrefId)
              window.location.hash = '#/' + hrefId })
       }
     },
    activatePage: function(pageI){
      const thisApp = this;
  
      for (let page of thisApp.pages){

        page.classList.toggle(classNames.pages.active, page.id == pageI)

      }
      for (let link of thisApp.navLinks){

        link.classList.toggle(classNames.nav.active, 
        link.getAttribute('href') == '#' + pageI)

      }
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




    init: function(){
      const thisApp = this;
      app.initData();
      app.initMenu();
      app.initCart();
      app.initPages();
      
    }
   
  };

  app.init();
