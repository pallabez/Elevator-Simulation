export const createElement = (
  type = 'div',
  attributes = {},
) => {
  const el = document.createElement(type);

  Object
    .keys(attributes)
    .forEach(key => el.setAttribute(key, attributes[key]));

  return el;
}