 /**
 * Los Tatipilis - Sistema de Partículas
 * Archivo: particles.js
 * 
 * Este archivo controla los efectos visuales de partículas como
 * hojas cayendo, mariposas, destellos mágicos y otros elementos
 * animados que dan vida al bosque Tatipili.
 */

// Configuración del sistema de partículas
const particlesConfig = {
    // Hojas
    leaves: {
        count: 20,                 // Cantidad de hojas
        images: [                  // Rutas a imágenes de hojas
            'img/ui/hojas/hoja1.png',
            'img/ui/hojas/hoja2.png',
            'img/ui/hojas/hoja3.png'
        ],
        sizeRange: [20, 40],       // Rango de tamaños en px
        speedRange: [2, 5],        // Rango de velocidades
        rotationSpeedRange: [1, 3] // Velocidad de rotación
    },
    
    // Mariposas
    butterflies: {
        count: 8,                  // Cantidad de mariposas
        images: [                  // Rutas a imágenes de mariposas
            'img/ui/animaciones/mariposa1.png',
            'img/ui/animaciones/mariposa2.png'
        ],
        sizeRange: [25, 40],       // Rango de tamaños en px
        speedRange: [1, 3]         // Rango de velocidades
    },
    
    // Destellos mágicos
    sparks: {
        count: 15,                 // Cantidad de destellos
        colors: [                  // Colores de los destellos
            '#FFD700', '#FFA500', '#FFFFFF', '#FF4500'
        ],
        sizeRange: [3, 8],         // Rango de tamaños en px
        speedRange: [1, 3],        // Rango de velocidades
        lifespan: [2000, 5000]     // Duración en milisegundos
    },
    
    // Pájaros
    birds: {
        count: 5,                  // Cantidad de pájaros
        images: [                  // Rutas a imágenes de pájaros
            'img/ui/animaciones/pajaro1.png',
            'img/ui/animaciones/pajaro2.png'
        ],
        sizeRange: [30, 60],       // Rango de tamaños en px
        speedRange: [1, 2]         // Rango de velocidades
    }
};

// Clase para gestionar el sistema de partículas
class ParticleSystem {
    constructor(containerId = 'particles-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn('Particle container not found. Creating one.');
            this.createContainer(containerId);
        }
        
        this.particles = [];
        this.animationFrameId = null;
        this.lastTimestamp = 0;
    }
    
    // Crear el contenedor si no existe
    createContainer(containerId) {
        this.container = document.createElement('div');
        this.container.id = containerId;
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = '90';
        document.body.appendChild(this.container);
    }
    
    // Iniciar el sistema de partículas
    start() {
        // Detener si ya está funcionando
        this.stop();
        
        // Iniciar bucle de animación
        this.animate(0);
    }
    
    // Detener el sistema de partículas
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    // Bucle principal de animación
    animate(timestamp) {
        // Calcular delta time
        const deltaTime = timestamp - (this.lastTimestamp || timestamp);
        this.lastTimestamp = timestamp;
        
        // Actualizar todas las partículas
        this.update(deltaTime);
        
        // Continuar la animación
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }
    
    // Actualizar todas las partículas
    update(deltaTime) {
        // Filtrar partículas muertas
        this.particles = this.particles.filter(particle => !particle.isDead);
        
        // Actualizar las partículas restantes
        this.particles.forEach(particle => {
            particle.update(deltaTime);
        });
    }
    
    // Añadir una nueva partícula
    addParticle(particle) {
        this.particles.push(particle);
        this.container.appendChild(particle.element);
    }
    
    // Crear un grupo de partículas
    createParticleGroup(type, count) {
        const ParticleClass = this.getParticleClass(type);
        const config = particlesConfig[type];
        
        if (!ParticleClass || !config) {
            console.error(`Invalid particle type: ${type}`);
            return;
        }
        
        for (let i = 0; i < count; i++) {
            const particle = new ParticleClass(this.container, config);
            this.addParticle(particle);
        }
    }
    
    // Obtener la clase de partícula según el tipo
    getParticleClass(type) {
        const classes = {
            'leaves': LeafParticle,
            'butterflies': ButterflyParticle,
            'sparks': SparkParticle,
            'birds': BirdParticle
        };
        
        return classes[type];
    }
    
    // Crear efecto de explosión de partículas
    createExplosion(x, y, count = 10, type = 'sparks') {
        const ParticleClass = this.getParticleClass(type);
        const config = particlesConfig[type];
        
        if (!ParticleClass || !config) return;
        
        for (let i = 0; i < count; i++) {
            const particle = new ParticleClass(this.container, config, x, y);
            particle.setExplosion();
            this.addParticle(particle);
        }
    }
    
    // Inicializar todos los tipos de partículas
    initAllParticles() {
        // Crear partículas según la configuración
        Object.keys(particlesConfig).forEach(type => {
            const config = particlesConfig[type];
            this.createParticleGroup(type, config.count);
        });
    }
}

// Clase base para todas las partículas
class Particle {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.element = document.createElement('div');
        this.isDead = false;
        
        // Estilo base común
        this.element.style.position = 'absolute';
        this.element.style.pointerEvents = 'none';
        
        // Inicializar la partícula
        this.init();
    }
    
    init() {
        // Esta función debe ser implementada por las subclases
    }
    
    update(deltaTime) {
        // Esta función debe ser implementada por las subclases
    }
    
    // Eliminar la partícula
    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.isDead = true;
    }
    
    // Obtener un valor aleatorio dentro de un rango
    randomRange(min, max) {
        return min + Math.random() * (max - min);
    }
    
    // Obtener un elemento aleatorio de un array
    randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Clase para partículas de hojas
class LeafParticle extends Particle {
    init() {
        // Configuración inicial
        this.size = this.randomRange(this.config.sizeRange[0], this.config.sizeRange[1]);
        this.speed = this.randomRange(this.config.speedRange[0], this.config.speedRange[1]);
        this.rotationSpeed = this.randomRange(this.config.rotationSpeedRange[0], this.config.rotationSpeedRange[1]);
        this.horizontalMovement = this.randomRange(-1, 1);
        this.rotation = 0;
        
        // Asignar posición inicial
        this.x = this.randomRange(0, window.innerWidth);
        this.y = -this.size;
        
        // Configurar estilo
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.backgroundImage = `url('${this.randomFromArray(this.config.images)}')`;
        this.element.style.backgroundSize = 'contain';
        this.element.style.backgroundRepeat = 'no-repeat';
        
        // Aplicar posición inicial
        this.updatePosition();
    }
    
    update(deltaTime) {
        // Mover hoja hacia abajo
        this.y += this.speed * (deltaTime / 16);
        
        // Mover ligeramente a los lados (efecto de caída natural)
        this.x += Math.sin(this.y * 0.01) * this.horizontalMovement;
        
        // Rotar hoja
        this.rotation += this.rotationSpeed * (deltaTime / 16);
        
        // Actualizar posición y rotación
        this.updatePosition();
        
        // Verificar si salió de la pantalla
        if (this.y > window.innerHeight + this.size) {
            // Reposicionar en la parte superior
            this.reset();
        }
    }
    
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `rotate(${this.rotation}deg)`;
    }
    
    reset() {
        this.x = this.randomRange(0, window.innerWidth);
        this.y = -this.size;
        this.speed = this.randomRange(this.config.speedRange[0], this.config.speedRange[1]);
        this.horizontalMovement = this.randomRange(-1, 1);
    }
    
    setExplosion() {
        // Configurar para un efecto de explosión
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.horizontalMovement = this.randomRange(-5, 5);
        this.speed = this.randomRange(1, 3) * (Math.random() > 0.5 ? 1 : -1);
    }
}

// Clase para partículas de mariposas
class ButterflyParticle extends Particle {
    init() {
        // Configuración inicial
        this.size = this.randomRange(this.config.sizeRange[0], this.config.sizeRange[1]);
        this.speed = this.randomRange(this.config.speedRange[0], this.config.speedRange[1]);
        
        // Definir trayectoria
        this.waypointX = this.randomRange(0, window.innerWidth);
        this.waypointY = this.randomRange(0, window.innerHeight);
        
        // Asignar posición inicial
        this.x = this.randomRange(0, window.innerWidth);
        this.y = this.randomRange(0, window.innerHeight);
        
        // Variables de animación
        this.wingState = 0; // 0 = alas abiertas, 1 = alas cerradas
        this.wingTimer = 0;
        this.wingInterval = 100; // Milisegundos entre aleteos
        
        // Configurar estilo
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.backgroundImage = `url('${this.randomFromArray(this.config.images)}')`;
        this.element.style.backgroundSize = 'contain';
        this.element.style.backgroundRepeat = 'no-repeat';
        
        // Crear el elemento de las alas (para animación)
        this.wings = document.createElement('div');
        this.wings.style.width = '100%';
        this.wings.style.height = '100%';
        this.wings.style.backgroundImage = this.element.style.backgroundImage;
        this.wings.style.backgroundSize = 'contain';
        this.wings.style.backgroundRepeat = 'no-repeat';
        
        this.element.appendChild(this.wings);
        
        // Aplicar posición inicial
        this.updatePosition();
    }
    
    update(deltaTime) {
        // Mover hacia el punto de destino
        const dx = this.waypointX - this.x;
        const dy = this.waypointY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si llegamos al destino, elegir uno nuevo
        if (distance < 10) {
            this.waypointX = this.randomRange(50, window.innerWidth - 50);
            this.waypointY = this.randomRange(50, window.innerHeight - 50);
        } else {
            // Mover hacia el destino
            this.x += (dx / distance) * this.speed * (deltaTime / 16);
            this.y += (dy / distance) * this.speed * (deltaTime / 16);
        }
        
        // Animar alas (aleteo)
        this.wingTimer += deltaTime;
        if (this.wingTimer >= this.wingInterval) {
            this.wingTimer = 0;
            this.wingState = this.wingState === 0 ? 1 : 0;
            this.wings.style.transform = `scaleX(${this.wingState === 0 ? 1 : 0.7})`;
        }
        
        // Actualizar posición y rotación
        this.updatePosition();
    }
    
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        // Rotar en la dirección del movimiento
        if (this.waypointX > this.x) {
            this.element.style.transform = 'scaleX(1)';
        } else {
            this.element.style.transform = 'scaleX(-1)';
        }
    }
    
    setExplosion() {
        // Para mariposas, simplemente establecer una posición inicial
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
    }
}

// Clase para partículas de destellos mágicos
class SparkParticle extends Particle {
    init() {
        // Configuración inicial
        this.size = this.randomRange(this.config.sizeRange[0], this.config.sizeRange[1]);
        this.speedX = this.randomRange(-this.config.speedRange[1], this.config.speedRange[1]);
        this.speedY = this.randomRange(-this.config.speedRange[1], this.config.speedRange[1]);
        this.color = this.randomFromArray(this.config.colors);
        
        // Tiempo de vida
        this.lifespan = this.randomRange(this.config.lifespan[0], this.config.lifespan[1]);
        this.age = 0;
        
        // Posición aleatoria dentro de la pantalla
        this.x = this.randomRange(0, window.innerWidth);
        this.y = this.randomRange(0, window.innerHeight);
        
        // Configurar estilo
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.backgroundColor = this.color;
        this.element.style.borderRadius = '50%';
        this.element.style.boxShadow = `0 0 ${this.size * 2}px ${this.color}`;
        
        // Aplicar posición inicial
        this.updatePosition();
    }
    
    update(deltaTime) {
        // Actualizar edad
        this.age += deltaTime;
        
        // Verificar si la partícula debe morir
        if (this.age >= this.lifespan) {
            this.remove();
            return;
        }
        
        // Calcular opacidad según edad
        const opacity = 1 - (this.age / this.lifespan);
        
        // Mover
        this.x += this.speedX * (deltaTime / 16);
        this.y += this.speedY * (deltaTime / 16);
        
        // Ralentizar gradualmente
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        
        // Actualizar posición y opacidad
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = opacity;
    }
    
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    
    setExplosion() {
        // Configurar para un efecto de explosión desde el centro
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.speedX = this.randomRange(-5, 5);
        this.speedY = this.randomRange(-5, 5);
    }
}

// Clase para partículas de pájaros
class BirdParticle extends Particle {
    init() {
        // Configuración inicial
        this.size = this.randomRange(this.config.sizeRange[0], this.config.sizeRange[1]);
        this.speed = this.randomRange(this.config.speedRange[0], this.config.speedRange[1]);
        
        // Posición inicial (fuera de la pantalla, a la izquierda o derecha)
        this.direction = Math.random() > 0.5 ? 1 : -1; // 1 = derecha, -1 = izquierda
        this.x = this.direction === 1 ? -this.size : window.innerWidth;
        this.y = this.randomRange(window.innerHeight * 0.1, window.innerHeight * 0.5);
        
        // Variables de animación de alas
        this.wingState = 0;
        this.wingTimer = 0;
        this.wingInterval = 200; // Milisegundos entre aleteos
        
        // Configurar estilo
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.backgroundImage = `url('${this.randomFromArray(this.config.images)}')`;
        this.element.style.backgroundSize = 'contain';
        this.element.style.backgroundRepeat = 'no-repeat';
        
        // Elemento de alas para animación
        this.wings = document.createElement('div');
        this.wings.className = 'bird-wings';
        this.wings.style.width = '100%';
        this.wings.style.height = '100%';
        this.wings.style.position = 'absolute';
        this.wings.style.top = '0';
        this.wings.style.left = '0';
        this.wings.style.backgroundImage = this.element.style.backgroundImage;
        this.wings.style.backgroundSize = 'contain';
        this.wings.style.backgroundRepeat = 'no-repeat';
        
        this.element.appendChild(this.wings);
        
        // Aplicar posición inicial y dirección
        this.updatePosition();
    }
    
    update(deltaTime) {
        // Mover a través de la pantalla
        this.x += this.speed * this.direction * (deltaTime / 16);
        
        // Ligero movimiento vertical (ondulación)
        this.y += Math.sin(this.x * 0.01) * 0.5;
        
        // Animar alas
        this.wingTimer += deltaTime;
        if (this.wingTimer >= this.wingInterval) {
            this.wingTimer = 0;
            this.wingState = this.wingState === 0 ? 1 : 0;
            this.wings.style.transform = `translateY(${this.wingState === 0 ? 0 : -5}px)`;
        }
        
        // Actualizar posición
        this.updatePosition();
        
        // Verificar si salió de la pantalla
        if ((this.direction === 1 && this.x > window.innerWidth + this.size) ||
            (this.direction === -1 && this.x < -this.size)) {
            this.reset();
        }
    }
    
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        // Orientar según dirección
        if (this.direction === 1) {
            this.element.style.transform = 'scaleX(1)';
        } else {
            this.element.style.transform = 'scaleX(-1)';
        }
    }
    
    reset() {
        // Cambiar dirección aleatoriamente
        this.direction = Math.random() > 0.5 ? 1 : -1;
        
        // Reposicionar fuera de la pantalla
        this.x = this.direction === 1 ? -this.size : window.innerWidth;
        this.y = this.randomRange(window.innerHeight * 0.1, window.innerHeight * 0.5);
        
        // Asignar nueva velocidad
        this.speed = this.randomRange(this.config.speedRange[0], this.config.speedRange[1]);
    }
    
    setExplosion() {
        // No aplicable para pájaros, usar reset normal
        this.reset();
    }
}

// Inicializar y exponer el sistema de partículas globalmente
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del sistema de partículas
    window.particleSystem = new ParticleSystem();
    
    // Inicializar todos los tipos de partículas
    window.particleSystem.initAllParticles();
    
    // Iniciar la animación
    window.particleSystem.start();
    
    // Opcionalmente, ajustar partículas en función del rendimiento
    adjustForPerformance();
});

// Ajustar configuración según el rendimiento del dispositivo
function adjustForPerformance() {
    // Verificar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Reducir cantidad de partículas en dispositivos móviles
        particlesConfig.leaves.count = 5;
        particlesConfig.butterflies.count = 3;
        particlesConfig.sparks.count = 5;
        particlesConfig.birds.count = 2;
    }
    
    // También podríamos verificar FPS y ajustar dinamicamente
}

// Exponer funciones globalmente para uso desde la consola o desde otros scripts
window.createMagicExplosion = (x, y) => {
    if (window.particleSystem) {
        window.particleSystem.createExplosion(x, y, 15, 'sparks');
    }
};
