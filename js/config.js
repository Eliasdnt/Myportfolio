/* =============================================================================
   CONFIG CENTRAL DO PORTFÓLIO
   -----------------------------------------------------------------------------
   Edite este arquivo para curar o conteúdo do site sem mexer no código.
   É o único lugar onde você define: contas do GitHub, repositórios em destaque,
   projetos privados (vitrine), e o código do GoatCounter para analytics.
   ========================================================================== */
window.PORTFOLIO_CONFIG = {
  // ---------------------------------------------------------------------------
  // GitHub
  // ---------------------------------------------------------------------------
  github: {
    // Conta principal (pessoal) e conta de trabalho.
    primary: "Eliasdnt",
    work: "Elias-Lummar",

    // Repositórios em DESTAQUE (curados por você). São buscados ao vivo na API
    // pública para mostrar estrelas/linguagem/descrição atualizadas.
    //   account: "primary" | "work"
    // Da conta de trabalho, SOMENTE o que estiver listado aqui é exibido.
    featuredRepos: [
      { account: "primary", name: "Animais-Fantasticos" },
      { account: "primary", name: "nftRocketseat" },
      { account: "primary", name: "Porfolio-lobo-origamid" },
      // Exemplo de repo público da conta de trabalho que você queira destacar:
      // { account: "work", name: "nome-do-repo" },
    ],

    // Quantos commits recentes exibir na timeline.
    maxCommits: 12,
  },

  // ---------------------------------------------------------------------------
  // PROJETOS PÚBLICOS (cards estáticos, sempre exibidos)
  // ---------------------------------------------------------------------------
  projects: [
    {
      title: "Bikcraft",
      description:
        "E-commerce fictício de bicicletas elétricas para praticar HTML e CSS com layout responsivo.",
      image:
        "img/Imagem do WhatsApp de 2024-05-13 à(s) 16.16.04_c402475e.jpg",
      tags: ["HTML", "CSS"],
      demo: "https://eliasdnt.github.io/projeto-final-curso-origamid/",
      code: "https://github.com/eliasdnt/projeto-final-curso-origamid",
      type: "publico",
    },
    {
      title: "Animais Fantásticos",
      description:
        "Site informativo com forte uso de manipulação de DOM em JavaScript puro.",
      image:
        "img/Imagem do WhatsApp de 2024-04-23 à(s) 15.47.52_e9a3a849.jpg",
      tags: ["JavaScript", "DOM"],
      demo: "https://eliasdnt.github.io/Animais-Fantasticos/",
      code: "https://github.com/eliasdnt/Animais-Fantasticos",
      type: "publico",
    },
    {
      title: "Portfólio — Lobo",
      description:
        "Layout moderno e responsivo de portfólio explorando Grid e Flexbox.",
      image:
        "img/Imagem do WhatsApp de 2024-04-23 à(s) 16.59.09_b0042de3.jpg",
      tags: ["HTML", "CSS", "Grid"],
      demo: "https://eliasdnt.github.io/Porfolio-lobo-origamid/",
      code: "https://github.com/eliasdnt/Porfolio-lobo-origamid",
      type: "publico",
    },
    {
      title: "Desafio Rocketseat — NFT's",
      description:
        "Landing page sobre o mercado de NFT's, com design arrojado e interatividade.",
      image: "img/rocketseat.png",
      tags: ["HTML", "CSS", "JS"],
      demo: "",
      code: "https://github.com/eliasdnt/nftRocketseat",
      type: "publico",
    },
  ],

  // ---------------------------------------------------------------------------
  // VITRINE PRIVADA / TRABALHO (cards manuais — SEM acesso ao código)
  // -----------------------------------------------------------------------------
  // Use para apresentar projetos privados ou do trabalho (Elias-Lummar) que
  // você quer mostrar como vitrine. Não há link de código; apenas exposição.
  // Preencha/edite à vontade. Deixe a lista vazia ([]) para ocultar a seção.
  // ---------------------------------------------------------------------------
  privateShowcase: [
    {
      title: "Sistema de Inventário",
      description:
        "Sistema construído para realizar a contagem do estoque da Lummar.",
      image: "", // opcional: caminho de um screenshot em img/
      tags: ["Javascript", "Node.js", "SQL Server", "Express", "TailwindCSS"],
      demo: "", // opcional: link de demonstração público, se houver
      type: "privado",
    },
    {
      title: "Sistema de Chamados Internos",
      description:
        "Sistema construído para gerenciar chamados de TI internos da Lummar.",
      image: "", // opcional: caminho de um screenshot em img/
      tags: ["Python", "Flask", "SQL Server", "Jinja2", "TailwindCSS"],
      demo: "", // opcional: link de demonstração público, se houver
      type: "privado",
    },
        {
      title: "Automação - Coleta de dados no ERP PROTHEUS",
      description:
        "Automação de coleta de dados no ERP PROTHEUS via API foi desenvolvida para otimizar o processo de extração de informações relevantes do sistema, permitindo uma análise mais eficiente e tomada de decisões estratégicas.",
      image: "", // opcional: caminho de um screenshot em img/
      tags: ["Python", "Tkinter", "Pandas", "Requests", "JSON", "API"],
      demo: "", // opcional: link de demonstração público, se houver
      type: "privado",
    },
  ],

  // ---------------------------------------------------------------------------
  // ANALYTICS (GoatCounter) — sem cookies, em conformidade com a LGPD
  // -----------------------------------------------------------------------------
  // 1) Crie uma conta gratuita em https://www.goatcounter.com/
  // 2) Pegue o código do seu site (ex.: "eliasdnt" => https://eliasdnt.goatcounter.com)
  // 3) Cole abaixo. Enquanto estiver vazio, a coleta agregada fica desativada
  //    (só o resumo local da sessão é gravado no navegador do visitante).
  // ---------------------------------------------------------------------------
  goatcounterCode: "", // ex.: "eliasdnt"

  // E-mail do controlador (LGPD) e contato.
  contactEmail: "antoniodnt22@gmail.com",
};
