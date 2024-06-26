
import DatePicker from "../DatePicker.js";
import { select, templates } from "../settings.js";
import AmountWidget from "./amountWidget.js";
//import HourPicker from '../HourPicker.js'

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
        thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper)
        thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper)

    }
    initWidget(){
        const thisBooking = this;
        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount)
        thisBooking.hoursAmountWidget =  new AmountWidget(thisBooking.dom.hoursAmount)
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker)
       // thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker)

    }
}
export default Booking