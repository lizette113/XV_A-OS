document.addEventListener("DOMContentLoaded", function() {
    
    // =========================================
    // 1. GENERACIÓN DE ESTRELLAS DE FONDO
    // =========================================
    const container = document.getElementById('stars-bg');
    const shapes = ['✦', '✧', '★', '✶'];
    const totalStars = 150; // Cantidad ideal para no saturar
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Posicionamiento libre por toda la pantalla
        star.style.left = Math.random() * 98 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Tamaños sutiles para no competir con el texto
        const size = (Math.random() * 10 + 4); 
        star.style.fontSize = size + 'px';
        
        // Retraso aleatorio para un efecto de parpadeo natural
        star.style.animationDelay = (Math.random() * 2) + 's';
        
        // Agregamos al fragmento para optimizar el rendimiento
        fragment.appendChild(star);
    }
    
    // Inyectamos todas las estrellas de una sola vez
    if (container) {
        container.appendChild(fragment);
    }

    // =========================================
    // 2. PARALLAX FLUIDO (Scroll)
    // =========================================
    const parallaxItems = document.querySelectorAll('.parallax-item');
    let scrollY = window.scrollY;
    let ticking = false;

    // Detectamos el scroll pero usamos requestAnimationFrame para máxima fluidez
    window.addEventListener('scroll', function() {
        scrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateParallax() {
        // Leemos la velocidad de cada elemento y aplicamos el desfase
        parallaxItems.forEach(item => {
            // Si el elemento no tiene data-speed, usa 0.1 por defecto
            const speed = item.getAttribute('data-speed') || 0.1;
            const yPos = scrollY * speed;
            
            // Excepción para el bloque de fecha: necesita mantener su escala de la animación de entrada
            if(item.classList.contains('parallax-date-entry') && !item.classList.contains('active')) {
                item.style.transform = `translateY(${yPos}px) scale(0.9)`;
            } else if (item.classList.contains('parallax-date-entry') && item.classList.contains('active')) {
                item.style.transform = `translateY(${yPos}px) scale(1)`;
            } else {
                // Para todos los demás elementos parallax (tiara, textos, adornos)
                item.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // =========================================
    // 3. OBSERVER PARA ANIMACIONES DE ENTRADA
    // =========================================
    const observerOptions = { 
        threshold: 0.1 // Se activa cuando el 10% del elemento es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activa la animación añadiendo la clase 'active'
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Seleccionamos y observamos TODAS las clases que tienen animación de aparición
    const elementsToAnimate = document.querySelectorAll('.reveal, .parallax-up, .parallax-date-entry, .parallax-ornament');
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});