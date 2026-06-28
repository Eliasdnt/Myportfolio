# Portfólio — Antônio Elias

Portfólio pessoal moderno, **100% estático** (deploy direto no GitHub Pages), com:

- 🎨 Identidade **Índigo & Ardósia** com **tema claro e escuro** alternáveis (sem flash).
- ✨ Animações sutis e profissionais (reveal no scroll, digitação, contadores, botões magnéticos), respeitando `prefers-reduced-motion`.
- 🐙 Integração **ao vivo com o GitHub** (2 contas) com cache em `localStorage`: repositórios em destaque, timeline de commits, gráfico de linguagens e estatísticas.
- 🔒 **Vitrine de projetos privados/do trabalho** — exposição sem acesso ao código.
- 📬 Formulário de contato com validação, envio assíncrono (Web3Forms) e cópia local.
- 📊 **Analytics em conformidade com a LGPD** (GoatCounter, sem cookies de rastreamento) com banner de consentimento opt-in.

Construído com **Tailwind CSS** (compilado via CLI) + JavaScript puro. Sem backend.

---

## 🚀 Começando

Pré-requisito: [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Instalar dependências (Tailwind)
npm install

# 2. Compilar o CSS para produção (gera css/output.css)
npm run build

# 3. Durante o desenvolvimento — recompila o CSS ao salvar
npm run watch

# 4. Rodar localmente (em outro terminal) — http://localhost:3000
npm run dev
```

> **Importante:** o arquivo `css/output.css` é **versionado** (commitado). É ele que o
> GitHub Pages serve. Sempre rode `npm run build` antes de fazer commit de mudanças visuais.

---

## ⚙️ Configuração (sem mexer no código)

Tudo que você cura fica em [`js/config.js`](js/config.js):

### 1. Repositórios em destaque (GitHub)

```js
featuredRepos: [
  { account: "primary", name: "Animais-Fantasticos" },
  { account: "work",    name: "nome-do-repo" }, // conta de trabalho
]
```

- `account: "primary"` → conta pessoal (`Eliasdnt`).
- `account: "work"` → conta de trabalho (`Elias-Lummar`). **Apenas** os repositórios
  listados aqui são exibidos da conta de trabalho — os commits do trabalho também são
  filtrados para esses repositórios.

### 2. Vitrine de projetos privados / do trabalho

Cards manuais, **sem link de código** (apenas exposição). Edite `privateShowcase`:

```js
privateShowcase: [
  {
    title: "Projeto interno (Lummar)",
    description: "Descrição que pode ser tornada pública.",
    image: "img/screenshot.png", // opcional
    tags: ["React", "TypeScript"],
    demo: "",                     // opcional, se houver demo pública
    type: "privado",
  },
]
```

Deixe `privateShowcase: []` para não exibir nenhum.

### 3. Analytics (GoatCounter) — **ação necessária**

1. Crie uma conta grátis em <https://www.goatcounter.com/>.
2. Escolha um código de site (ex.: `eliasdnt` → `https://eliasdnt.goatcounter.com`).
3. Cole em `js/config.js`:

```js
goatcounterCode: "eliasdnt",
```

Enquanto estiver vazio (`""`), a agregação entre visitantes fica desativada — só o resumo
da sessão local é gravado no navegador do visitante.

### 4. E-mail do formulário de contato — **ação necessária**

O envio usa **Web3Forms** (chave já configurada em `index.html`). Para as mensagens
chegarem em **antoniodnt22@gmail.com**:

- Acesse o painel da sua conta Web3Forms e confirme o e-mail de destino da chave, **ou**
- Gere uma nova `access_key` para `antoniodnt22@gmail.com` em <https://web3forms.com/> e
  substitua o valor do campo `access_key` em `index.html`.

### 5. Currículo em PDF (opcional)

Para habilitar o botão **"Baixar CV"**, coloque o arquivo em `cv/Antonio-Elias-CV.pdf`.
Sem o arquivo, o botão mostra um aviso amigável.

---

## 🌐 Deploy no GitHub Pages

1. Faça commit de tudo, **incluindo `css/output.css`** (já buildado).
2. No repositório: **Settings → Pages → Source: `main` / root**.
3. Acesse `https://<seu-usuario>.github.io/<repo>/`.

Não há etapa de build no servidor — o site é puramente estático.

---

## 🗂️ Estrutura

```
index.html              # página única com todas as seções
package.json            # scripts de build/watch
tailwind.config.js      # tema (cores semânticas, dark mode, animações)
src/input.css           # fonte do Tailwind + componentes/utilitários
css/output.css          # CSS COMPILADO (versionado — servido pelo Pages)
js/
  config.js             # 👈 curadoria de conteúdo (edite aqui)
  theme.js              # tema claro/escuro
  animations.js         # reveal, digitação, contadores, magnetic
  projects.js           # render dos projetos + filtro
  github.js             # fetch GitHub + cache + abas
  contact.js            # formulário (validação + Web3Forms + localStorage)
  analytics.js          # consentimento LGPD + GoatCounter + engajamento + geo
  main.js               # nav, menu mobile, header, etc.
img/                    # imagens (ícones e screenshots de projetos)
```

---

## 🔐 Privacidade & LGPD

- **Opt-in real:** nenhuma medição ocorre antes do consentimento explícito.
- Banner com **Aceitar / Recusar / Configurar** e modal de preferências (Analytics e
  Localização aproximada são separados).
- Sem cookies de rastreamento (GoatCounter é cookieless). IP **não** é armazenado.
- O usuário pode **revogar** a qualquer momento pelo rodapé (Privacidade / Cookies),
  o que apaga os dados locais coletados.
- Controlador: Antônio Elias — antoniodnt22@gmail.com.

Dados coletados (anônimos): origem do acesso (referrer/UTM), seções visitadas e tempo
aproximado, localização aproximada (país/região) e tipo de dispositivo/navegador.

---

## 🎨 Paleta — Índigo & Ardósia

| Token   | Claro     | Escuro    |
|---------|-----------|-----------|
| bg      | `#F8FAFC` | `#0F172A` |
| surface | `#FFFFFF` | `#1E293B` |
| fg      | `#0F172A` | `#E2E8F0` |
| accent  | `#6366F1` | `#818CF8` |

As cores são definidas como variáveis CSS em `src/input.css` e expostas ao Tailwind como
utilitários semânticos (`bg-bg`, `text-fg`, `text-accent`, …). Para ajustar o tema, edite
apenas os tokens em `:root` / `.dark` e rode `npm run build`.
