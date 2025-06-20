 /**
 * Los Tatipilis - Animaciones Adicionales
 * Archivo: animations.js
 *
 * Este archivo contiene animaciones simples que complementan las
 * interacciones del sitio. Se puede ampliar con nuevas funciones
 * según sea necesario.
 */

/**
 * Reproduce una animación básica de giro para un elemento.
 * @param {HTMLElement} element - Elemento objetivo.
 */
function playSampleAnimation(element) {
    if (window.gsap) {
        gsap.to(element, { rotation: 360, duration: 1 });
    } else if (element.animate) {
        element.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ], { duration: 1000, iterations: 1 });
    }
}
