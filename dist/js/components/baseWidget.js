

class BaseWidget {
    constructor(wrapperElement, initialValue){
      const thisWidhet = this;
      thisWidhet.dom = {}
        thisWidhet.dom.wrapper = wrapperElement
        thisWidhet.value = initialValue
    }
}

export default BaseWidget