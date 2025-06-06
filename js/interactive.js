 /**
 * Los Tatipilis - Interacciones
 * Archivo: interactive.js
 * 
 * Este archivo maneja las interacciones específicas del sitio,
 * como animaciones de personajes, elementos interactivos y
 * comportamientos especiales para mejorar la experiencia del usuario.
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las interacciones
    initInteractiveElements();
    initCharacterInteractions();
    initScrollInteractions();
    
    // Inicializar interacciones especiales basadas en la página actual
    initPageSpecificInteractions();
    
    // Inicializar transiciones de página
    initPageTransitions();
    
    // Inicializar el audio
    initAudioInteractions();
    
    // Inicializar menú móvil
    initMobileMenu();
});

/**
 * Inicializa elementos interactivos generales
 */
function initInteractiveElements() {
    // Botones con efectos
    initInteractiveButtons();
    
    // Tarjetas con efectos de hover
    initInteractiveCards();
    
    // Elementos que reaccionan al pasar el ratón
    initHoverEffects();
}

/**
 * Inicializa botones con efectos especiales
 */
function initInteractiveButtons() {
    // Botones con efecto de ondas
    const rippleButtons = document.querySelectorAll('.btn-magic, .btn-explore');
    
    rippleButtons.forEach(button => {
        // Efecto de ondas al hacer clic
        button.addEventListener('click', createRippleEffect);
    });
    
    // Función para crear efecto de ondas
    function createRippleEffect(event) {
        const button = event.currentTarget;
        
        // Crear elemento de onda
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Calcular tamaño (diagonal del botón)
        const buttonRect = button.getBoundingClientRect();
        const diameter = Math.max(buttonRect.width, buttonRect.height);
        ripple.style.width = ripple.style.height = `${diameter}px`;
        
        // Posicionar la onda donde se hizo clic
        const x = event.clientX - buttonRect.left - diameter / 2;
        const y = event.clientY - buttonRect.top - diameter / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Añadir la onda al botón
        button.appendChild(ripple);
        
        // Eliminar la onda después de la animación
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Botones con efecto de brillo
    const buttons = document.querySelectorAll('.action-button, .magic-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
    });
}

/**
 * Inicializa tarjetas con efectos interactivos
 */
function initInteractiveCards() {
    // Tarjetas de categorías
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        // Efecto de "tilt" 3D al mover el mouse
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });
    
    // Función para crear efecto de inclinación 3D
    function handleCardTilt(event) {
        const card = event.currentTarget;
        const cardRect = card.getBoundingClientRect();
        
        // Calcular posición relativa del ratón dentro de la tarjeta
        const x = event.clientX - cardRect.left;
        const y = event.clientY - cardRect.top;
        
        // Calcular porcentaje de la posición (de -1 a 1)
        const xPercent = (x / cardRect.width) * 2 - 1;
        const yPercent = (y / cardRect.height) * 2 - 1;
        
        // Aplicar rotación (limitada a un pequeño ángulo)
        const maxRotation = 5; // Grados máximos de rotación
        card.style.transform = `perspective(1000px) rotateY(${xPercent * maxRotation}deg) rotateX(${-yPercent * maxRotation}deg) scale3d(1.05, 1.05, 1.05)`;
        
        // Efecto de brillo dinámico
        const shine = card.querySelector('.shine-effect');
        if (shine) {
            shine.style.opacity = '1';
            shine.style.transform = `translate(${x}px, ${y}px)`;
        } else {
            // Crear elemento de brillo si no existe
            const newShine = document.createElement('div');
            newShine.classList.add('shine-effect');
            newShine.style.position = 'absolute';
            newShine.style.top = '0';
            newShine.style.left = '0';
            newShine.style.width = '30px';
            newShine.style.height = '30px';
            newShine.style.borderRadius = '50%';
            newShine.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)';
            newShine.style.transform = `translate(${x}px, ${y}px)`;
            newShine.style.pointerEvents = 'none';
            
            // Agregar a la tarjeta
            card.style.overflow = 'hidden';
            card.appendChild(newShine);
        }
    }
    
    // Función para resetear el efecto
    function resetCardTilt(event) {
        const card = event.currentTarget;
        card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
        
        // Ocultar brillo
        const shine = card.querySelector('.shine-effect');
        if (shine) {
            shine.style.opacity = '0';
        }
    }
    
    // Interacción de hover para las tarjetas de personajes
    const personajeCards = document.querySelectorAll('.personaje-card');
    
    personajeCards.forEach(card => {
        const image = card.querySelector('.personaje-full-img');
        
        card.addEventListener('mouseenter', function() {
            if (image) {
                gsap.to(image, {
                    scale: 1.05,
                    duration: 0.5
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.5
                });
            }
        });
    });
    
    // Efectos divertidos para datos curiosos
    const funFacts = document.querySelectorAll('.fun-fact, .cultural-fact');
    
    funFacts.forEach(fact => {
        fact.addEventListener('mouseenter', function() {
            gsap.to(this, {
                backgroundColor: '#FFE6B3',
                x: 10,
                duration: 0.3
            });
        });
        
        fact.addEventListener('mouseleave', function() {
            gsap.to(this, {
                backgroundColor: '#F8F8F8',
                x: 0,
                duration: 0.3
            });
        });
    });
}

/**
 * Inicializa efectos de hover para elementos diversos
 */
function initHoverEffects() {
    // Iconos y elementos pequeños que se amplían
    const hoverElements = document.querySelectorAll('.social-icon, .footer-leaf, .trait');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('pulse');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('pulse');
        });
    });
    
    // Elementos con efecto de flotación
    const floatingElements = document.querySelectorAll('.personaje-full-img, .action-icon');
    floatingElements.forEach(element => {
        // Crear animación de flotación aleatoria
        const randomDuration = 2 + Math.random() * 2; // Entre 2 y 4 segundos
        const randomDelay = Math.random() * 2; // Entre 0 y 2 segundos
        
        gsap.to(element, {
            y: -10,
            duration: randomDuration,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: randomDelay
        });
    });
}

/**
 * Inicializa interacciones específicas para personajes
 */
function initCharacterInteractions() {
    // Tarjetas de personajes
    const characterCards = document.querySelectorAll('.character-card');
    
    characterCards.forEach(card => {
        // Referencia a la imagen del personaje
        const characterImage = card.querySelector('.character-image img');
        
        if (characterImage) {
            // Animación al pasar el ratón
            card.addEventListener('mouseenter', () => {
                // Añadir clase de animación
                characterImage.classList.add('bounce');
                
                // Efecto de sonido específico del personaje (opcional)
                const characterId = card.id;
                if (characterId) {
                    playCharacterSound(characterId);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                // Quitar clase de animación
                characterImage.classList.remove('bounce');
            });
        }
    });
    
    // Inicializar selector de personajes en la página de personajes
    initPersonajesSelector();
    
    // Inicializar botones mágicos de cada personaje
    initMagicButtons();
    
    // Función para reproducir sonido característico de cada personaje
    function playCharacterSound(characterId) {
        // Mapeo de sonidos por personaje
        const characterSounds = {
            'axli': 'audio/personajes/axli.mp3',
            'indajani': 'audio/personajes/indajani.mp3',
            'kauina': 'audio/personajes/kauina.mp3',
            'kuyki': 'audio/personajes/kuyki.mp3',
            'ocelin': 'audio/personajes/ocelin.mp3',
            'tlapu': 'audio/personajes/tlapu.mp3'
        };
        
        // Verificar si existe el sonido
        if (characterSounds[characterId]) {
            const audio = new Audio(characterSounds[characterId]);
            audio.volume = 0.2;
            audio.play().catch(() => {
                // Ignorar errores de autoplay
            });
        }
    }
}

// Función para manejar la selección de personajes
function initPersonajesSelector() {
    const personajeIcons = document.querySelectorAll('.personaje-icon');
    const personajeContainers = document.querySelectorAll('.personaje-detail-container');
    
    if (!personajeIcons.length || !personajeContainers.length) return;
    
    personajeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Obtener el target del personaje seleccionado
            const target = this.getAttribute('data-target');
            
            // Remover clase active de todos los iconos
            personajeIcons.forEach(i => i.classList.remove('active'));
            
            // Agregar clase active al icono seleccionado
            this.classList.add('active');
            
            // Ocultar todos los contenedores de personajes
            personajeContainers.forEach(container => {
                container.classList.remove('active');
                // Detener cualquier efecto de partículas activo
                const particles = container.querySelectorAll('.magic-particles, .friendship-particles, .song-particles, .sound-particles, .truth-particles, .chaos-particles');
                particles.forEach(p => p.classList.remove('active'));
            });
            
            // Mostrar el contenedor del personaje seleccionado
            const selectedContainer = document.getElementById(`${target}-detail`);
            if (selectedContainer) {
                selectedContainer.classList.add('active');
                
                // Agregar efecto de scroll suave hasta el contenedor
                selectedContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Inicializar botones mágicos de cada personaje
function initMagicButtons() {
    // Axli - Detecta cosas mágicas
    const axliButton = document.getElementById('axli-magic-button');
    if (axliButton) {
        axliButton.addEventListener('click', function() {
            activateCharacterPower('axli');
        });
    }
    
    // Indajani - Hace amigos
    const indajaniButton = document.getElementById('indajani-magic-button');
    if (indajaniButton) {
        indajaniButton.addEventListener('click', function() {
            activateCharacterPower('indajani');
        });
    }
    
    // Kauina - Canta con fuerza
    const kauinaButton = document.getElementById('kauina-magic-button');
    if (kauinaButton) {
        kauinaButton.addEventListener('click', function() {
            activateCharacterPower('kauina');
        });
    }
    
    // Kuyki - Imita sonidos
    const kuykiButton = document.getElementById('kuyki-magic-button');
    if (kuykiButton) {
        kuykiButton.addEventListener('click', function() {
            activateCharacterPower('kuyki');
        });
    }
    
    // Ocelín - Huele la verdad
    const ocelinButton = document.getElementById('ocelin-magic-button');
    if (ocelinButton) {
        ocelinButton.addEventListener('click', function() {
            activateCharacterPower('ocelin');
        });
    }
    
    // Tlapu - Provoca desastres
    const tlapuButton = document.getElementById('tlapu-magic-button');
    if (tlapuButton) {
        tlapuButton.addEventListener('click', function() {
            activateCharacterPower('tlapu');
        });
    }
}

// Activar el poder especial de cada personaje
function activateCharacterPower(character) {
    // Obtener el contenedor del personaje
    const container = document.getElementById(`${character}-detail`);
    if (!container) return;
    
    // Obtener elementos relevantes
    const imageContainer = container.querySelector('.personaje-image-container');
    const fullImage = container.querySelector('.personaje-full-img');
    const animationContainer = container.querySelector('.personaje-animation');
    
    // Reproducir la animación Lottie si existe
    if (animationContainer && animationContainer.animation) {
        animationContainer.animation.goToAndPlay(0, true);
    }
    
    // Activar efecto de partículas según el personaje
    let particleEffect;
    let soundEffect;
    
    switch(character) {
        case 'axli':
            particleEffect = container.querySelector('.magic-particles');
            soundEffect = 'audio/efectos/magia-burbujas.mp3';
            // Efecto de detección mágica (brillo y burbujas)
            gsap.to(fullImage, {
                filter: 'drop-shadow(0 0 15px rgba(100, 200, 255, 0.8))',
                duration: 1,
                yoyo: true,
                repeat: 1
            });
            break;
            
        case 'indajani':
            particleEffect = container.querySelector('.friendship-particles');
            soundEffect = 'audio/efectos/amistad.mp3';
            // Efecto de amistad (corazones y brillos)
            gsap.to(fullImage, {
                scale: 1.1,
                duration: 0.5,
                yoyo: true,
                repeat: 1
            });
            break;
            
        case 'kauina':
            particleEffect = container.querySelector('.song-particles');
            soundEffect = 'audio/efectos/canto-ave.mp3';
            // Efecto de canto (ondas sonoras)
            gsap.to(fullImage, {
                rotation: 5,
                duration: 0.3,
                yoyo: true,
                repeat: 3
            });
            break;
            
        case 'kuyki':
            particleEffect = container.querySelector('.sound-particles');
            soundEffect = 'audio/efectos/imitacion.mp3';
            // Efecto de imitación (símbolos musicales)
            gsap.to(fullImage, {
                y: -20,
                duration: 0.2,
                yoyo: true,
                repeat: 3
            });
            break;
            
        case 'ocelin':
            particleEffect = container.querySelector('.truth-particles');
            soundEffect = 'audio/efectos/olfato.mp3';
            // Efecto de olfato (ondas aromáticas)
            gsap.to(fullImage, {
                x: 10,
                duration: 0.2,
                yoyo: true,
                repeat: 3
            });
            break;
            
        case 'tlapu':
            particleEffect = container.querySelector('.chaos-particles');
            soundEffect = 'audio/efectos/caos.mp3';
            // Efecto de caos (explosión divertida)
            gsap.to(fullImage, {
                scale: 1.15,
                rotation: -5,
                duration: 0.3,
                yoyo: true,
                repeat: 2
            });
            break;
    }
    
    // Activar el efecto de partículas
    if (particleEffect) {
        particleEffect.classList.add('active');
        
        // Desactivar después de un tiempo
        setTimeout(() => {
            particleEffect.classList.remove('active');
        }, 3000);
    }
    
    // Reproducir efecto de sonido
    if (soundEffect) {
        const audio = new Audio(soundEffect);
        audio.volume = 0.5;
        audio.play().catch(e => {
            // Ignorar errores de reproducción automática
        });
    }
}

/**
 * Inicializa interacciones basadas en el scroll
 */
function initScrollInteractions() {
    // Elementos que aparecen con efectos al hacer scroll
    const scrollElements = document.querySelectorAll('.animated-element');
    
    // Verificar si el navegador soporta Intersection Observer
    if ('IntersectionObserver' in window) {
        // Crear un observador de intersección
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añadir clase para animar
                    entry.target.classList.add('in-view');
                    
                    // Activar efectos adicionales según el tipo de elemento
                    if (entry.target.classList.contains('character-image')) {
                        entry.target.classList.add('bounce');
                        setTimeout(() => {
                            entry.target.classList.remove('bounce');
                        }, 1000);
                    }
                }
            });
        }, {
            threshold: 0.2, // 20% visible para activar
            rootMargin: '0px 0px -100px 0px' // Activar un poco antes
        });
        
        // Observar cada elemento
        scrollElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback para navegadores que no soportan Intersection Observer
        scrollElements.forEach(element => {
            element.classList.add('in-view');
        });
    }
    
    // Animaciones activadas al hacer scroll con ScrollMagic
    if (typeof ScrollMagic !== 'undefined') {
        // Crear controlador de ScrollMagic
        const controller = new ScrollMagic.Controller();
        
        // Animar secciones al entrar en viewport
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            // Crear escena de ScrollMagic
            new ScrollMagic.Scene({
                triggerElement: section,
                triggerHook: 0.8, // Activar cuando el 80% del elemento sea visible
                reverse: false // No repetir la animación al volver a subir
            })
            .on('enter', function() {
                // Animar elementos dentro de la sección
                const elements = section.querySelectorAll('.personaje-card, .action-card, .galeria-item, .fun-fact');
                
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(elements, 
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
                    );
                } else {
                    // Fallback si GSAP no está disponible
                    elements.forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                }
            })
            .addTo(controller);
        });
    }
    
    // Efecto parallax para hero section
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollPos = window.pageYOffset;
            
            parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.getAttribute('data-speed')) || 0.2;
                const yPos = -(scrollPos * speed);
                
                if (typeof gsap !== 'undefined') {
                    gsap.set(layer, { y: yPos });
                } else {
                    layer.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }
}

/**
 * Inicializa interacciones con el audio del sitio
 */
function initAudioInteractions() {
    const backgroundMusic = document.getElementById('background-music');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = audioToggle ? audioToggle.querySelector('.audio-icon') : null;
    
    if (backgroundMusic && audioToggle) {
        // Estado inicial - música apagada
        let isMusicPlaying = false;
        
        // Función para alternar música
        function toggleMusic() {
            if (isMusicPlaying) {
                backgroundMusic.pause();
                if (audioIcon) {
                    audioIcon.src = 'img/ui/iconos/audio-off.png';
                }
            } else {
                backgroundMusic.volume = 0.3; // Volumen moderado
                backgroundMusic.play().catch(e => {
                    console.log('Auto-play prevented: User interaction needed to play audio');
                });
                if (audioIcon) {
                    audioIcon.src = 'img/ui/iconos/audio-on.png';
                }
            }
            
            isMusicPlaying = !isMusicPlaying;
        }
        
        // Evento click para botón de audio
        audioToggle.addEventListener('click', toggleMusic);
        
        // Sonidos para elementos interactivos
        const interactiveElements = document.querySelectorAll('.personaje-icon, .action-button, .magic-button, .nav-tronco');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', function() {
                // Reproducir sonido de click si la música está activada
                if (isMusicPlaying) {
                    const clickSound = new Audio('audio/efectos/click.mp3');
                    clickSound.volume = 0.2;
                    clickSound.play().catch(e => {
                        console.log('Sound play prevented');
                    });
                }
            });
        });
    }
}

/**
 * Inicializa el menú móvil
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Animación de apertura/cierre
            if (mainNav.classList.contains('active')) {
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(mainNav, 
                        { height: 0, opacity: 0 },
                        { height: 'auto', opacity: 1, duration: 0.5 }
                    );
                } else {
                    // Fallback si GSAP no está disponible
                    mainNav.style.height = 'auto';
                    mainNav.style.opacity = '1';
                }
            } else {
                if (typeof gsap !== 'undefined') {
                    gsap.to(mainNav, { height: 0, opacity: 0, duration: 0.5 });
                } else {
                    // Fallback si GSAP no está disponible
                    mainNav.style.height = '0';
                    mainNav.style.opacity = '0';
                }
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Solo en modo móvil
                if (window.innerWidth <= 768) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.to(mainNav, { height: 0, opacity: 0, duration: 0.5 });
                    } else {
                        // Fallback si GSAP no está disponible
                        mainNav.style.height = '0';
                        mainNav.style.opacity = '0';
                    }
                }
            });
        });
    }
}

/**
 * Transiciones de página
 */
function initPageTransitions() {
    // Agregar clase para activar transición al cargar la página
    document.body.classList.add('page-loaded');
    
    // Manejar transiciones entre páginas
    const siteLinks = document.querySelectorAll('a[href^="index"], a[href^="personajes"], a[href^="refranes"], a[href^="lugares"], a[href^="gastronomia"], a[href^="oficios"], a[href^="tradiciones"]');
    
    siteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo aplicar a enlaces internos del sitio que no son #anchors
            const href = this.getAttribute('href');
            if (href.startsWith('#')) return; // No interferir con links de anclaje
            
            e.preventDefault();
            const target = href;
            
            // Animar salida de página si GSAP está disponible
            if (typeof gsap !== 'undefined') {
                gsap.to('body', {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: function() {
                        window.location.href = target;
                    }
                });
            } else {
                // Fallback si GSAP no está disponible
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = target;
                }, 500);
            }
        });
    });
}

/**
 * Inicializa interacciones específicas para la página actual
 */
function initPageSpecificInteractions() {
    // Obtener el nombre de la página actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Interacciones específicas según la página
    switch (currentPage) {
        case 'index.html':
            initIndexPageInteractions();
            break;
            
        case 'personajes.html':
            initPersonajesPageInteractions();
            break;
            
        case 'refranes.html':
            initRefranesPageInteractions();
            break;
            
        case 'lugares.html':
            initLugaresPageInteractions();
            break;
            
        case 'gastronomia.html':
            initGastronomiaPageInteractions();
            break;
            
        case 'oficios.html':
            initOficiosPageInteractions();
            break;
            
        case 'tradiciones.html':
            initTradicionesPageInteractions();
            break;
    }
}

/**
 * Interacciones específicas para la página de inicio
 */
function initIndexPageInteractions() {
    // Animación especial para la sección de bienvenida
    const welcomeSection = document.getElementById('welcome');
    
    if (welcomeSection) {
        // Añadir efecto de movimiento al fondo cuando se mueve el ratón
        welcomeSection.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            // Seleccionar todas las capas de parallax
            const layers = welcomeSection.querySelectorAll('.parallax-layer');
            
            // Aplicar movimiento a cada capa con diferentes intensidades
            layers.forEach(layer => {
                const speed = parseFloat(layer.getAttribute('data-speed')) || 1;
                const x = mouseX * 50 * speed;
                const y = mouseY * 50 * speed;
                
                layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        });
        
        // Efecto para partículas especiales (pájaros y mariposas)
        initBackgroundElements(welcomeSection);
    }
    
    // Interacciones para la sección de personajes
    const charactersSection = document.getElementById('characters');
    if (charactersSection) {
        // Animación para los personajes en el carrusel
        initCharacterCarouselInteractions();
    }
    
    // Interacciones para la sección de categorías
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
        // Efecto de destello al cargar la sección
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const categoryCards = categoriesSection.querySelectorAll('.category-card');
                    categoryCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in');
                        }, index * 200); // Aparecen secuencialmente
                    });
                    
                    observer.unobserve(categoriesSection);
                }
            });
            
            observer.observe(categoriesSection);
        }
    }
}
