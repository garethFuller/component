export default function() {
  // create the component using E26 class :D
  class ListComponent extends HTMLElement {
    createdCallback() {
      console.log('the item was created');
    }

    attchaedCallback() {
      console.log('the item was attached');
    }

   detachedCallback() {
      console.log('the item was detached');
    }

    attributeChanged(attr, oldVal, newVal) {
      console.log('attr changed', attr, oldVal, newVal);
    }
  }

  document.registerElement('list-component', ListComponent);

}
