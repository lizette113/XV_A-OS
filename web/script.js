document.addEventListener("DOMContentLoaded", function() {
    
    // =========================================
    // 1. FUNCIÓN PARA GENERAR ESTRELLAS
    // =========================================
    function createStars(containerId, totalStars = 150) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const shapes = ['✦', '✧', '★', '✶'];
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
        container.appendChild(fragment);
    }
    
    // Generar estrellas en ambos lugares
    createStars('stars-bg', 150);
    createStars('start-screen-stars', 120);

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
function startExperience() {
    document.getElementById("start-screen").style.display = "none";

    const audio = document.getElementById("music");
    audio.volume = 0;

    audio.play();

    let vol = 0;
    const fade = setInterval(() => {
        if (vol < 0.5) {
            vol += 0.05;
            audio.volume = vol;
        } else {
            clearInterval(fade);
        }
    }, 200);

    // Iniciar contador de tiempo
    startCountdown();
}

// =========================================
// FUNCIÓN DEL CONTADOR DE TIEMPO
// =========================================
function startCountdown() {
    // Fecha del evento: 20 de junio de 2026
    const eventDate = new Date('2026-06-20T18:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        // Calcular días, horas, minutos, segundos
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Actualizar elementos
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // Si el evento ya pasó
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    // Actualizar inmediatamente
    updateCountdown();

    // Actualizar cada segundo
    setInterval(updateCountdown, 1000);
}