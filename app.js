// Estado Global
let currentUser = null;
let editingTransactionId = null;
let flowChartInstance = null;
let categoryChartInstance = null;

const defaultUsers = {
    "admin": { password: "123", name: "Administrador Geral", role: "Admin" },
    "joao": { password: "123", name: "João (Financeiro)", role: "User" }
};

const defaultTransactions = [
    { id: 1, type: "Entrada", desc: "Desenvolvimento de Projeto Web", category: "Serviços", amount: 4500.00, dueDate: "2026-10-25", status: "Pago / Recebido", payment: "Pix", user: "admin" },
    { id: 2, type: "Saída", desc: "Servidor Cloud AWS", category: "Serviços", amount: 320.50, dueDate: "2026-10-20", status: "Pendente", payment: "Cartão de Crédito", user: "joao" },
    { id: 3, type: "Saída", desc: "Supermercado Semanal", category: "Alimentação", amount: 650.00, dueDate: "2026-10-18", status: "Pago / Recebido", payment: "Pix", user: "admin" }
];

function getUsers() {
    return JSON.parse(localStorage.getItem('mff_users')) || defaultUsers;
}

function setUsers(users) {
    localStorage.setItem('mff_users', JSON.stringify(users));
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('mff_transactions')) || defaultTransactions;
}

function setTransactions(data) {
    localStorage.setItem('mff_transactions', JSON.stringify(data));
}

// Controladores de Autenticação
function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLoginBtn.className = "flex-1 py-2 text-center font-medium border-b-2 border-red-500 text-red-400";
        tabRegisterBtn.className = "flex-1 py-2 text-center font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200";
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabRegisterBtn.className = "flex-1 py-2 text-center font-medium border-b-2 border-red-500 text-red-400";
        tabLoginBtn.className = "flex-1 py-2 text-center font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200";
    }
}

function handleLogin(e) {
    e.preventDefault();
    const userIn = document.getElementById('loginUsername').value.trim().toLowerCase();
    const passIn = document.getElementById('loginPassword').value;

    const users = getUsers();
    if (users[userIn] && users[userIn].password === passIn) {
        currentUser = { username: userIn, ...users[userIn] };
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('appSection').classList.remove('hidden');
        document.getElementById('currentUserDisplay').innerText = currentUser.name;
        document.getElementById('roleBadge').innerText = currentUser.role;
        renderApp();
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regFullName').value.trim();
    const username = document.getElementById('regUsername').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;

    const users = getUsers();
    if (users[username]) {
        alert("Nome de usuário já existe!");
        return;
    }

    users[username] = { password, name, role: "User" };
    setUsers(users);
    alert("Usuário cadastrado com sucesso! Faça login.");
    switchAuthTab('login');
}

function handleLogout() {
    currentUser = null;
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('appSection').classList.add('hidden');
}

// Alteração de Senha
function openPasswordModal() {
    document.getElementById('passwordModalOverlay').classList.remove('hidden');
}

function closePasswordModal() {
    document.getElementById('passwordModalOverlay').classList.add('hidden');
    document.getElementById('passwordForm').reset();
}

function handleChangePassword(e) {
    e.preventDefault();
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;

    const users = getUsers();
    const username = currentUser ? currentUser.username : "admin";

    if (users[username] && users[username].password === currentPass) {
        users[username].password = newPass;
        setUsers(users);
        alert("Senha alterada com sucesso!");
        closePasswordModal();
    } else {
        alert("A senha atual está incorreta!");
    }
}

// Renderização Principal
function renderApp() {
    const list = getTransactions();
    const searchInput = document.getElementById('searchInput');
    const search = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = list.filter(t => 
        (t.desc && t.desc.toLowerCase().includes(search)) || 
        (t.category && t.category.toLowerCase().includes(search)) ||
        (t.user && t.user.toLowerCase().includes(search))
    );

    let income = 0, expense = 0;
    filtered.forEach(t => {
        if (t.type === "Entrada") income += parseFloat(t.amount || 0);
        else expense += parseFloat(t.amount || 0);
    });

    document.getElementById('totalIncome').innerText = `R$ ${income.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('totalExpense').innerText = `R$ ${expense.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    const balance = income - expense;
    document.getElementById('totalBalance').innerText = `R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

    checkDueDates(list);

    const tbody = document.getElementById('transactionTableBody');
    tbody.innerHTML = '';
    document.getElementById('recordCount').innerText = `${filtered.length} registros`;

    filtered.forEach(t => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/40 transition";
        const isIncome = t.type === 'Entrada';
        const statusColor = t.status === 'Pago / Recebido' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30';

        tr.innerHTML = `
            <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${isIncome ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}">
                    ${t.type}
                </span>
            </td>
            <td class="p-3 font-medium text-slate-200">${t.desc}</td>
            <td class="p-3 text-slate-400">${t.category}</td>
            <td class="p-3 font-semibold ${isIncome ? 'text-blue-400' : 'text-red-400'}">
                ${isIncome ? '+' : '-'} R$ ${parseFloat(t.amount || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </td>
            <td class="p-3 text-slate-400">${t.dueDate}</td>
            <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] border ${statusColor}">
                    ${t.status}
                </span>
            </td>
            <td class="p-3 text-slate-400 font-mono text-[11px]">${t.user || 'admin'}</td>
            <td class="p-3 text-right">
                <div class="flex items-center justify-end gap-2">
                    <button onclick="editTransaction(${t.id})" class="text-slate-400 hover:text-blue-400 transition" title="Editar">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deleteTransaction(${t.id})" class="text-slate-400 hover:text-red-400 transition" title="Excluir">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
    updateCharts(filtered);
}

function checkDueDates(list) {
    const today = new Date();
    const alertBox = document.getElementById('dueAlert');
    if (!alertBox) return;
    let dueCount = 0;

    list.forEach(t => {
        if (t.status === 'Pendente' && t.type === 'Saída') {
            const due = new Date(t.dueDate);
            const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            if (diffDays <= 3) dueCount++;
        }
    });

    if (dueCount > 0) {
        alertBox.classList.remove('hidden');
        alertBox.classList.add('flex');
        document.getElementById('dueAlertText').innerText = `Atenção: Você tem ${dueCount} conta(s) pendente(s) a vencer nos próximos dias!`;
    } else {
        alertBox.classList.add('hidden');
        alertBox.classList.remove('flex');
    }
}

function updateCharts(data) {
    let inc = 0, exp = 0;
    data.forEach(t => t.type === 'Entrada' ? inc += parseFloat(t.amount || 0) : exp += parseFloat(t.amount || 0));

    if (flowChartInstance) flowChartInstance.destroy();
    const ctx1El = document.getElementById('flowChart');
    if (ctx1El) {
        const ctx1 = ctx1El.getContext('2d');
        flowChartInstance = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Entradas', 'Saídas'],
                datasets: [{
                    data: [inc, exp],
                    backgroundColor: ['#1e3a8a', '#dc2626'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#94a3b8' } } }
            }
        });
    }

    const catMap = {};
    data.filter(t => t.type === 'Saída').forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + parseFloat(t.amount || 0);
    });

    if (categoryChartInstance) categoryChartInstance.destroy();
    const ctx2El = document.getElementById('categoryChart');
    if (ctx2El) {
        const ctx2 = ctx2El.getContext('2d');
        categoryChartInstance = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(catMap),
                datasets: [{
                    label: 'Despesas (R$)',
                    data: Object.values(catMap),
                    backgroundColor: '#b91c1c',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8' } },
                    y: { ticks: { color: '#94a3b8' } }
                }
            }
        });
    }
}

// Modal de Transação (Novo / Editar)
function openModal() {
    editingTransactionId = null;
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.innerText = "Cadastrar Lançamento";
    const formEl = document.getElementById('transactionForm');
    if (formEl) formEl.reset();
    const dateEl = document.getElementById('transDueDate');
    if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('hidden');
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.add('hidden');
    const formEl = document.getElementById('transactionForm');
    if (formEl) formEl.reset();
    editingTransactionId = null;
}

function editTransaction(id) {
    const list = getTransactions();
    const item = list.find(t => Number(t.id) === Number(id));

    if (item) {
        editingTransactionId = Number(id);
        const titleEl = document.getElementById('modalTitle');
        if (titleEl) titleEl.innerText = "Editar Lançamento";
        
        document.getElementById('transType').value = item.type;
        document.getElementById('transAmount').value = item.amount;
        document.getElementById('transDesc').value = item.desc;
        document.getElementById('transCategory').value = item.category;
        document.getElementById('transDueDate').value = item.dueDate;
        document.getElementById('transStatus').value = item.status;
        document.getElementById('transPayment').value = item.payment;
        
        const overlay = document.getElementById('modalOverlay');
        if (overlay) overlay.classList.remove('hidden');
    }
}

function handleSaveTransaction(e) {
    e.preventDefault();
    let list = getTransactions();

    if (editingTransactionId !== null) {
        list = list.map(t => {
            if (Number(t.id) === Number(editingTransactionId)) {
                return {
                    ...t,
                    type: document.getElementById('transType').value,
                    amount: parseFloat(document.getElementById('transAmount').value),
                    desc: document.getElementById('transDesc').value,
                    category: document.getElementById('transCategory').value,
                    dueDate: document.getElementById('transDueDate').value,
                    status: document.getElementById('transStatus').value,
                    payment: document.getElementById('transPayment').value
                };
            }
            return t;
        });
    } else {
        const newT = {
            id: Date.now(),
            type: document.getElementById('transType').value,
            amount: parseFloat(document.getElementById('transAmount').value),
            desc: document.getElementById('transDesc').value,
            category: document.getElementById('transCategory').value,
            dueDate: document.getElementById('transDueDate').value,
            status: document.getElementById('transStatus').value,
            payment: document.getElementById('transPayment').value,
            user: currentUser ? currentUser.username : "admin"
        };
        list.push(newT);
    }

    setTransactions(list);
    closeModal();
    renderApp();
}

function deleteTransaction(id) {
    if (!confirm("Deseja realmente excluir este registro?")) return;
    let list = getTransactions();
    list = list.filter(t => Number(t.id) !== Number(id));
    setTransactions(list);
    renderApp();
}

// Import/Export Excel
function exportToExcel() {
    const list = getTransactions();
    const ws = XLSX.utils.json_to_sheet(list);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financeiro");
    XLSX.writeFile(wb, "mff_export.xlsx");
}

function importFromExcel(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (json.length > 0) {
            const list = getTransactions();
            json.forEach(item => {
                list.push({
                    id: Date.now() + Math.random(),
                    type: item.type || item.Tipo || "Saída",
                    amount: item.amount || item.Valor || 0,
                    desc: item.desc || item.Descrição || "Importado",
                    category: item.category || item.Categoria || "Outros",
                    dueDate: item.dueDate || item.Vencimento || new Date().toISOString().split('T')[0],
                    status: item.status || item.Status || "Pendente",
                    payment: item.payment || item["Forma Pagamento"] || "Pix",
                    user: currentUser ? currentUser.username : "import"
                });
            });
            setTransactions(list);
            renderApp();
            alert(`${json.length} registros importados com sucesso!`);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Inicialização
window.onload = function() {
    if (window.lucide) {
        lucide.createIcons();
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const dateEl = document.getElementById('transDueDate');
    if (dateEl) dateEl.value = todayStr;
};
