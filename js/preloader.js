 /**
 * Los Tatipilis - Preloader y Animaciones de Carga
 * Archivo: preloader.js
 * 
 * Este archivo controla la animación de carga inicial,
 * la precarga de recursos y la transición fluida a la página principal.
 */

// Lista de recursos para precargar
const resourcesToPreload = {
    // Imágenes esenciales
    images: [
        'img/logo/logo-tatipilis.png',
        'img/logo/favicon.ico',
        'img/ui/fondos/bosque-medio.png',
        'img/ui/troncos/tronco-home.png',
        'img/ui/troncos/tronco-personajes.png',
        'img/ui/troncos/tronco-refranes.png',
        'img/ui/troncos/tronco-lugares.png',
        'img/ui/troncos/tronco-gastronomia.png',
        'img/ui/troncos/tronco-oficios.png',
        'img/ui/troncos/tronco-tradiciones.png',
        'img/ui/marcos/marco-titulo.png',
        'img/ui/marcos/marco-titulo-light.png',
        'img/ui/iconos/audio-on.png',
        'img/ui/iconos/audio-off.png',
        'img/ui/hojas/hoja1.png',
        'img/ui/hojas/hoja2.png',
        'img/ui/hojas/hoja3.png',
        // Personajes (versiones más pequeñas para precargar)
        'img/personajes/axli/axli-face.png',
        'img/personajes/indajani/indajani-face.png',
        'img/personajes/kauina/kauina-face.png',
        'img/personajes/kuyki/kuyki-face.png',
        'img/personajes/ocelin/ocelin-face.png',
        'img/personajes/tlapu/tlapu-face.png'
    ],
    
    // Archivos de audio
    audio: [
        'audio/ambiente-bosque.mp3',
        'audio/efectos/hoja-caer.mp3',
        'audio/efectos/pajaro-cantar.mp3',
        'audio/efectos/agua-fluir.mp3'
    ],
    
    // Animaciones JSON (para Lottie)
    animations: [
        'animations/intro.json',
        'animations/transiciones.json',
        'animations/personajes-interactivos.json'
    ]
};

// Variables de control del preloader
let totalResources = 0;
let loadedResources = 0;
let isInitialLoadComplete = false;

// Elementos del DOM
let preloader;
let progressBar;
let loadingText;
let logoAnimation;

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar elementos del preloader
    initPreloader();
    
    // Iniciar la precarga de recursos
    startPreloading();
    
    // Configurar animación inicial
    setupInitialAnimation();
});

/**
 * Inicializa los elementos del preloader
 */
function initPreloader() {
    preloader = document.getElementById('preloader');
    
    if (!preloader) {
        console.error('Preloader element not found!');
        return;
    }
    
    // Crear elementos adicionales para el preloader
    const loaderContainer = document.querySelector('.logo-container');
    
    // Contenedor de la animación del logo
    logoAnimation = document.getElementById('logo-animation');
    
    // Barra de progreso
    progressBar = document.createElement('div');
    progressBar.className = 'progress-container';
    progressBar.innerHTML = '<div class="progress-bar"></div>';
    loaderContainer.appendChild(progressBar);
    
    // Texto de carga
    loadingText = document.createElement('p');
    loadingText.className = 'loading-text';
    loadingText.textContent = 'Cargando el bosque mágico (0%)';
    loaderContainer.appendChild(loadingText);
}

/**
 * Configura la animación inicial con Lottie
 */
function setupInitialAnimation() {
    if (!window.lottie || !logoAnimation) return;
    
    // Intentar cargar la animación del logo
    fetch('animations/intro.json')
        .then(response => response.json())
        .then(animationData => {
            // Inicializar la animación con Lottie
            const animation = lottie.loadAnimation({
                container: logoAnimation,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
            });
            
            // Ajustar el tamaño
            animation.resize();
        })
        .catch(error => {
            console.warn('Could not load logo animation:', error);
            
            // Mostrar una imagen estática como alternativa
            logoAnimation.innerHTML = '<img src="img/logo/logo-tatipilis.png" alt="Los Tatipilis" style="width: 200px; height: auto;">';
        });
}

/**
 * Inicia el proceso de precarga de recursos
 */
function startPreloading() {
    // Calcular el total de recursos
    totalResources = resourcesToPreload.images.length + 
                     resourcesToPreload.audio.length + 
                     resourcesToPreload.animations.length;
    
    // Iniciar la carga por tipo de recurso
    preloadImages();
    preloadAudio();
    preloadAnimations();
    
    // En caso de que la carga sea muy rápida o falle, agregar un temporizador mínimo
    setTimeout(() => {
        if (!isInitialLoadComplete) {
            completeLoading();
        }
    }, 3000); // 3 segundos mínimo de animación
}

/**
 * Precarga las imágenes
 */
function preloadImages() {
    resourcesToPreload.images.forEach(imageSrc => {
        const img = new Image();
        
        img.onload = () => resourceLoaded();
        img.onerror = () => resourceLoaded(true);
        
        img.src = imageSrc;
    });
}

/**
 * Precarga los archivos de audio
 */
function preloadAudio() {
    resourcesToPreload.audio.forEach(audioSrc => {
        const audio = new Audio();
        
        audio.oncanplaythrough = () => resourceLoaded();
        audio.onerror = () => resourceLoaded(true);
        
        // Solo precargar los metadatos para ahorrar ancho de banda
        audio.preload = 'metadata';
        audio.src = audioSrc;
    });
}

/**
 * Precarga las animaciones JSON
 */
function preloadAnimations() {
    resourcesToPreload.animations.forEach(animationSrc => {
        fetch(animationSrc)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => resourceLoaded())
            .catch(() => resourceLoaded(true));
    });
}

/**
 * Actualiza el contador de recursos cargados
 */
function resourceLoaded(hasError = false) {
    // Incrementar contador
    loadedResources++;
    
    // Calcular porcentaje
    const percentage = Math.min(Math.round((loadedResources / totalResources) * 100), 100);
    
    // Actualizar interfaz
    updatePreloaderUI(percentage);
    
    // Verificar si se han cargado todos los recursos
    if (loadedResources >= totalResources) {
        completeLoading();
    }
}

/**
 * Actualiza la interfaz del preloader
 */
function updatePreloaderUI(percentage) {
    if (!progressBar || !loadingText) return;
    
    // Actualizar barra de progreso
    const progressElement = progressBar.querySelector('.progress-bar');
    if (progressElement) {
        progressElement.style.width = `${percentage}%`;
    }
    
    // Actualizar texto
    loadingText.textContent = `Cargando el bosque mágico (${percentage}%)`;
    
    // Añadir efectos según el progreso
    if (percentage > 50 && !loadingText.classList.contains('pulse')) {
        loadingText.classList.add('pulse');
    }
    
    // Mensajes especiales en ciertos porcentajes
    const loadingMessages = [
        { threshold: 25, message: 'Despertando a los Tatipilis...' },
        { threshold: 50, message: 'Preparando el bosque mágico...' },
        { threshold: 75, message: 'Los amigos están casi listos...' },
        { threshold: 95, message: '¡Ya casi entramos al bosque!' }
    ];
    
    loadingMessages.forEach(item => {
        if (percentage >= item.threshold && percentage < item.threshold + 5) {
            loadingText.textContent = `${item.message} (${percentage}%)`;
        }
    });
}

/**
 * Completa la carga y muestra la página principal
 */
function completeLoading() {
    if (isInitialLoadComplete) return;
    
    isInitialLoadComplete = true;
    
    // Asegurarse de que la barra de progreso muestre 100%
    updatePreloaderUI(100);
    
    // Esperar un momento para mostrar el 100% antes de ocultar
    setTimeout(() => {
        // Animación de desvanecimiento
        if (preloader) {
            preloader.classList.add('fade-out');
            
            // Eliminar el preloader después de la animación
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
                
                // Disparar evento personalizado para informar que la carga ha finalizado
                const loadCompleteEvent = new Event('loadComplete');
                document.dispatchEvent(loadCompleteEvent);
                
                // Iniciar animaciones de entrada de la página
                animatePageEntrance();
            }, 1000);
        }
    }, 500);
}

/**
 * Anima la entrada de los elementos principales de la página
 */
function animatePageEntrance() {
    // Añadir clase para marcar que el sitio está listo
    document.body.classList.add('site-loaded');
    
    // Elementos a animar en secuencia
    const elementsToAnimate = [
        { selector: 'header', className: 'fade-in', delay: 0 },
        { selector: '.welcome-content', className: 'fade-in-up', delay: 300 },
        { selector: '.nav-tronco', className: 'bounce-in', delay: 500, sequential: true, sequentialDelay: 100 }
    ];
    
    // Aplicar animaciones
    elementsToAnimate.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        
        elements.forEach((element, index) => {
            // Calcular retraso (delay)
            let delay = item.delay;
            
            // Si es secuencial, aumentar el retraso por cada elemento
            if (item.sequential) {
                delay += index * item.sequentialDelay;
            }
            
            // Aplicar la animación con retraso
            setTimeout(() => {
                element.classList.add(item.className);
                
                // Si hay una función de callback adicional
                if (item.callback) {
                    item.callback(element, index);
                }
            }, delay);
        });
    });
    
    // Iniciar efectos de partículas después de cargar la página
    setTimeout(() => {
        // Si existe el sistema de partículas, iniciarlo
        if (window.particleSystem) {
            window.particleSystem.start();
        }
        
        // Iniciar audio ambiental si está habilitado
        if (window.autoplayAudio) {
            const ambientSound = document.getElementById('ambient-sound');
            if (ambientSound) {
                ambientSound.play().catch(() => {
                    console.log('Autoplay prevented. User interaction required.');
                });
            }
        }
    }, 1500);
}

// Agregar efectos especiales a los elementos de la página
document.addEventListener('loadComplete', () => {
    // Añadir efectos mágicos a los botones
    addMagicEffects();
    
    // Iniciar efectos parallax si el dispositivo lo soporta
    if (!isMobileDevice()) {
        initParallaxEffects();
    }
});

/**
 * Añade efectos mágicos a los elementos interactivos
 */
function addMagicEffects() {
    // Botones mágicos
    const magicButtons = document.querySelectorAll('.btn-magic');
    
    magicButtons.forEach(button => {
        // Efecto al pasar el ratón
        button.addEventListener('mouseenter', () => {
            createMagicParticles(button, 5, 'small');
            
            // Sonido suave (opcional)
            playSound('magic-hover');
        });
        
        // Efecto al hacer clic
        button.addEventListener('click', () => {
            createMagicParticles(button, 15, 'large');
            
            // Sonido más intenso
            playSound('magic-click');
            
            // Añadir clase de brillo temporal
            button.classList.add('glow');
            setTimeout(() => {
                button.classList.remove('glow');
            }, 800);
        });
    });
}

/**
 * Crea partículas mágicas alrededor de un elemento
 */
function createMagicParticles(element, count = 10, size = 'small') {
    // Si no existe el contenedor de partículas, crearlo
    let particlesContainer = document.getElementById('magic-particles-container');
    
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.id = 'magic-particles-container';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '1000';
        document.body.appendChild(particlesContainer);
    }
    
    // Obtener la posición del elemento
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Colores para las partículas
    const colors = ['#FFD700', '#FFA500', '#FF4500', '#FFFFFF'];
    
    // Crear partículas
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        
        // Tamaño de partícula
        const particleSize = size === 'small' ? 
            Math.random() * 5 + 2 : 
            Math.random() * 8 + 5;
        
        // Estilo de la partícula
        particle.style.position = 'absolute';
        particle.style.width = `${particleSize}px`;
        particle.style.height = `${particleSize}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 ${particleSize * 2}px ${particle.style.backgroundColor}`;
        
        // Posición inicial (centrada en el elemento)
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        // Añadir al contenedor
        particlesContainer.appendChild(particle);
        
        // Animación con GSAP si está disponible
        if (window.gsap) {
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: 'power2.out',
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
        } else {
            // Alternativa sin GSAP
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100;
            const speedX = Math.cos(angle) * distance;
            const speedY = Math.sin(angle) * distance;
            
            let opacity = 1;
            let posX = 0;
            let posY = 0;
            
            const animate = () => {
                opacity -= 0.02;
                posX += speedX / 20;
                posY += speedY / 20;
                
                particle.style.opacity = opacity;
                particle.style.transform = `translate(${posX}px, ${posY}px)`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
}

/**
 * Reproduce un sonido
 */
function playSound(soundName) {
    // Mapeo de sonidos
    const sounds = {
        'magic-hover': 'audio/efectos/magic-hover.mp3',
        'magic-click': 'audio/efectos/magic-click.mp3',
        'entrance': 'audio/efectos/entrance.mp3'
    };
    
    // Verificar si el sonido existe
    if (!sounds[soundName]) return;
    
    // Crear elemento de audio
    const audio = new Audio(sounds[soundName]);
    audio.volume = 0.3; // Volumen bajo
    
    // Reproducir
    audio.play().catch(() => {
        // Ignorar errores de autoplay
    });
}

/**
 * Inicia efectos de parallax
 */
function initParallaxEffects() {
    // Si ScrollMagic está disponible
    if (window.ScrollMagic) {
        // Controlador de ScrollMagic
        const controller = new ScrollMagic.Controller();
        
        // Elementos con parallax
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            
            new ScrollMagic.Scene({
                triggerElement: element,
                triggerHook: 1, // Inicio del trigger
                duration: '200%' // Duración del efecto
            })
            .on('progress', function(event) {
                const posY = event.progress * 100 * speed;
                element.style.transform = `translate3d(0, -${posY}px, 0)`;
            })
            .addTo(controller);
        });
    }
}

/**
 * Detecta si es un dispositivo móvil
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Exponer funciones útiles globalmente
window.preloaderFunctions = {
    createMagicParticles,
    playSound,
    animatePageEntrance
};
