// Manejo del scroll en la navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Manejo del menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Funcionalidad del carrusel
const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.querySelector('.carousel-arrow.prev');
const nextBtn = document.querySelector('.carousel-arrow.next');

let currentSlide = 0;
const totalSlides = slides.length;

function updateCarousel() {
    // Actualizar posición del carousel
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Actualizar clases active
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

// Event Listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

// Auto play
let autoPlayInterval = setInterval(nextSlide, 5000);

// Pausar autoplay cuando el mouse está sobre el carousel
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

carousel.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
});

// Soporte para touch swipe
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

//Foemulario de aplicación

function showForm(formType) {
    // Actualizar tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Mostrar el formulario correspondiente
    document.querySelectorAll('.form').forEach(form => {
        form.classList.remove('active');
    });
    if (formType === 'basic') {
        document.getElementById('basicForm').classList.add('active');
    } else {
        document.getElementById('professionalForm').classList.add('active');
    }
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (file) {
        const formId = input.id.includes('basic') ? 'preview-basic' : 'preview-prof';
        const preview = document.getElementById(formId);
        preview.style.display = 'block';
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `
                    <p>Archivo seleccionado:</p>
                    <p>${file.name} (${(file.size/1024).toFixed(2)} KB)</p>
                    <img src="${e.target.result}" style="max-width: 200px; margin-top: 10px;">
                `;
            }
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = `
                <p>Archivo seleccionado:</p>
                <p>${file.name} (${(file.size/1024).toFixed(2)} KB)</p>
            `;
        }
    }
}

// Manejar el envío de los formularios
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Formulario enviado correctamente');
        form.reset();
        // Limpiar las previsualizaciones de archivos
        document.querySelectorAll('.file-preview').forEach(preview => {
            preview.style.display = 'none';
            preview.innerHTML = '';
        });
    });
});

// Agregar funcionalidad de arrastrar y soltar
document.querySelectorAll('.file-upload').forEach(upload => {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        upload.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        upload.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        upload.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        upload.style.borderColor = '#0056b3';
    }

    function unhighlight(e) {
        upload.style.borderColor = '#007bff';
    }

    upload.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        const input = upload.querySelector('input[type="file"]');
        input.files = files;
        input.dispatchEvent(new Event('change'));
    }
});