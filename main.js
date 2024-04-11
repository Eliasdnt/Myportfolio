


document.addEventListener('DOMContentLoaded', () => {
  const typedElements = document.querySelectorAll('.typed');
  typedElements.forEach(typed => {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');

    new Typed(typed, {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 70,
      backDelay: 1000,
      onComplete: (self) => {
        const typedElement = self.el;
        typedElement.classList.add('animate__animated', 'animate__fadeOut');
        setTimeout(() => {
          self.reset();
          typedElement.classList.remove('animate__animated', 'animate__fadeOut');
        }, 100); 
      }
    });
  });
});
