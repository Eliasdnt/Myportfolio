const numerosElement = document.querySelectorAll('span[data-numeros]');
let animacaoIniciada = false; // Variável de controle para verificar se a animação já foi iniciada

window.addEventListener('scroll', () => {
    if (!animacaoIniciada) { // Verifica se a animação ainda não foi iniciada
        numerosElement.forEach(numeroElement => {
            const positionTop = numeroElement.getBoundingClientRect().top;
            const valorTotal = parseInt(numeroElement.getAttribute('data-numeros'));

            if (positionTop <= window.innerHeight) {
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            let contador = 0;
                            let intervalo;

                            animacaoIniciada = true; // Marca a animação como iniciada
                            intervalo = setInterval(() => {
                                contador++;
                                numeroElement.textContent = contador;

                                if (contador >= valorTotal) {
                                    clearInterval(intervalo);
                                }
                            }, 350);

                            observer.disconnect(); // Desconecta o observer após iniciar a animação
                        }
                    });
                });

                observer.observe(numeroElement);
            }
        });
    }
});