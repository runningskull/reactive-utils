var reactive = require('reactive')
  , foreach = require('lodash.foreach')

module.exports = function (template_or_el, model, options) {
  options = options || {}
  options.bindings = options.bindings || {}
  options.bindings['keep-if'] = keepIf

  if (options.partials) {
    foreach(options.partials, function (View, name) {
      options.bindings['partial-'+name] = partial(View)
    })
  }

  return reactive(template_or_el, model, options)
}



// ---- Bindings ----

/* Our way of doing nested templates.
 *
 *  Example: 
 *      after doing 
 *          `reactive(tpl, model, {partials: {myPartial: ...}})`
 *      you can then do
 *          `<div partial-myPartial>`
 *
 *      You can also pass params to the partial like this:
 *          `<div partial-myPartial="x y z">`
 *
 */
function partial (Partial) {
  return function (el, property) {
    var partial = new Partial(this.reactive, property)
    el.parentNode.replaceChild(partial.view.el, el)
  }
}


/* Keeps the element on a page if a property is true.
 * Opposite of removeIf.
 *
 *  Example:
 *      `<span class="profile-data" keep-if="hasProfile">`
 *  
 */
function keepIf(el, property){
  var binding = this
    , parent = el.parentNode

  binding.change(function() {
    var value = binding.value(property)
    console.log('keep-if', property, value, el, el.parentNode, parent)
    if (!value && el.parentNode) {
      el.parentNode.removeChild(el)
    } else if (value && !el.parentNode) {
      parent.appendChild(el)
    }
  });
};
