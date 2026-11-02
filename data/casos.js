/* Casos do jogo (formato de investigação).
   Coordenadas x, y = pixels do mapa-mestre v6 (6620 x 3726), origem no canto superior esquerdo.
   Cada local tem um desafio; ao resolvê-lo, a pista vai para o caderno, na página da pergunta indicada.
   As conclusões são digitadas pelo jogador e conferidas na Scotland Yard:
   "aceitas" = trechos que precisam aparecer (sem acento, minúsculas; basta um);
   "erradas" = trechos que derrubam a resposta (ex.: outro suspeito). */
window.CASOS = [
  {
    id: "001",
    titulo: "O RELÓGIO QUE PAROU ÀS NOVE",
    endereco: "Marylebone",
    ano: 1895,
    data: "out. 1895",
    dificuldade: 1,
    recompensa: 30,
    prazoHoras: 24,
    relato: "Eleanor Bell chegou aflita a Baker Street: o irmão, Arthur, relojoeiro, sumiu da oficina, trancada por dentro. O relógio da parede parou às nove. \"Ou alguém quer que acreditemos nisso\", disse Holmes.",
    objetivo: "Descobrir quem armou a cena da oficina, por quê, e onde está Arthur Bell.",
    situacao: "ABERTO",
    perguntas: [
      { id: "quem", titulo: "Quem armou a cena da oficina?", aceitas: ["price"], erradas: ["reed", "clara", "whitmore", "molly", "hughes", "eleanor"] },
      { id: "porque", titulo: "Por que fez isso?", aceitas: ["chantag", "dinheiro", "pagar", "pagamento", "pagava", "divida"], erradas: [] },
      { id: "onde", titulo: "Onde está Arthur Bell?", aceitas: ["deposito", "lambeth", "sotao"], erradas: [] }
    ],
    locais: [
      {
        id: "oficina", nome: "Oficina Bell", bairro: "Marylebone", x: 2050, y: 1190, foto: "assets/locais/001_oficina.jpg",
        descricao: "A porta estava trancada por dentro e cheira a óleo de relógio. Na parede, o grande relógio parado. Holmes aproxima a lupa do mostrador e assobia baixo: há arranhões frescos no ponteiro dos minutos, como de uma lâmina fina.",
        desafio: { tipo: "OBSERVAÇÃO", enunciado: "O ponteiro das horas está exatamente sobre o 9. O dos minutos aponta para o 1. Que horas o relógio marca?",
          respostas: ["905", "9h05", "0905", "9h5", "noveecinco", "noveecincominutos"], dica: "Cada número do mostrador vale cinco minutos para o ponteiro grande." },
        pista: { pergunta: "quem", texto: "O relógio foi adiantado à mão para 9h05, com uma ferramenta fina de lâmina. A trava foi fechada por fora, com arame. Quem armou a cena queria um álibi para as 9h05." }
      },
      {
        id: "residencia", nome: "Residência dos Bell", bairro: "Kensington", x: 560, y: 2250, foto: "assets/locais/001_residencia.jpg",
        descricao: "Eleanor abre a escrivaninha do irmão. Há cartas antigas assinadas \"E.P.\" exigindo dinheiro todo mês e um livro-caixa com os pagamentos. O último lançamento, da véspera, diz apenas: \"Não pago mais.\" Num canto do diário, uma palavra escrita em código.",
        desafio: { tipo: "CIFRA", enunciado: "Arthur escondia o nome do chantagista trocando cada letra pela seguinte do alfabeto. No diário está escrito: Q S J D F. Que nome é esse?",
          respostas: ["price"], dica: "Volte cada letra uma posição: Q vira P." },
        pista: { pergunta: "porque", texto: "Arthur era chantageado por E.P. (PRICE) e pagava todo mês. Na véspera do sumiço, decidiu parar de pagar." }
      },
      {
        id: "loja", nome: "Loja de Edmund Price", bairro: "Clerkenwell", x: 5500, y: 1130, foto: "assets/locais/001_loja.jpg",
        descricao: "Edmund Price, antiquário, recebe Holmes com um sorriso largo demais. Jura que passou a manhã no Café Royal desde as 8h45. Entre bibelôs e porcelanas, uma ferramenta fora de lugar chama a atenção de Holmes.",
        desafio: { tipo: "CHARADA", enunciado: "Holmes recita baixinho: \"Tenho duas pernas e nenhum pé, mordo o latão sem ter dente, e um antiquário não precisaria de mim.\" O que é?",
          respostas: ["tesoura", "alicate"], dica: "Olhe o balcão na foto: é a ferramenta largada entre os bibelôs." },
        pista: { pergunta: "quem", texto: "Price tem uma tesoura fina de relojoeiro com limalha de latão nas lâminas, sem ser relojoeiro. Na lixeira, um bilhete amassado: \"Ele não paga mais. Resolver hoje.\"" }
      },
      {
        id: "cafe", nome: "Café Royal", bairro: "Piccadilly", x: 3000, y: 2210, foto: "assets/locais/001_cafe.jpg",
        descricao: "Molly Hughes, a garçonete, enxuga as mãos no avental e hesita. Numa mesa do fundo, Clara Whitmore esconde um embrulho de joias. Molly baixa a voz: \"O Sr. Price me pediu para dizer que estava aqui desde cedo...\"",
        desafio: { tipo: "HORÁRIOS", enunciado: "Molly lembra: \"Ele entrou quando eu tirava do forno a fornada de pãezinhos. Ela entra às 8h50 e assa meia hora.\" A que horas Price chegou ao café?",
          respostas: ["920", "9h20", "0920", "noveevinte"], dica: "8h50 mais trinta minutos." },
        pista: { pergunta: "quem", texto: "Price só chegou ao café às 9h20, sem fôlego, e pediu a Molly que mentisse. Clara Whitmore tem dívidas e vendia joias em segredo, mas estava no café desde as 8h30." }
      },
      {
        id: "deposito", nome: "Depósito de peças", bairro: "Lambeth", x: 4300, y: 2860, foto: "assets/locais/001_deposito.jpg",
        descricao: "Thomas Reed, o fornecedor, admite a briga com Arthur por uma engrenagem danificada, mas mostra o recibo pago na véspera. No chão, pegadas com serragem da oficina levam a um armário trancado com cadeado de letras. Riscado na madeira: \"a senha é o nome de quem vai me procurar\".",
        desafio: { tipo: "CADEADO", enunciado: "Quem procurou Holmes por causa do sumiço de Arthur? Digite o primeiro nome para abrir o cadeado.",
          respostas: ["eleanor"], dica: "Foi ela quem chegou aflita a Baker Street." },
        pista: { pergunta: "onde", texto: "No armário, um lampião ainda morno e um bilhete de Arthur: \"Saí às 8h35 pela passagem de serviço, com o livro-caixa. Estou escondido no sótão do depósito.\" A briga com Reed já estava resolvida." }
      }
    ],
    epilogo: "Arthur Bell foi encontrado no sótão do depósito, vivo e assustado, abraçado ao livro-caixa com as provas da chantagem. Price foi entregue ao inspetor Lestrade. Eleanor pagou os honorários e ainda deixou um relógio de bolso feito pelo irmão."
  }
];
