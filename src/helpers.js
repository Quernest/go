export const getOffsetY = (e) => {
  let element = e.target ? e.target : e.srcElement;
  let y = 0;

  while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
    y += element.offsetTop - element.scrollTop;
    element = element.offsetParent;
  }

  y = e.clientY + pageYOffset - y;

  return y;
};