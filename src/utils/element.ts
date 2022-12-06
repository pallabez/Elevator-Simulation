export const createElement = (
  className: Array<string> = [],
  attributes: { [value: string]: string } = {},
  type: string = 'div',
): any => {
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

export const createElementButton = (
  className: Array<string> = [],
  attributes: { [value: string]: string } = {},
): HTMLButtonElement => {
  return createElement(className, attributes, 'button');
}