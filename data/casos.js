/* Casos do jogo.
   Coordenadas x, y = pixels do mapa-mestre v6 (6620 x 3726), origem no canto superior esquerdo.
   Caso 001: enredo recuperado do roteiro original, com as lacunas completadas (6º personagem Molly Hughes, as 10 evidências e o epílogo).
   Casos com "bloqueado: true" aparecem na gaveta, mas ainda não abrem. */
window.CASOS = [
  {
    id: "001",
    titulo: "O RELÓGIO QUE PAROU ÀS NOVE",
    endereco: "Marylebone",
    ano: 1895,
    data: "out. 1895",
    relato: "Eleanor Bell chegou aflita a Baker Street: o irmão, Arthur, relojoeiro, sumiu da oficina, trancada por dentro. O relógio da parede parou às nove. \"Ou alguém quer que acreditemos nisso\", disse Holmes.",
    objetivo: "Descobrir o que aconteceu com Arthur Bell e quem armou a cena da oficina.",
    situacao: "ABERTO",
    locais: [
      {
        id: "oficina", nome: "Oficina Bell", x: 2180, y: 1180,
        texto: "A porta estava trancada por dentro. Holmes examina o relógio de parede: \"Nove e cinco, Watson, não nove. E há marcas frescas de alicate no ponteiro.\" Na trava, arranhões finos, feitos pelo lado de fora.\n\nEvidência 1: o relógio foi adiantado à mão para as 9h05.\nEvidência 2: a trava foi fechada por fora, com um arame."
      },
      {
        id: "residencia", nome: "Residência dos Bell", x: 1880, y: 1300,
        texto: "Eleanor abre a escrivaninha do irmão. Há cartas antigas assinadas \"E.P.\" exigindo dinheiro, e um livro-caixa com pagamentos mensais ao mesmo E.P. O último lançamento diz: \"Não pago mais.\"\n\nEvidência 3: Arthur era chantageado por alguém com as iniciais E.P.\nEvidência 4: Arthur decidiu parar de pagar na véspera do sumiço."
      },
      {
        id: "loja", nome: "Loja de Edmund Price", x: 2500, y: 1080,
        texto: "Edmund Price, antiquário, jura que passou a manhã no Café de Marylebone desde as 8h45. No balcão, um alicate fino de relojoeiro com limalha de latão. Na lixeira, um bilhete amassado: \"Ele não paga mais. Resolver hoje.\"\n\nEvidência 5: Price tem um alicate de relojoeiro sem ser relojoeiro.\nEvidência 6: o bilhete liga Price ao fim dos pagamentos."
      },
      {
        id: "cafe", nome: "Café de Marylebone", x: 2350, y: 1360,
        texto: "Molly Hughes, a garçonete, hesita. \"O Sr. Price chegou às nove e vinte, sem fôlego, e me pediu para dizer que estava aqui desde cedo.\" Numa mesa do fundo, Clara Whitmore confessa que estava ali desde as 8h30, vendendo em segredo as joias da família para pagar dívidas.\n\nEvidência 7: o álibi de Price é falso; ele chegou às 9h20.\nEvidência 8: Clara tem dívidas, mas estava no café a manhã toda."
      },
      {
        id: "deposito", nome: "Depósito de peças", x: 2700, y: 1320,
        texto: "Thomas Reed, o fornecedor, admite a briga com Arthur por uma engrenagem danificada, mas mostra o recibo: a peça foi trocada e paga na véspera. No fundo do depósito, pegadas com serragem da oficina levam a um lampião ainda morno.\n\nEvidência 9: a briga com Reed já estava resolvida.\nEvidência 10: alguém saiu da oficina pela passagem de serviço e se escondeu aqui."
      }
    ],
    solucao: {
      perguntas: [
        {
          pergunta: "Como a oficina ficou trancada por dentro?",
          opcoes: [
            { texto: "Arthur se trancou e fugiu pela janela.", correta: false,
              resposta: "As janelas da oficina não abrem, Watson. E os arranhões na trava foram feitos pelo lado de fora." },
            { texto: "Arthur saiu pela passagem de serviço; depois alguém fechou a trava por fora com um arame.", correta: true,
              resposta: "Exato. A porta trancada não prova que ninguém saiu: prova apenas que alguém quis que parecesse assim." },
            { texto: "Thomas Reed tinha uma cópia da chave.", correta: false,
              resposta: "Reed nunca teve chave, e a trava não foi aberta com chave: foi forçada com arame." }
          ]
        },
        {
          pergunta: "O que o relógio parado realmente indica?",
          opcoes: [
            { texto: "Arthur desapareceu às 9h05.", correta: false,
              resposta: "É justamente o que o culpado queria que pensássemos. Um relógio adiantado à mão não é testemunha." },
            { texto: "Alguém adiantou o relógio para criar um horário falso, que combinasse com o próprio álibi.", correta: true,
              resposta: "Isso. As marcas de alicate mostram que o ponteiro foi movido. O horário falso servia para inocentar quem estivesse no café às 9h05." },
            { texto: "O relógio quebrou sozinho às nove.", correta: false,
              resposta: "Relógios quebrados não deixam marcas frescas de alicate no ponteiro." }
          ]
        },
        {
          pergunta: "Quem armou a cena da oficina?",
          opcoes: [
            { texto: "Thomas Reed, por causa da peça danificada.", correta: false,
              resposta: "A briga terminou na véspera, com recibo pago. Reed não ganharia nada com um horário falso." },
            { texto: "Clara Whitmore, por causa das dívidas.", correta: false,
              resposta: "Clara tem dívidas e um segredo, mas Molly a viu no café desde as 8h30. Ela não poderia estar na oficina." },
            { texto: "Edmund Price, o chantagista.", correta: true,
              resposta: "Elementar. Price, o E.P. das cartas, foi à oficina às 8h50 cobrar o dinheiro e encontrou Arthur já fora. Adiantou o relógio para 9h05, fechou a trava com arame e correu ao café para fingir que estava lá desde cedo." }
          ]
        }
      ],
      epilogo: "Arthur Bell foi encontrado no fundo do depósito de peças, vivo e assustado. Saiu da oficina às 8h35 para escapar de Price, levando o livro-caixa com as provas da chantagem. Price foi entregue ao inspetor Lestrade. Eleanor pagou os honorários com um relógio de bolso feito pelo irmão."
    }
  },
  { id: "002", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "003", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "004", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "005", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "006", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "007", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "008", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "009", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "010", titulo: "EM BREVE", endereco: "", bloqueado: true },
  { id: "011", titulo: "EM BREVE", endereco: "", bloqueado: true }
];
