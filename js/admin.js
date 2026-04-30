/**
 * Admin Logic - Portfolio Mariano Segundo Viloria Velez
 */

const CONFIG = {
    supabaseUrl: 'https://jnzfmbvaxlihnogvdxtd.supabase.co',
    supabaseKey: 'sb_publishable_Wx_vLf1ljUuMZB5PCbAvuA_UQga7dpk'
};

let supaClient = null;
if (CONFIG.supabaseUrl !== 'YOUR_SUPABASE_URL') {
    supaClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
} else {
    console.warn('Supabase no configurado. Iniciando en modo simulación.');
}

// --- Feedback Helper ---
function showMessage(msg, isError = false) {
    const errorEl = document.getElementById('auth-error');
    if (errorEl) {
        errorEl.innerText = msg;
        errorEl.style.color = isError ? '#ef4444' : '#10b981';
        setTimeout(() => { errorEl.innerText = ''; }, 5000);
    }
}

// --- DOM Elements ---
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const authError = document.getElementById('auth-error');
const projectsList = document.getElementById('projects-list');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const authToggleText = document.getElementById('auth-toggle-text');
const authSubmitBtn = document.getElementById('auth-submit-btn');

let isLoginMode = true;

// --- Auth State ---
async function checkUser() {
    if (!supaClient) {
        // Mock session for demonstration if Supabase is not configured
        console.warn('Supabase no configurado. Usando modo de demostración local.');
        return;
    }
    
    const { data: { session } } = await supaClient.auth.getSession();
    if (session) {
        showDashboard();
    } else {
        showAuth();
    }
}

function showDashboard() {
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    logoutBtn.style.display = 'block';
    fetchProjects();
}

function showAuth() {
    authSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    logoutBtn.style.display = 'none';
}

// --- Auth Handling ---
if (loginForm) {
    if (authToggleText) {
        authToggleText.addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            authSubmitBtn.innerText = isLoginMode ? 'Entrar' : 'Registrarse';
            authToggleText.innerHTML = isLoginMode 
                ? '¿No tienes cuenta? <span style="color: var(--secondary)">Regístrate</span>' 
                : '¿Ya tienes cuenta? <span style="color: var(--secondary)">Inicia Sesión</span>';
            document.querySelector('.auth-card h2').innerText = isLoginMode ? 'Inicia Sesión' : 'Crea tu Cuenta';
        });
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!supaClient) {
            // Mock login for demo
            if (isLoginMode) {
                if (email === 'admin@admin.com' && password === 'admin123') {
                    showDashboard();
                } else {
                    authError.innerText = 'Credenciales incorrectas (Demo: admin@admin.com / admin123)';
                }
            } else {
                showMessage('Registro simulado con éxito. Ahora puedes iniciar sesión.');
                isLoginMode = true;
                authToggleText.click();
            }
            return;
        }

        let result;
        if (isLoginMode) {
            result = await supaClient.auth.signInWithPassword({ email, password });
        } else {
            result = await supaClient.auth.signUp({ email, password });
            if (!result.error) {
                showMessage('Registro exitoso. Revisa tu email para confirmar o intenta iniciar sesión.');
                isLoginMode = true;
                authToggleText.click();
                return;
            }
        }

        if (result.error) {
            authError.innerText = result.error.message;
        } else {
            if (isLoginMode) showDashboard();
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (supaClient) await supaClient.auth.signOut();
        showAuth();
    });
}

// --- Project CRUD ---
let projects = [
    { id: 1, title: 'EcoTrack Pro', category: 'Sostenibilidad', description: 'Sistema de monitoreo de huella de carbono...', image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'FinanzaPro', category: 'Finanzas', description: 'Gestor inteligente de inversiones...', image_url: 'https://images.unsplash.com/photo-1611974717483-2dc8c4d6ad31?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'ConnectSphere', category: 'Colaboración', description: 'Plataforma de trabajo colaborativo...', image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'NeoHealth', category: 'Salud', description: 'Plataforma de telemedicina con IA...', image_url: 'https://images.unsplash.com/photo-1576091160550-217359971f8b?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'CryptoVault', category: 'Seguridad', description: 'Bóveda digital ultra segura...', image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'SmartCity Hub', category: 'Infraestructura', description: 'Panel de control para urbes inteligentes...', image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800' },
    { id: 7, title: 'EduStream', category: 'Educación', description: 'E-learning interactivo con streaming...', image_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800' },
    { id: 8, title: 'RealEstate VR', category: 'Inmobiliaria', description: 'Recorridos virtuales 360 para lujo...', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' }
];

async function fetchProjects() {
    if (supaClient) {
        const { data, error } = await supaClient
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            showMessage(error.message, true);
        } else {
            projects = data;
        }
    }
    renderProjects();
}

function renderProjects() {
    projectsList.innerHTML = projects.map(p => `
        <tr>
            <td><img src="${p.image_url}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/80x50'"></td>
            <td>${p.title}</td>
            <td>${p.category}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editProject(${p.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn btn-delete" onclick="deleteProject(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

window.deleteProject = async (id) => {
    // Instead of confirm, we just do it for now or we could add a confirmation state in the UI
    // In a real app we'd have a custom modal
    if (supaClient) {
        const { error } = await supaClient.from('projects').delete().eq('id', id);
        if (error) showMessage(error.message, true);
    } else {
        projects = projects.filter(p => p.id !== id);
    }
    fetchProjects();
};

window.editProject = (id) => {
    const p = projects.find(proj => proj.id == id);
    if (!p) return;
    
    document.getElementById('project-id').value = p.id;
    document.getElementById('project-title').value = p.title;
    document.getElementById('project-category').value = p.category;
    document.getElementById('project-desc').value = p.description;
    document.getElementById('project-image').value = p.image_url;
    
    document.getElementById('modal-title').innerText = 'Editar Proyecto';
    projectModal.style.display = 'flex';
};

// --- Modal Handling ---
openModalBtn.addEventListener('click', () => {
    projectForm.reset();
    document.getElementById('project-id').value = '';
    document.getElementById('modal-title').innerText = 'Nuevo Proyecto';
    projectModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    projectModal.style.display = 'none';
});

projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('project-id').value;
    const newProject = {
        title: document.getElementById('project-title').value,
        category: document.getElementById('project-category').value,
        description: document.getElementById('project-desc').value, // Changed from desc to match SQL
        image_url: document.getElementById('project-image').value // Changed from image to match SQL
    };

    if (supaClient) {
        let result;
        if (id) {
            result = await supaClient.from('projects').update(newProject).eq('id', id);
        } else {
            result = await supaClient.from('projects').insert([newProject]);
        }
        
        if (result.error) {
            showMessage(result.error.message, true);
            return;
        }
    } else {
        if (id) {
            const index = projects.findIndex(p => p.id == id);
            projects[index] = { ...projects[index], ...newProject };
        } else {
            projects.push({ id: Date.now(), ...newProject });
        }
    }
    
    projectModal.style.display = 'none';
    fetchProjects();
});

// Init
checkUser();
