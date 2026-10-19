# 💰 MFF CashFlow

> **MFF CashFlow** é uma solução moderna e completa de controle e gestão financeira pessoal e empresarial. Projetado com uma interface elegante (*clean*) utilizando degradê em tons de **azul marinho e vermelho**, o sistema oferece uma visão clara e intuitiva sobre entradas, saídas, categorias de despesas e vencimentos.

---

## 🚀 Funcionalidades Principais

* **👥 Controle Multi-Usuário:**
  * Sistema de login e cadastro de usuários.
  * Controle por papéis (Administrador e Usuário comum).
  * Alteração de senha diretamente pela interface.
  * Isolamento de registros por usuário.

* **📊 Lançamentos e Fluxo de Caixa:**
  * Registro completo de **Entradas** e **Saídas**.
  * Detalhamento com valor, categoria, data de vencimento, forma de pagamento e status (*Pago / Recebido* ou *Pendente*).
  * Filtro e busca rápida em tempo real por descrição, categoria ou responsável.

* **📈 Indicadores e Gráficos Dinâmicos:**
  * Indicadores de **Total de Entradas**, **Total de Saídas** e **Saldo Atual**.
  * **Gráfico de Rosca (Doughnut):** Proporção geral entre receitas e despesas.
  * **Gráfico de Barras:** Distribuição de despesas por categorias.

* **🔔 Alertas Inteligentes:**
  * Notificações visuais automáticas para contas a vencer nos próximos dias.

* **📂 Integração com Excel:**
  * **Exportação:** Baixe todos os dados em formato `.xlsx` com um clique.
  * **Importação:** Carregue planilhas em massa para agilizar o cadastro inicial.

---

## 🛠️ Tecnologias Utilizadas

### Versão Web (Front-end Puro)
* **HTML5 & CSS3** (Tailwind CSS via CDN + CSS Customizado com Glassmorphism)
* **JavaScript (ES6+)**
* **Chart.js:** Renderização de gráficos dinâmicos.
* **SheetJS (XLSX):** Manipulação e leitura/escrita de arquivos Excel.
* **Lucide Icons:** Ícone e identificação visual leve.
* **LocalStorage:** Armazenamento persistente no navegador.
---

## 📂 Estrutura do Projeto

```text
mff-cashflow/
├── index.html            # Estrutura principal da aplicação Web
├── css/
│   └── styles.css        # Estilos customizados e tema em degradê
├── js/
│   └── app.js 
└── README.md             # Documentação do projeto
```

---

## 💻 Instruções de Instalação e Execução

### Versão Web (HTML, CSS, JS)

A versão web roda diretamente em qualquer navegador moderno, sem necessidade de servidores ou instalações complexas.

1. **Faça o download ou clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/mff-cashflow.git
   cd mff-cashflow
   ```

2. **Execução:**
   * Basta dar um duplo clique no arquivo `index.html` ou abri-lo pelo seu navegador preferido (Google Chrome, Edge, Firefox, Brave).
   * Caso queira utilizar um servidor local estático (opcional):
     ```bash
     npx serve .
     ```

3. **Acesso Padrão:**
   * **Admin:** `admin` | Senha: `123`
   * **Usuário:** `joao` | Senha: `123`

---

## 🔒 Segurança e Armazenamento

* **Versão Web:** Os dados são salvos localmente na memória do seu próprio navegador via `LocalStorage`. Nenhuma informação financeira é enviada para servidores externos.

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para utilizar, estudar, modificar e distribuir conforme suas necessidades.

---
*Desenvolvido por **MFF**.*
