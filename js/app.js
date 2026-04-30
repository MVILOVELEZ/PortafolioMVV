/**
 * Portfolio Logic - Mariano Segundo Viloria Velez
 */

// --- Configuration & State ---
const CONFIG = {
    supabaseUrl: 'https://jnzfmbvaxlihnogvdxtd.supabase.co',
    supabaseKey: 'sb_publishable_Wx_vLf1ljUuMZB5PCbAvuA_UQga7dpk'
};

let supabaseApp = null;

// Initialize Supabase if credentials are provided
if (CONFIG.supabaseUrl !== 'YOUR_SUPABASE_URL') {
    supabaseApp = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
} else {
    // Fallback for demonstration if not configured
    console.warn('Supabase no configurado. Usando datos de prueba.');
}

// --- DOM Elements ---
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section, header');

// --- Navigation & Scroll Effects ---
window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// --- Intersection Observer for Animations ---
const observerOptions = {
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .skill-card, .project-card').forEach(el => {
    el.style.opacity = '0'; // Initial state for animation
    sectionObserver.observe(el);
});

// --- Contact Form Handling ---
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;

        // Visual Feedback
        btn.disabled = true;
        btn.innerText = 'Enviando...';
        formFeedback.innerText = '';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Simulate API call (or use Supabase later)
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = originalText;

            formFeedback.style.color = '#34d399';
            formFeedback.innerText = '¡Gracias! Tu mensaje ha sido enviado correctamente. Mariano se pondrá en contacto pronto.';

            contactForm.reset();

            // Clear message after 5 seconds
            setTimeout(() => {
                formFeedback.innerText = '';
            }, 5000);
        }, 1500);
    });
}

// --- Dynamic Project Loading ---
const TEST_PROJECTS = [
    {
        title: 'EcoTrack Pro',
        category: 'Sostenibilidad',
        description: 'Sistema de monitoreo de huella de carbono en tiempo real para empresas europeas.',
        image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'FinanzaPro',
        category: 'Finanzas',
        description: 'Gestor inteligente de inversiones con visualización de datos avanzada y reportes automáticos.',
        image_url: 'https://images.unsplash.com/photo-1611974717483-2dc8c4d6ad31?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'ConnectSphere',
        category: 'Colaboración',
        description: 'Plataforma de trabajo colaborativo con mensajería instantánea y gestión de tareas en tiempo real.',
        image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'NeoHealth',
        category: 'Salud',
        description: 'Plataforma de telemedicina con diagnósticos asistidos por IA y seguimiento de pacientes.',
        image_url: 'https://images.unsplash.com/photo-1576091160550-217359971f8b?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'CryptoVault',
        category: 'Seguridad',
        description: 'Bóveda digital ultra segura para activos criptográficos y gestión de claves privadas.',
        image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'SmartCity Hub',
        category: 'Infraestructura',
        description: 'Panel de control centralizado para la gestión de recursos urbanos y monitoreo de tráfico.',
        image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'EduStream',
        category: 'Educación',
        description: 'E-learning interactivo con streaming de baja latencia y sistemas de gamificación.',
        image_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'RealEstate VR',
        category: 'Inmobiliaria',
        description: 'Recorridos virtuales 360° para propiedades de lujo con integración de realidad aumentada.',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    }
];

async function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    let projects = [];

    // Try to load from Supabase if configured
    if (supabaseApp) {
        try {
            const { data, error } = await supabaseApp
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                projects = data;
            } else {
                console.log('No se encontraron proyectos en Supabase o hubo un error. Cargando datos de prueba.');
                projects = TEST_PROJECTS;
            }
        } catch (e) {
            console.error('Error al conectar con Supabase:', e);
            projects = TEST_PROJECTS;
        }
    } else {
        projects = TEST_PROJECTS;
    }

    // Render projects
    projectsContainer.innerHTML = projects.map(p => `
        <article class="project-card animate-in">
            <div class="project-img">
                <img src="${p.image_url || p.image || 'https://via.placeholder.com/400x250?text=' + p.title}" 
                     alt="${p.title}" 
                     onerror="this.src='https://via.placeholder.com/400x250?text=${p.title}'">
            </div>
            <div class="project-info">
                <span class="project-category">${p.category}</span>
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.description || p.desc}</p>
                <a href="#" class="btn-secondary" style="padding: 0.8rem 1.5rem; font-size: 1.4rem;">Ver Detalle</a>
            </div>
        </article>
    `).join('');
    
    // Re-observe new elements for animation
    if (window.sectionObserver) {
        document.querySelectorAll('.project-card').forEach(el => {
            sectionObserver.observe(el);
        });
    }
}

window.addEventListener('DOMContentLoaded', loadProjects);
