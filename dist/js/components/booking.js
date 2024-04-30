
import { select, templates } from "../settings.js";
import AmountWidget from "./amountWidget.js";

class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidget();
    }

    render(element){
        const thisBooking = this;
        const genaratedHTML = templates.bookingWidget(element);
        thisBooking.dom = {}
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML  = genaratedHTML;
        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount)
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount)
    
    }
    initWidget(){
        const thisBooking = this;
        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount)
        thisBooking.hoursAmountWidget =  new AmountWidget(thisBooking.dom.hoursAmount)

    }
}
export default Booking