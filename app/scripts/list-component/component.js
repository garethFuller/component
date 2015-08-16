export default function() {
  // create the component using E26 class :D
  class ListComponent extends HTMLElement {
    createdCallback() {
      console.log('the item was created');
    }

    attachedCallback() {
      console.log('the item was attached');
    }

   detachedCallback() {
      console.log('the item was detached');
    }

    attributeChangedCallback(attr, oldVal, newVal) {
      console.log('attr changed', attr, oldVal, newVal);
    }
  }

  // register the new list component
  document.registerElement('list-component', ListComponent);
}
