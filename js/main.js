
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
  // Configuração da animação de scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anima');
        // Opcional: Parar de observar após animar
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-section]').forEach(section => {
    observer.observe(section);
  });

  // Toggle do Menu
  const menu = document.querySelector(".js-menu");
  const btn = document.querySelector('#btn'); 
  const links = menu.querySelectorAll('a'); 

  function toggleMenu() {
    menu.classList.toggle('ativo');
    const icon = btn.querySelector('i');
    if (menu.classList.contains('ativo')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
      document.body.style.overflow = 'hidden'; // Previne scroll quando menu está aberto
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
      document.body.style.overflow = '';
    }
  }

  function closeMenu() {
    menu.classList.remove('ativo');
    const icon = btn.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
    document.body.style.overflow = '';
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !btn.contains(event.target) && menu.classList.contains('ativo')) {
      closeMenu();
    }
  });

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});

// Scroll Suave Melhorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 100; // Compensação para header fixo se houver
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});






