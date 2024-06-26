
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


function scrollSuave() {
    const linksInternos = document.querySelectorAll(".js-menu a[href^='#']");
    console.log(linksInternos);

    function scrollToSection(event) {
        event.preventDefault();
        const href = event.currentTarget.getAttribute('href'); // Fixed typo in currentTarget
        console.log(href);
        const section = document.querySelector(href);

        if (section) { // Added a check if section exists
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                duration: 2500,
            });
        }
    }

    linksInternos.forEach((link) => {
        link.addEventListener('click', scrollToSection); // Added scrollToSection as event listener
    });
}

scrollSuave();


const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
    const formData = new FormData(form);
    e.preventDefault();

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.innerHTML = "Please wait..."

    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = json.message;
            } else {
                console.log(response);
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        });
});


document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector(".js-menu");
  const btn = document.querySelector('#btn'); 
  const links = menu.querySelectorAll('a'); 
// const main = document.querySelector('main'); Efeito de Blur após abrir, irei adicionar
  

  function toggleMenu() {
    menu.classList.toggle('ativo');
  }
  function closeMenu(event) {
    if (!menu.contains(event.target) && !btn.contains(event.target)) {
      menu.classList.remove('ativo');
    }
  }

  btn.addEventListener("click", toggleMenu);
  btn.addEventListener("touchstart", toggleMenu);
  btn.addEventListener("touchend", toggleMenu);
  
  document.addEventListener("click", closeMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('ativo');
    });
  });
});




document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[data-section]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop; // Obtém a posição superior da seção
            const sectionHeight = section.clientHeight; // Obtém a altura da seção
            const scrollY = window.scrollY; // Obtém a posição de rolagem vertical

            // Verifica se a seção está visível no viewport
            if (scrollY >= sectionTop - 180 && scrollY < sectionTop + sectionHeight) {
                section.classList.add('anima'); // Adiciona a classe 'anima' à seção visível
           } // } else {
            //     section.classList.remove('anima'); // Remove a classe 'anima' das seções não visíveis
            // }
        });
    });
});





