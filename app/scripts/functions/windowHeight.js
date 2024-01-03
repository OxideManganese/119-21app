(() => {
  const wpr = (event) => {
    const ls = event.type[0], offest = window.pageYOffset, height = window.innerHeight, bd = document.body;
    if (ls == 'D' || ls == 's' && Math.min(bd.style.getPropertyValue('--pageOffset').replace('px',''), offest) <= height)
      bd.style.setProperty('--pageOffset', offest + 'px');
    if (ls == 'D' || ls == 'r') bd.style.setProperty('--windowHeight', height + 'px');
  }
  window.addEventListener('DOMContentLoaded', wpr);
  window.addEventListener('resize', wpr);
  window.addEventListener('scroll', wpr);
})()