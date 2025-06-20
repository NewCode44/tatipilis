 /**
 * Los Tatipilis - Efectos de Parallax
 * Archivo: parallax.js
 * 
 * Este archivo controla todos los efectos de parallax del sitio,
 * incluyendo las capas de fondo que se mueven a diferentes velocidades
 * y los elementos que reaccionan al scroll.
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos con parallax
    const parallaxLayers = document.querySelectorAll('[data-speed]');
    const welcomeSection = document.getElementById('welcome');
    
    // Control del efecto parallax al hacer scroll
    window.addEventListener('scroll', () => {
        // Obtener la posición de scroll actual
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Aplicar parallax a cada capa según su velocidad
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed') || 0.5;
            const yPos = -(scrollTop * speed);
            
            // Aplicar la transformación solo si el elemento está visible
            const rect = layer.getBoundingClientRect();
            const isVisible = (
                rect.top < window.innerHeight &&
                rect.bottom > 0
            );
            
            if (isVisible) {
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
        
        // Efecto de desvanecimiento para la sección de bienvenida
        if (welcomeSection) {
            const welcomeContent = welcomeSection.querySelector('.welcome-content');
            const welcomeHeight = welcomeSection.offsetHeight;
            const opacity = 1 - (scrollTop / (welcomeHeight * 0.5));
            
            if (opacity >= 0) {
                welcomeContent.style.opacity = opacity;
                welcomeContent.style.transform = `translateY(${scrollTop * 0.3}px)`;
            }
        }
    });
    
    // Inicialización del parallax para las capas de fondo
    initBackgroundParallax();
    
    // Inicialización de elementos que reaccionan al scroll
    initScrollAnimations();
});

/**
 * Inicializa el efecto parallax para las capas de fondo
 */
function initBackgroundParallax() {
    const parallaxBg = document.querySelectorAll('.parallax-bg');
    
    parallaxBg.forEach(bg => {
        // Crear el efecto de parallax en movimiento
        createParallaxEffect(bg);
    });
}

/**
 * Crea el efecto de parallax para un elemento de fondo
 * @param {HTMLElement} element - Elemento al que aplicar el efecto
 */
function createParallaxEffect(element) {
    // Configuración inicial
    const speed = element.getAttribute('data-speed') || 0.2;
    let posY = 0;
    
    // Ajustar la posición inicial
    updatePosition();
    
    // Actualizar posición al hacer scroll
    window.addEventListener('scroll', () => {
        updatePosition();
    });
    
    // Actualizar posición al redimensionar la ventana
    window.addEventListener('resize', () => {
        updatePosition();
    });
    
    /**
     * Actualiza la posición del elemento según el scroll
     */
    function updatePosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const rect = element.getBoundingClientRect();
        const parentTop = rect.top + scrollTop - element.offsetTop;
        
        // Calcular la nueva posición
        posY = -(scrollTop - parentTop) * speed;
        
        // Aplicar la transformación
        element.style.backgroundPosition = `50% ${posY}px`;
    }
}

/**
 * Inicializa las animaciones activadas por scroll
 */
function initScrollAnimations() {
    // Elementos que se animan al aparecer en pantalla
    const animatedElements = document.querySelectorAll('.animated-element');
    
    // Observador de intersección para detectar cuando los elementos son visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadir clase para activar la animación
                entry.target.classList.add('in-view');
                
                // Opcional: dejar de observar después de animar
                // observer.unobserve(entry.target);
            } else {
                // Opcional: quitar la clase si el elemento ya no es visible
                // entry.target.classList.remove('in-view');
            }
        });
    }, {
        // Configuración del observador
        threshold: 0.2, // 20% del elemento debe ser visible
        rootMargin: '0px 0px -100px 0px' // Margen para activar un poco antes
    });
    
    // Comenzar a observar cada elemento
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Inicializar efectos de parallax para secciones específicas
    initSectionParallax();
}

/**
 * Inicializa efectos de parallax para secciones específicas
 */
function initSectionParallax() {
    // Sección de bienvenida con efecto de profundidad
    const welcome = document.getElementById('welcome');
    if (welcome) {
        const mountains = welcome.querySelector('.mountains');
        const clouds = welcome.querySelector('.clouds');
        const forestBack = welcome.querySelector('.forest-back');
        const forestMid = welcome.querySelector('.forest-mid');
        const forestFront = welcome.querySelector('.forest-front');
        
        // Movimiento del ratón para efecto 3D
        welcome.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            if (mountains) {
                mountains.style.transform = `translate3d(${mouseX * -30}px, ${mouseY * -15}px, 0)`;
            }
            
            if (clouds) {
                clouds.style.transform = `translate3d(${mouseX * -20}px, ${mouseY * -10}px, 0)`;
            }
            
            if (forestBack) {
                forestBack.style.transform = `translate3d(${mouseX * -15}px, ${mouseY * -7}px, 0)`;
            }
            
            if (forestMid) {
                forestMid.style.transform = `translate3d(${mouseX * -10}px, ${mouseY * -5}px, 0)`;
            }
            
            if (forestFront) {
                forestFront.style.transform = `translate3d(${mouseX * -5}px, ${mouseY * -2}px, 0)`;
            }
        });
    }
    
    // Efecto parallax en la sección de conservación
    const conservation = document.getElementById('conservation');
    if (conservation) {
        window.addEventListener('scroll', () => {
            const rect = conservation.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const scrollPercentage = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const conservationBg = conservation.querySelector('.conservation-bg');
                
                if (conservationBg) {
                    conservationBg.style.transform = `scale(${1 + scrollPercentage * 0.1})`;
                    conservationBg.style.filter = `brightness(${0.8 + scrollPercentage * 0.3})`;
                }
            }
        });
    }
}

/**
 * Efecto de parallax para imágenes en movimiento
 * @param {HTMLElement} element - Elemento de imagen
 * @param {number} depth - Profundidad del efecto (1-10)
 */
function parallaxImage(element, depth = 5) {
    const container = element.parentElement;
    
    container.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / container.offsetWidth - 0.5) * depth;
        const yPos = (e.clientY / container.offsetHeight - 0.5) * depth;
        
        element.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    });
    
    container.addEventListener('mouseleave', () => {
        element.style.transform = 'translate3d(0, 0, 0)';
    });
}

// Exportar funciones para uso en otros archivos
window.parallaxModule = {
    parallaxImage,
    createParallaxEffect
}; 
