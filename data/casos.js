/* Casos do jogo.
   Coordenadas x, y = pixels do mapa-mestre v6 (6620 x 3726).

   Caso 001 = protótipo do formato "quadro de fichas":
   - fichas: cada pista tem ORIGEM: "vi" (testemunha direta), "prova" (objeto/documento),
     "ouvi" (de segunda mão ou declaração de suspeito) e "boato" (jornal, rumor).
   - locais: metade é verdadeira (desafio libera fichas), metade só faz perder tempo
     (dá fichas de rumor, algumas que enganam).
   - perguntas: o jogador escreve a conclusão e LIGA fichas a ela no caderno.
     A Yard confere a conclusão, se as fichas a sustentam (sustentam, com origem vi/prova)
     e se alguma ficha ligada é um engano (enganam). */
window.CASOS = [
  {
    id: "001",
    titulo: "O RELÓGIO QUE PAROU ÀS NOVE",
    endereco: "Marylebone",
    ano: 1895,
    data: "out. 1895",
    dificuldade: 1,
    recompensa: 30,
    prazoHoras: 30,
    relato: "Eleanor Bell chegou aflita a Baker Street: o irmão, Arthur, relojoeiro, sumiu da oficina, trancada por dentro. O relógio da parede parou às nove. \"Ou alguém quer que acreditemos nisso\", disse Holmes.",
    objetivo: "Descobrir quem armou a cena da oficina, por quê, e onde está Arthur Bell. Cuidado com o que Londres diz: nem tudo que se repete é verdade.",
    situacao: "ABERTO",
    fichas: {
      relogio:   { origem: "prova", fonte: "Oficina Bell", texto: "O relógio foi adiantado à mão para 9h05: há arranhões frescos de lâmina fina no ponteiro." },
      trava:     { origem: "prova", fonte: "Oficina Bell", texto: "A trava foi fechada pelo lado de fora, com um arame. A porta trancada não prova que ninguém saiu." },
      cartas:    { origem: "prova", fonte: "Residência dos Bell", texto: "Cartas assinadas E.P. exigindo dinheiro todo mês, e o diário cifrado de Arthur com o nome PRICE." },
      livro:     { origem: "prova", fonte: "Residência dos Bell", texto: "No livro-caixa, o último lançamento, da véspera: \"Não pago mais.\"" },
      alibi:     { origem: "ouvi",  fonte: "Edmund Price", texto: "Price declara: \"Estive no Café Royal desde as 8h45, pergunte a quem quiser.\"" },
      tesoura:   { origem: "prova", fonte: "Loja de Edmund Price", texto: "Uma tesoura fina de relojoeiro, com limalha de latão nas lâminas, largada no balcão de um antiquário." },
      bilhete:   { origem: "prova", fonte: "Loja de Edmund Price", texto: "Bilhete amassado na lixeira de Price: \"Ele não paga mais. Resolver hoje.\"" },
      molly:     { origem: "vi",    fonte: "Molly Hughes, garçonete", texto: "Molly viu Price chegar ao café às 9h20, sem fôlego. Ele pediu que ela dissesse que estava ali desde cedo." },
      clara:     { origem: "vi",    fonte: "Molly Hughes, garçonete", texto: "Molly viu Clara Whitmore no café a manhã inteira, desde as 8h30." },
      fuga:      { origem: "prova", fonte: "Depósito de peças", texto: "Bilhete de Arthur no armário: \"Saí às 8h35 pela passagem de serviço, com o livro-caixa. Estou escondido no sótão.\"" },
      pegadas:   { origem: "vi",    fonte: "Thomas Reed", texto: "Reed viu pegadas com serragem da oficina subindo a escada do sótão do depósito, de madrugada." },
      recibo:    { origem: "prova", fonte: "Depósito de peças", texto: "Recibo: a engrenagem da briga entre Reed e Arthur foi trocada e paga na véspera." },
      // ----- fichas dos locais que não levam a nada (rumores e enganos) -----
      jornal:    { origem: "boato", fonte: "The Times", texto: "Manchete: \"Relojoeiro some às nove em ponto. Dívidas de jogo seriam o motivo da fuga.\"" },
      ameaca:    { origem: "ouvi",  fonte: "Taberneiro do Coach and Horses", texto: "O taberneiro ouviu dizer que Thomas Reed jurou, bêbado, que \"ia acabar com o Bell\"." },
      america:   { origem: "boato", fonte: "Uma beata de St. Marylebone", texto: "Corre na igreja que Arthur pretendia fugir para a América com uma mulher misteriosa." },
      joias:     { origem: "prova", fonte: "Penhorista de Covent Garden", texto: "Clara Whitmore penhorou as joias da família na semana passada. Está cheia de dívidas." },
      cocheiro:  { origem: "boato", fonte: "Cocheiro do Hyde Park", texto: "Um cocheiro jura que \"um relojoeiro\" pegou um coche para Dover na manhã do sumiço." }
    },
    perguntas: [
      { id: "quem", titulo: "Quem armou a cena da oficina?", aceitas: ["price"], erradas: ["reed", "clara", "whitmore", "molly", "hughes", "eleanor"],
        sustentam: ["relogio", "trava", "tesoura", "bilhete", "molly", "cartas"], enganam: ["ameaca", "joias", "jornal"] },
      { id: "porque", titulo: "Por que ele fez isso?", aceitas: ["chantag", "pagar", "pagamento", "pagava", "parou de pagar", "nao paga"], erradas: ["jogo", "fuga", "america"],
        sustentam: ["cartas", "livro", "bilhete"], enganam: ["jornal", "joias", "america"] },
      { id: "onde", titulo: "Onde está Arthur Bell?", aceitas: ["deposito", "sotao"], erradas: ["america", "dover"],
        sustentam: ["fuga", "pegadas", "trava"], enganam: ["america", "cocheiro", "jornal"] }
    ],
    locais: [
      { id: "oficina", nome: "Oficina Bell", bairro: "Marylebone", x: 2050, y: 1190, foto: "assets/locais/001_oficina.jpg",
        descricao: "A porta estava trancada por dentro e cheira a óleo de relógio. Na parede, o grande relógio parado. Holmes aproxima a lupa do mostrador e assobia baixo: há arranhões frescos no ponteiro dos minutos, como de uma lâmina fina.",
        desafio: { tipo: "OBSERVAÇÃO", enunciado: "Olhe a foto. O ponteiro das horas está sobre o 9, o dos minutos aponta para o 1. Que horas o relógio marca?",
          respostas: ["905", "9h05", "0905", "9h5", "noveecinco", "noveecincominutos"], dica: "Cada número do mostrador vale cinco minutos para o ponteiro grande." },
        fichas: ["relogio", "trava"] },
      { id: "jornal", nome: "Redação do The Times", bairro: "Blackfriars", x: 5300, y: 1900, foto: "assets/locais/001_jornal.jpg",
        descricao: "Máquinas rugindo, tinta fresca, meninos gritando a edição da tarde. Um repórter de colete abre um sorriso: \"Holmes! Já sabemos tudo do relojoeiro. Parou às nove em ponto, fugiu das dívidas. Está na primeira página!\" Ele não esteve na oficina. Ninguém aqui esteve.",
        fichasVisita: ["jornal"] },
      { id: "residencia", nome: "Residência dos Bell", bairro: "Kensington", x: 560, y: 2250, foto: "assets/locais/001_residencia.jpg",
        descricao: "Eleanor abre a escrivaninha do irmão. Há cartas antigas assinadas \"E.P.\" exigindo dinheiro todo mês e um livro-caixa com os pagamentos. Num canto do diário, uma palavra escrita em código.",
        desafio: { tipo: "CIFRA", enunciado: "Arthur escondia o nome do chantagista trocando cada letra pela seguinte do alfabeto. No diário está escrito: Q S J D F. Que nome é esse?",
          respostas: ["price"], dica: "Volte cada letra uma posição: Q vira P." },
        fichas: ["cartas", "livro"] },
      { id: "pub", nome: "Pub Coach and Horses", bairro: "Soho", x: 3080, y: 1720, foto: "assets/locais/001_pub.jpg",
        descricao: "Fumaça de cachimbo e cerveja morna. O taberneiro enxuga um copo e baixa a voz: \"O fornecedor, Reed, esteve aqui semana passada. Dizem que bebeu demais e jurou acabar com o Bell. Eu não ouvi, mas todo mundo comenta.\"",
        fichasVisita: ["ameaca"] },
      { id: "loja", nome: "Loja de Edmund Price", bairro: "Clerkenwell", x: 5500, y: 1130, foto: "assets/locais/001_loja.jpg",
        descricao: "Edmund Price, antiquário, recebe Holmes com um sorriso largo demais e jura que passou a manhã no Café Royal desde as 8h45. Entre bibelôs e porcelanas, uma ferramenta fora de lugar chama a atenção de Holmes.",
        fichasVisita: ["alibi"],
        desafio: { tipo: "CHARADA", enunciado: "Holmes recita baixinho: \"Tenho duas pernas e nenhum pé, mordo o latão sem ter dente, e um antiquário não precisaria de mim.\" O que é?",
          respostas: ["tesoura", "alicate"], dica: "Olhe o balcão na foto: é a ferramenta largada entre os bibelôs." },
        fichas: ["tesoura", "bilhete"] },
      { id: "igreja", nome: "Igreja de St. Marylebone", bairro: "Marylebone", x: 2600, y: 1050, foto: "assets/locais/001_igreja.jpg",
        descricao: "O vigário acende velas e suspira. \"Arthur? Homem de poucas palavras, vinha aos domingos. As senhoras da paróquia falam de uma mulher misteriosa e de uma passagem para a América. Não sei de onde tiram essas coisas.\" Um gato dorme no banco da frente.",
        fichasVisita: ["america"] },
      { id: "cafe", nome: "Café Royal", bairro: "Piccadilly", x: 3000, y: 2210, foto: "assets/locais/001_cafe.jpg",
        descricao: "Molly Hughes, a garçonete, enxuga as mãos no avental e hesita. Numa mesa do fundo, Clara Whitmore esconde um embrulho. Molly baixa a voz: \"O Sr. Price me pediu para dizer que estava aqui desde cedo...\"",
        desafio: { tipo: "INTERROGATÓRIO", enunciado: "Molly repete a frase de Price. Faça a pergunta que separa o que ela VIU do que lhe pediram para dizer: a que horas ela tirava do forno a fornada que estava saindo quando ele entrou? A fornada entra às 8h50 e assa meia hora. Que horas eram?",
          respostas: ["920", "9h20", "0920", "noveevinte"], dica: "8h50 mais trinta minutos." },
        fichas: ["molly", "clara"] },
      { id: "penhor", nome: "Penhorista de Covent Garden", bairro: "Covent Garden", x: 3900, y: 1950, foto: "assets/locais/001_penhor.jpg",
        descricao: "Relógios de bolso, broches e anéis em vitrines empoeiradas. O penhorista folheia o livro com prazer. \"A Srta. Whitmore? Esteve aqui semana passada. Penhorou as joias da avó. Gente fina com dívidas, Sr. Holmes, é o que mais aparece.\"",
        fichasVisita: ["joias"] },
      { id: "deposito", nome: "Depósito de peças", bairro: "Lambeth", x: 4300, y: 2860, foto: "assets/locais/001_deposito.jpg",
        descricao: "Thomas Reed, o fornecedor, admite a briga com Arthur por uma engrenagem danificada, mas mostra o recibo pago na véspera. Reed conta que viu pegadas com serragem subindo ao sótão. No fundo, um armário trancado com cadeado de letras. Riscado na madeira: \"a senha é o nome de quem vai me procurar\".",
        desafio: { tipo: "CADEADO", enunciado: "Quem procurou Holmes por causa do sumiço de Arthur? Digite o primeiro nome para abrir o cadeado.",
          respostas: ["eleanor"], dica: "Foi ela quem chegou aflita a Baker Street." },
        fichas: ["fuga", "pegadas", "recibo"] },
      { id: "parque", nome: "Ponto de coches do Hyde Park", bairro: "Hyde Park", x: 1400, y: 1950, foto: "assets/locais/001_parque.jpg",
        descricao: "Cavalos batendo os cascos, cocheiros fumando sob as árvores. Um deles se aproxima, esperando uma moeda: \"Um relojoeiro? Vi sim, senhor. Quer dizer... um colega viu. Pegou um coche para Dover, bem cedinho. Ou era um alfaiate.\"",
        fichasVisita: ["cocheiro"] }
    ],
    epilogo: "Arthur Bell foi encontrado no sótão do depósito, vivo e assustado, abraçado ao livro-caixa com as provas da chantagem. Price foi entregue ao inspetor Lestrade. O The Times publicou uma correção minúscula na página doze. Eleanor pagou os honorários e ainda deixou um relógio de bolso feito pelo irmão."
  }
];
