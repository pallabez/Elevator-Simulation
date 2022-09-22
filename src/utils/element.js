export const createElement = (
  className = [],
  attributes = {},
  type = 'div',
) => {
  try {
    const el = document.createElement(type);
    className.forEach(name => el.classList.add(name));
  
    Object
      .keys(attributes)
      .forEach(key => el.setAttribute(key, attributes[key]));
  
    return el;
  } catch(e) {
    console.error('Error in creating element:: ', e);
  }
}