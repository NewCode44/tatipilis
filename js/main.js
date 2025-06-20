/**
 * Los Tatipilis - Script Principal
 * Archivo: main.js
 *
 * Este archivo controla las funcionalidades principales del sitio,
 * incluyendo la navegación, carruseles, reproductor de audio,
 * y otras interacciones con el usuario.
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los componentes
    initPreloader();
    initAudioPlayer();
    initCharacterCarousel();
    initCategoryCards();
    initAnimations();
    initNavigationEffects();
    addInteractiveEffects();
    initHeaderSolidOnScroll(); // <- NUEVA FUNCIÓN CLAVE
});

/**
 * Inicializa el preloader y la animación de carga
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    if (!preloader) return;

    // Simular tiempo de carga (se puede reemplazar con carga real de assets)
    window.addEventListener('load', () => {
        // Iniciar animación de desvanecimiento después de cargar todo
        setTimeout(() => {
            preloader.classList.add('fade-out');

            // Eliminar el preloader del DOM después de la animación
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }

                // Animar la entrada de los elementos principales
                animatePageEntrance();
            }, 1000);
        }, 1500);
    });

    // Inicializar la animación del logo con Lottie si está disponible
    if (window.lottie && document.getElementById('logo-animation')) {
        const logoAnimation = lottie.loadAnimation({
            container: document.getElementById('logo-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'animations/intro.json' // Ruta a la animación del logo
        });
    }
}

/**
 * Anima la entrada de los elementos principales
 */
function animatePageEntrance() {
    // Elementos que aparecerán con efecto
    const header = document.querySelector('header');
    const welcomeContent = document.querySelector('.welcome-content');

    if (header) {
        header.classList.add('fade-in');
    }

    if (welcomeContent) {
        welcomeContent.classList.add('fade-in-up');
    }

    // Animar los troncos de navegación en secuencia
    const navTroncos = document.querySelectorAll('.nav-tronco');
    navTroncos.forEach((tronco, index) => {
        tronco.style.setProperty('--index', index);
        setTimeout(() => {
            tronco.classList.add('bounce-in');
        }, 100 * index);
    });
}

/**
 * Inicializa el reproductor de audio ambiental
 */
function initAudioPlayer() {
    const audioToggle = document.getElementById('audio-toggle');
    const ambientSound = document.getElementById('ambient-sound');

    if (!audioToggle || !ambientSound) return;

    let isPlaying = false;

    // Función para cambiar el estado de reproducción
    const toggleAudio = () => {
        if (isPlaying) {
            ambientSound.pause();
            audioToggle.querySelector('img').src = 'img/ui/iconos/audio-off.png';
        } else {
            // Intentar reproducir el audio (puede requerir interacción del usuario en algunos navegadores)
            const playPromise = ambientSound.play();

            // Manejar la promesa para evitar errores
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audioToggle.querySelector('img').src = 'img/ui/iconos/audio-on.png';
                }).catch(error => {
                    console.log('Auto-play was prevented. User interaction is required.');
                });
            }
        }

        isPlaying = !isPlaying;
    };

    // Asignar el evento de clic
    audioToggle.addEventListener('click', toggleAudio);

    // Función para cambiar volumen gradualmente
    window.fadeAudio = (direction) => {
        if (!ambientSound) return;


        const targetVolume = direction === 'in' ? 1 : 0;
        const fadeInterval = setInterval(() => {
            if (direction === 'in') {
                ambientSound.volume += 0.05;
                if (ambientSound.volume >= targetVolume) {
                    ambientSound.volume = targetVolume;
                    clearInterval(fadeInterval);
                }
            } else {
                ambientSound.volume -= 0.05;
                if (ambientSound.volume <= targetVolume) {
                    ambientSound.volume = targetVolume;
                    clearInterval(fadeInterval);
                    if (targetVolume === 0) {
                        ambientSound.pause();
                    }
                }
            }
        }, 100);
    };
}

/**
 * Inicializa el carrusel de personajes
 */
function initCharacterCarousel() {
    const characterContainer = document.querySelector('.character-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    if (!characterContainer || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const itemCount = dots.length;

    // Función para actualizar el carrusel
    const updateCarousel = (index) => {
        // Validar el índice
        if (index < 0) index = itemCount - 1;
        if (index >= itemCount) index = 0;

        currentIndex = index;

        // Mover el contenedor
        characterContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualizar los puntos de navegación
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    // Asignar eventos
    prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));

    // Evento para los puntos de navegación
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateCarousel(index));
    });

    // Autoplay (opcional)
    let autoplayInterval;

    const startAutoplay = () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, 5000);
    };

    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    };

    // Iniciar autoplay
    startAutoplay();

    // Detener autoplay al interactuar
    [prevBtn, nextBtn, ...dots].forEach(el => {
        el.addEventListener('mouseenter', stopAutoplay);
        el.addEventListener('mouseleave', startAutoplay);
    });

    // Inicializar animaciones de personajes con Lottie
    initCharacterAnimations();
}

/**
 * Inicializa las animaciones de los personajes
 */
function initCharacterAnimations() {
    if (!window.lottie) return;

    const charactersToAnimate = [
        { id: 'axli-anim', path: 'img/personajes/axli/axli-animation.json' },
        { id: 'indajani-anim', path: 'img/personajes/indajani/indajani-animation.json' },
        // Añadir otros personajes aquí
    ];

    charactersToAnimate.forEach(char => {
        const element = document.getElementById(char.id);
        if (element) {
            lottie.loadAnimation({
                container: element,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: char.path
            });
        }
    });
}

/**
 * Inicializa las tarjetas de categorías
 */
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        // Añadir efecto hover avanzado
        card.addEventListener('mouseenter', () => {
            const overlay = card.querySelector('.category-overlay');
            if (overlay) {
                overlay.classList.add('fade-in-up');
            }
        });

        card.addEventListener('mouseleave', () => {
            const overlay = card.querySelector('.category-overlay');
            if (overlay) {
                overlay.classList.remove('fade-in-up');
            }
        });
    });
}

/**
 * Inicializa las animaciones generales
 */
function initAnimations() {
    // Animación de elementos que aparecen al hacer scroll
    const animatedElements = document.querySelectorAll('.animated-element, .intro-content, .section-heading, .character-cta, .conservation-content');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                // Opcional: dejar de observar después de animar
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Inicializar efectos de partículas
    initParticles();
}

/**
 * Inicializa los efectos de partículas (hojas, mariposas, etc.)
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;

    // Crear hojas flotantes
    for (let i = 0; i < 15; i++) {
        createLeaf(particlesContainer);
    }

    // Crear mariposas volando (opcional)
    for (let i = 0; i < 5; i++) {
        createButterfly(particlesContainer);
    }
}

/**
 * Crea una hoja animada y la añade al contenedor
 * @param {HTMLElement} container - Contenedor de partículas
 */
function createLeaf(container) {
    const leaf = document.createElement('div');
    leaf.className = 'falling-leaf';

    // Asignar una imagen aleatoria de hoja
    const leafIndex = Math.floor(Math.random() * 3) + 1; // Asumiendo que hay 3 tipos de hojas
    leaf.style.backgroundImage = `url('img/ui/hojas/hoja${leafIndex}.png')`;

    // Posición y tamaño aleatorios
    const size = 20 + Math.random() * 30; // Tamaño entre 20px y 50px
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    leaf.style.left = `${Math.random() * 100}%`;

    // Valor aleatorio para CSS variables
    leaf.style.setProperty('--random', Math.random());

    // Añadir al contenedor
    container.appendChild(leaf);

    // Eliminar y reemplazar la hoja después de la animación
    leaf.addEventListener('animationend', () => {
        container.removeChild(leaf);
        createLeaf(container);
    });
}

/**
 * Crea una mariposa animada y la añade al contenedor
 * @param {HTMLElement} container - Contenedor de partículas
 */
function createButterfly(container) {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';

    // Crear alas
    const wings = document.createElement('div');
    wings.className = 'butterfly-wings';
    wings.style.backgroundImage = `url('img/ui/animaciones/mariposa.png')`;

    butterfly.appendChild(wings);

    // Posición y tamaño aleatorios
    const size = 30 + Math.random() * 20; // Tamaño entre 30px y 50px
    butterfly.style.width = `${size}px`;
    butterfly.style.height = `${size}px`;
    butterfly.style.position = 'absolute';
    butterfly.style.top = `${Math.random() * 80 + 10}%`; // Entre 10% y 90% vertical
    butterfly.style.left = `${Math.random() * 80 + 10}%`; // Entre 10% y 90% horizontal

    // Valor aleatorio para CSS variables
    butterfly.style.setProperty('--random', Math.random());

    // Añadir al contenedor
    container.appendChild(butterfly);

    // Movimiento aleatorio cada cierto tiempo
    setInterval(() => {
        const newTop = Math.random() * 80 + 10;
        const newLeft = Math.random() * 80 + 10;
        butterfly.style.top = `${newTop}%`;
        butterfly.style.left = `${newLeft}%`;
        butterfly.style.transition = 'top 5s ease, left 5s ease';
    }, 5000);
}

/**
 * Inicializa efectos para la navegación
 */
function initNavigationEffects() {
    const navTroncos = document.querySelectorAll('.nav-tronco');

    // Marca activo el tronco actual según la página
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navTroncos.forEach(tronco => {
        const link = tronco.querySelector('a');
        if (link && link.getAttribute('href') === currentPage) {
            tronco.classList.add('active');
        }
    });

    // Efecto al hacer hover en los troncos
    navTroncos.forEach(tronco => {
        tronco.addEventListener('mouseenter', () => {
            if (!tronco.classList.contains('active')) {
                tronco.classList.add('wiggle');
            }
        });

        tronco.addEventListener('mouseleave', () => {
            tronco.classList.remove('wiggle');
        });
    });
}

/**
 * Añade efectos interactivos a varios elementos
 */
function addInteractiveEffects() {
    // Efectos para botones mágicos
    const magicButtons = document.querySelectorAll('.btn-magic');

    magicButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('pulse');
            playSound('magic-hover');
        });

        btn.addEventListener('mouseleave', () => {
            btn.classList.remove('pulse');
        });

        btn.addEventListener('click', () => {
            btn.classList.add('glow');
            createMagicEffect(btn);
            setTimeout(() => {
                btn.classList.remove('glow');
            }, 700);
            playSound('magic-click');
        });
    });
}

/**
 * Crea un efecto mágico visual
 * @param {HTMLElement} element - Elemento sobre el que crear el efecto
 */
function createMagicEffect(element) {
    // Crear elemento para el efecto
    const effect = document.createElement('div');
    effect.className = 'magic-spark';

    // Estilo del efecto
    effect.style.position = 'absolute';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.width = '100%';
    effect.style.height = '100%';
    effect.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,150,0) 70%)';
    effect.style.borderRadius = '50%';
    effect.style.pointerEvents = 'none';

    // Añadir el efecto al elemento
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(effect);

    // Eliminar después de la animación
    setTimeout(() => {
        if (element.contains(effect)) {
            element.removeChild(effect);
        }
    }, 1000);
}

/**
 * Reproduce un efecto de sonido
 * @param {string} soundName - Nombre del sonido a reproducir
 */
function playSound(soundName) {
    // Mapa de sonidos disponibles
    const sounds = {
        'magic-hover': 'audio/efectos/magic-hover.mp3',
        'magic-click': 'audio/efectos/magic-click.mp3',
        'leaf-fall': 'audio/efectos/hoja-caer.mp3',
        'bird-sing': 'audio/efectos/pajaro-cantar.mp3'
    };

    // Verificar si el sonido existe
    if (!sounds[soundName]) return;

    // Crear y reproducir el audio
    const audio = new Audio(sounds[soundName]);
    audio.volume = 0.3; // Volumen bajo para no interferir
    audio.play().catch(e => {
        // Ignorar errores de reproducción automática
        console.log('Sound play was prevented by browser policy.');
    });
}

/**
 * Hace que el header se vuelva sólido al hacer scroll
 */
function initHeaderSolidOnScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    function checkHeaderSolid() {
        if (window.scrollY > 30) {
            header.classList.add('solid');
        } else {
            header.classList.remove('solid');
        }
    }
    window.addEventListener('scroll', checkHeaderSolid);
    // Llamar una vez al inicio por si ya está scrolleado
    checkHeaderSolid();
}

// Exportar funciones para uso en consola (debug)
window.tatipilisUI = {
    createMagicEffect,
    playSound,
    fadeAudio
};
// --- STICKY HEADER INTELIGENTE PARA MENU DE TATIPILIS ---
document.addEventListener('DOMContentLoaded', () => {
    // Elemento a hacer sticky (puedes cambiar 'header' por '.main-header' si usas otro selector)
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    let lastScroll = 0;
    let ticking = false;

    // Crear clase para ocultar el header suavemente
    if (header) {
        if (!document.getElementById('sticky-header-style')) {
            const style = document.createElement('style');
            style.id = 'sticky-header-style';
            style.innerHTML = `
                header.sticky {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: 3000;
                    transition: transform 0.4s cubic-bezier(.77,0,.18,1), background 0.4s, box-shadow 0.4s;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.09);
                    background: rgba(255, 230, 179, 0.97);
                }
                header.sticky.hide {
                    transform: translateY(-100%);
                }
                body.sticky-menu-active {
                    padding-top: 90px; /* ajusta según altura del header */
                }
            `;
            document.head.appendChild(style);
        }
    }

    function onScroll() {
        if (!header || !footer) return;

        // Sticky header al hacer scroll
        if (window.scrollY > 30) {
            header.classList.add('sticky');
            document.body.classList.add('sticky-menu-active');
        } else {
            header.classList.remove('sticky');
            document.body.classList.remove('sticky-menu-active');
        }

        // Verificar si el footer está visible en viewport
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // Si cualquier parte visible
        if (footerRect.top < windowHeight && footerRect.bottom > 0) {
            // Ocultar header con animación
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }

        lastScroll = window.scrollY;
        ticking = false;
    }

    // Usar requestAnimationFrame para mejor rendimiento
    function requestScroll() {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScroll);
    // Llama una vez al cargar por si ya está abajo
    onScroll();
});
