import component from './component';

// run the function exported by component
component();

// do some little tests with our new component
var elem = document.createElement('list-component');

// add a new instance of the new elem to the document
document.body.appendChild(elem);
// play with some attrs
elem.setAttribute('foo', 'bar');

// remove it again
document.body.removeChild(elem);

console.log('the import in included');
