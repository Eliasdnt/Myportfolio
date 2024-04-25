
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
                duration: 1300,
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

function ajustarCols() {
  const larguraTela = window.innerWidth;
  let cols = 0;

  if (larguraTela >= 1000) {
    cols = 85; // Ajuste conforme necessário
    
  } else if(larguraTela <=1000 && larguraTela >= 700){
        cols = 50
    } 
    else if (larguraTela <= 700 && larguraTela >= 480) {
        
        cols = 40;
  }
  else if (larguraTela <= 480 && larguraTela >= 390) {
         cols = 30;
  }
  else if(larguraTela <= 390){
        cols =20;
  }

  const textareas = document.querySelectorAll('textarea[cols]');
  for (const textarea of textareas) {
    textarea.cols = cols;
  }
}

window.addEventListener('load', ajustarCols);
window.addEventListener('resize', ajustarCols);




const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', function () {
  menu.classList.toggle('show');
});
