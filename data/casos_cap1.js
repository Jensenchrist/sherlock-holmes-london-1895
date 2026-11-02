/* Capítulo 1 — A Teia (casos 002 a 011).
   Cada caso é independente, mas o dinheiro de vários crimes corre para a mesma organização,
   revelada no caso 011. Coordenadas = pixels do mapa-mestre v6. */
(() => {
  const c = (o) => Object.assign({ ano: 1895, situacao: "ABERTO" }, o);
  const novos = [
    c({
      id: "002", titulo: "O ÚLTIMO TREM DE PADDINGTON", endereco: "Paddington", data: "out. 1895",
      relato: "O mensageiro de um joalheiro embarcou em Bristol com um estojo de diamantes, trancado num vagão de primeira classe. O trem chegou a Paddington sem parar no caminho. O vagão estava vazio, e a janela, trancada.",
      objetivo: "Descobrir para onde foram o mensageiro e os diamantes.",
      locais: [
        { id: "plataforma", nome: "Plataforma 1", x: 700, y: 1700,
          texto: "O condutor Hobbs jura que viu o mensageiro em Bristol e que ninguém saiu do vagão. Holmes repara que o tapete do vagão está seco, embora chovesse forte em Bristol.\n\nEvidência 1: ninguém entrou molhado naquele vagão.\nEvidência 2: o condutor é a única testemunha do embarque." },
        { id: "bagagem", nome: "Vagão de bagagem", x: 420, y: 1830,
          texto: "Entre os latões de leite da fazenda Ashdown, um deles pesa menos do que deveria e tem a tampa lacrada com cera nova. Dentro, palha e um forro de veludo vazio, do tamanho exato de um estojo.\n\nEvidência 3: o estojo viajou escondido num latão de leite.\nEvidência 4: alguém retirou o estojo antes de Holmes chegar." },
        { id: "bilheteria", nome: "Bilheteria", x: 1020, y: 1600,
          texto: "O bilheteiro lembra de um homem de capa que comprou passagem de volta para Bristol meia hora depois do desembarque. “Tinha a mão enfaixada e o sotaque do condutor Hobbs, juro.”\n\nEvidência 5: um cúmplice voltou para Bristol logo depois.\nEvidência 6: o cúmplice parecia irmão do condutor." },
        { id: "hotel", nome: "Hotel Great Western", x: 1160, y: 1380,
          texto: "No quarto 12 está o verdadeiro mensageiro, amarrado e furioso. Nunca embarcou: foi dopado em Bristol por um homem de uniforme. O livro do hotel registra o quarto em nome de “W. Hobbs”.\n\nEvidência 7: o mensageiro nunca esteve no trem.\nEvidência 8: o quarto foi alugado por um Hobbs." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "Por que o vagão chegou vazio?",
            opcoes: [
              { texto: "O mensageiro pulou do trem em movimento.", correta: false, resposta: "A janela estava trancada por dentro e o tapete seco. Ninguém saiu dali." },
              { texto: "O mensageiro nunca embarcou; o condutor mentiu sobre o embarque.", correta: true, resposta: "Exato. A única prova do embarque era a palavra do condutor, e o mensageiro estava dopado no hotel." },
              { texto: "O mensageiro se escondeu debaixo do banco.", correta: false, resposta: "Os bancos de primeira classe são fixos, Watson. Não há espaço nem para um gato." }
            ] },
          { pergunta: "Como os diamantes chegaram a Londres?",
            opcoes: [
              { texto: "Escondidos num latão de leite no vagão de bagagem.", correta: true, resposta: "Sim. O condutor pôs o estojo no latão em Bristol, e um cúmplice o retirou em Paddington." },
              { texto: "Na mala do condutor.", correta: false, resposta: "A polícia revistou a mala de Hobbs na chegada. Ele foi esperto demais para isso." },
              { texto: "Pelo correio.", correta: false, resposta: "O forro de veludo no latão diz o contrário." }
            ] },
          { pergunta: "Quem está por trás do roubo?",
            opcoes: [
              { texto: "O joalheiro, para cobrar o seguro.", correta: false, resposta: "O joalheiro perdeu mais do que o seguro paga. E não tem irmão de mão enfaixada." },
              { texto: "O condutor Hobbs e o irmão, William.", correta: true, resposta: "Elementar. Hobbs mentiu sobre o embarque, William dopou o mensageiro, alugou o quarto e buscou o latão." },
              { texto: "O bilheteiro.", correta: false, resposta: "O bilheteiro só vendeu uma passagem. Foi, aliás, nossa melhor testemunha." }
            ] }
        ],
        epilogo: "Os diamantes foram encontrados com William Hobbs em Bristol. Mas ele já tinha recebido uma quantia por eles, em libras novas, de um comprador que se apresentou apenas como “o agente do Professor”. Holmes guardou a nota em silêncio."
      }
    }),
    c({
      id: "003", titulo: "A MÚMIA QUE RESPIRAVA", endereco: "Bloomsbury", data: "out. 1895",
      relato: "O vigia noturno do Museu Britânico jura que viu a múmia do sacerdote Nesmin respirar. Na manhã seguinte, o amuleto de ouro do sarcófago era uma cópia de latão. As portas passaram a noite trancadas.",
      objetivo: "Descobrir como o amuleto foi trocado dentro de um museu fechado.",
      locais: [
        { id: "egipcia", nome: "Sala Egípcia", x: 3830, y: 1720,
          texto: "Holmes passa a lupa pelo sarcófago. Há fiapos de lã cinza presos na tampa, por dentro, e a poeira do chão foi varrida num semicírculo perfeito.\n\nEvidência 1: alguém esteve DENTRO do sarcófago.\nEvidência 2: o ladrão apagou as próprias pegadas." },
        { id: "leitura", nome: "Sala de Leitura", x: 3640, y: 1560,
          texto: "O registro mostra que o Sr. Cyril Fenwick, curador assistente, pediu na véspera os desenhos originais do amuleto “para um estudo”. Ele usa um casaco de lã cinza.\n\nEvidência 3: Fenwick estudou o amuleto na véspera.\nEvidência 4: o casaco dele combina com os fiapos." },
        { id: "pensao", nome: "Pensão do vigia", x: 4250, y: 1450,
          texto: "O vigia Moss admite que bebeu na ronda da meia-noite. “Mas vi o peito da múmia subir e descer, juro pela minha mãe!” Ele não mente: só não sabia o que estava vendo.\n\nEvidência 5: o vigia estava confuso, mas sincero.\nEvidência 6: o “sopro” da múmia era alguém respirando dentro do sarcófago." },
        { id: "antiquario", nome: "Antiquário em Bloomsbury", x: 3560, y: 1260,
          texto: "O ourives Klein fez, a pedido de um cliente, uma cópia em latão “para uma peça de teatro”. Pagou-se com libras novas, e o recibo traz a assinatura C. F.\n\nEvidência 7: a cópia foi encomendada antes do roubo.\nEvidência 8: as iniciais são de Cyril Fenwick." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "Como o ladrão passou a noite no museu trancado?",
            opcoes: [
              { texto: "Entrou pelo telhado.", correta: false, resposta: "O telhado de vidro está intacto e coberto de fuligem sem marcas." },
              { texto: "Escondido dentro do sarcófago, desde o fechamento.", correta: true, resposta: "Exato. Os fiapos de lã por dentro da tampa e o “sopro” da múmia contam a mesma história." },
              { texto: "Tinha a chave do vigia.", correta: false, resposta: "O vigia nunca largou o molho de chaves, nem bêbado." }
            ] },
          { pergunta: "Por que a múmia “respirava”?",
            opcoes: [
              { texto: "Era alucinação do vigia bêbado.", correta: false, resposta: "Moss bebeu, mas viu algo real. Nunca despreze uma testemunha só porque ela é ridícula." },
              { texto: "Era o ladrão respirando dentro do sarcófago, sob o linho.", correta: true, resposta: "Sim. O peito que subia e descia não era o do sacerdote Nesmin." },
              { texto: "Uma corrente de ar nas faixas de linho.", correta: false, resposta: "A Sala Egípcia não tem janelas, Watson." }
            ] },
          { pergunta: "Quem trocou o amuleto?",
            opcoes: [
              { texto: "O vigia Moss.", correta: false, resposta: "Moss não saberia distinguir ouro egípcio de latão nem que a vida dependesse disso." },
              { texto: "O ourives Klein.", correta: false, resposta: "Klein fez a cópia de boa-fé e guardou o recibo. Um ladrão não guarda recibos." },
              { texto: "Cyril Fenwick, o curador assistente.", correta: true, resposta: "Elementar. Fenwick estudou o amuleto, encomendou a cópia, passou a noite no sarcófago e fez a troca." }
            ] }
        ],
        epilogo: "Fenwick devolveu o amuleto e confessou que tinha dívidas de jogo com um clube de Soho. Quem cobrava as dívidas, disse ele tremendo, “trabalha para alguém que ninguém nunca vê”."
      }
    }),
    c({
      id: "004", titulo: "O CANÁRIO DO TEATRO LYRIC", endereco: "Soho", data: "nov. 1895",
      relato: "No meio do ensaio, a estrela do Teatro Lyric, Miss Vivian Rose, desmaiou no camarim. Ao lado dela, o canário de estimação estava caído na gaiola. É a terceira vez em um mês que o teatro precisa fechar as portas.",
      objetivo: "Descobrir o que fez Miss Rose desmaiar e quem quer o teatro fechado.",
      locais: [
        { id: "camarim", nome: "Camarim do Teatro Lyric", x: 3150, y: 1900,
          texto: "Cheiro de gás. O registro do lampião foi aberto até o fim, e a junta do cano tem um corte limpo, feito com faca. O canário, o pobre alarme natural dos mineiros, morreu primeiro.\n\nEvidência 1: o vazamento de gás foi provocado.\nEvidência 2: o cano foi cortado de propósito." },
        { id: "bastidores", nome: "Beco dos bastidores", x: 3380, y: 1820,
          texto: "A substituta, Miss Daisy Finch, chora: “Eu queria o papel, mas nunca isso!” Ela passou o ensaio inteiro no palco, à vista de vinte pessoas. No beco, pegadas de botas de trabalho levam à porta dos fundos.\n\nEvidência 3: a substituta tem álibi.\nEvidência 4: um homem de botas de operário entrou pelos fundos." },
        { id: "gas", nome: "Companhia de gás", x: 3520, y: 1640,
          texto: "O livro de serviços mostra uma “inspeção de rotina” no Lyric na hora do ensaio. O nome do inspetor não consta na folha de pagamento, mas a ordem veio assinada por Mr. Silas Grout.\n\nEvidência 5: a falsa inspeção aconteceu na hora do desmaio.\nEvidência 6: Grout autorizou a ordem." },
        { id: "taverna", nome: "Taverna Coach and Horses", x: 2980, y: 1700,
          texto: "O taberneiro conta que Silas Grout, dono do teatro rival, anda dizendo que vai comprar o Lyric “por uma ninharia, quando ninguém mais tiver coragem de entrar lá”.\n\nEvidência 7: Grout quer o prédio do Lyric.\nEvidência 8: os fechamentos derrubam o preço do teatro." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "O que fez Miss Rose desmaiar?",
            opcoes: [
              { texto: "Gás de um cano cortado de propósito.", correta: true, resposta: "Exato. O canário morreu primeiro, como nas minas, e foi isso que salvou Miss Rose." },
              { texto: "Veneno no chá.", correta: false, resposta: "O chá estava intacto. E veneno não mata canários a dois metros de distância." },
              { texto: "Cansaço dos ensaios.", correta: false, resposta: "Cansaço não corta canos de gás, Watson." }
            ] },
          { pergunta: "Por que a substituta não é a culpada?",
            opcoes: [
              { texto: "Porque ela chorou.", correta: false, resposta: "Lágrimas não provam nada; já vi assassinos chorarem como viúvas." },
              { texto: "Porque estava no palco, à vista de vinte pessoas, durante todo o ensaio.", correta: true, resposta: "Sim. O motivo era dela; a oportunidade, não." },
              { texto: "Porque é amiga de Miss Rose.", correta: false, resposta: "Amizade nunca impediu ninguém de cobiçar um papel principal." }
            ] },
          { pergunta: "Quem está por trás dos desmaios?",
            opcoes: [
              { texto: "Silas Grout, o dono do teatro rival.", correta: true, resposta: "Elementar. Grout mandou um falso inspetor cortar o cano para afastar o público e comprar o Lyric barato." },
              { texto: "Daisy Finch, a substituta.", correta: false, resposta: "Daisy tinha o motivo, mas vinte testemunhas a viram no palco." },
              { texto: "O taberneiro.", correta: false, resposta: "O taberneiro só repetiu o que Grout dizia em voz alta. Bêbados e rivais falam demais." }
            ] }
        ],
        epilogo: "Miss Rose se recuperou e voltou ao palco na semana seguinte, com casa cheia. Grout foi preso, mas o dinheiro para comprar o Lyric não era dele: vinha de um banco da City que, curiosamente, não tem clientes."
      }
    }),
    c({
      id: "005", titulo: "O AFOGADO SECO", endereco: "Blackfriars", data: "nov. 1895",
      relato: "Ao amanhecer, os barqueiros tiraram do Tâmisa, junto à ponte de Blackfriars, o corpo de Mr. Ambrose Clay, sócio de uma companhia de navegação. A polícia diz que ele caiu da ponte, bêbado. Holmes não acredita.",
      objetivo: "Descobrir onde e como Ambrose Clay realmente morreu.",
      locais: [
        { id: "ponte", nome: "Ponte de Blackfriars", x: 5400, y: 2380,
          texto: "O parapeito tem quase a altura de um homem. Ninguém cai dali por acidente. No bolso do colete de Clay, o tabaco está seco, e o relógio, parado às 23h10, não tem uma gota de água por dentro.\n\nEvidência 1: Clay não caiu da ponte por acidente.\nEvidência 2: as roupas foram molhadas por fora; ele nunca afundou." },
        { id: "cais", nome: "Cais de Blackfriars", x: 5720, y: 2450,
          texto: "Um barqueiro viu, às 23h30, uma carroça parar no cais e dois homens “jogarem um saco grande” na água rasa. A carroça tinha o emblema de uma âncora dourada.\n\nEvidência 3: o corpo foi trazido de carroça e jogado no raso.\nEvidência 4: a carroça tinha uma âncora dourada." },
        { id: "navegacao", nome: "Companhia de Navegação Clay & Mordaunt", x: 5820, y: 2150,
          texto: "A âncora dourada é o emblema da companhia. O sócio, Mr. Rupert Mordaunt, diz que Clay saiu às dez da noite. No escritório, porém, há um copo lavado com cheiro amargo de amêndoas e livros de contas com páginas arrancadas.\n\nEvidência 5: Clay bebeu algo amargo no escritório.\nEvidência 6: alguém arrancou páginas das contas." },
        { id: "penhores", nome: "Casa de penhores", x: 5450, y: 2760,
          texto: "O penhorista recebeu ontem um anel de sinete com as iniciais A. C., trazido por um cocheiro “a mando do patrão, Mr. Mordaunt”. O cocheiro dirige a carroça da âncora.\n\nEvidência 7: o anel de Clay foi penhorado a mando de Mordaunt.\nEvidência 8: o cocheiro de Mordaunt dirige a carroça vista no cais." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "Clay morreu afogado no Tâmisa?",
            opcoes: [
              { texto: "Sim, caiu da ponte bêbado.", correta: false, resposta: "Um homem que afunda no Tâmisa não guarda tabaco seco no bolso, Watson." },
              { texto: "Não; morreu antes e foi molhado só por fora, para parecer afogamento.", correta: true, resposta: "Exato. O relógio seco por dentro e o tabaco intacto contam que ele nunca afundou." },
              { texto: "Sim, mas foi empurrado da ponte.", correta: false, resposta: "Se tivesse caído da ponte, estaria encharcado até a alma, e o relógio, cheio d'água." }
            ] },
          { pergunta: "Onde Clay realmente morreu?",
            opcoes: [
              { texto: "No escritório da companhia, depois de beber do copo amargo.", correta: true, resposta: "Sim. O cheiro de amêndoas amargas no copo lavado é a assinatura do veneno." },
              { texto: "Na casa de penhores.", correta: false, resposta: "O penhorista só recebeu o anel no dia seguinte." },
              { texto: "Na carroça.", correta: false, resposta: "A carroça só levou o corpo ao cais, às 23h30." }
            ] },
          { pergunta: "Quem matou Ambrose Clay?",
            opcoes: [
              { texto: "O barqueiro que encontrou o corpo.", correta: false, resposta: "O barqueiro foi quem nos contou da carroça. Assassinos raramente ajudam assim." },
              { texto: "O penhorista.", correta: false, resposta: "Ele só aceitou um anel. Mau negócio, mas não assassinato." },
              { texto: "Rupert Mordaunt, o sócio.", correta: true, resposta: "Elementar. Clay descobriu o desfalque nas contas. Mordaunt o envenenou, arrancou as páginas e mandou o cocheiro jogá-lo no rio." }
            ] }
        ],
        epilogo: "As páginas arrancadas foram achadas na lareira de Mordaunt, meio queimadas. Ainda dava para ler: pagamentos mensais ao mesmo banco sem clientes da City. Holmes prendeu os papéis ao lado da nota de Paddington."
      }
    }),
    c({
      id: "006", titulo: "O TRATADO DE WHITEHALL", endereco: "Whitehall", data: "nov. 1895",
      relato: "Do cofre do Ministério da Marinha, em Whitehall, sumiu a única cópia de um tratado naval secreto. O cofre não foi arrombado. Se o papel chegar a uma potência estrangeira, haverá guerra. Holmes tem até a meia-noite.",
      objetivo: "Recuperar o tratado antes que ele deixe Londres.",
      locais: [
        { id: "ministerio", nome: "Ministério da Marinha", x: 3250, y: 2250,
          texto: "O cofre foi aberto com a combinação certa. Só três pessoas a conhecem: o ministro, o secretário Percy Lowe e o sobrinho do ministro, Gerald, que às vezes copia documentos. Na escrivaninha, uma mancha de tinta violeta, rara.\n\nEvidência 1: quem abriu o cofre sabia a combinação.\nEvidência 2: alguém escreveu com tinta violeta na mesa." },
        { id: "clube", nome: "Clube Diógenes", x: 3000, y: 2140,
          texto: "Mycroft Holmes, irmão de Sherlock, recebe-os em silêncio, como manda o clube. Entrega um bilhete: “Gerald perdeu mil libras no carteado esta semana. Pagou tudo ontem, em dinheiro.”\n\nEvidência 3: Gerald tinha uma dívida enorme.\nEvidência 4: a dívida foi paga logo depois do roubo." },
        { id: "torre", nome: "Torre do Relógio", x: 2880, y: 2610,
          texto: "Um vendedor de jornais aos pés do Big Ben viu um rapaz elegante entregar um envelope a um homem de cachecol vermelho, às seis badaladas. O rapaz tinha os dedos manchados de violeta.\n\nEvidência 5: o envelope mudou de mãos às seis.\nEvidência 6: os dedos manchados de violeta ligam o rapaz ao ministério." },
        { id: "carruagens", nome: "Ponto de carruagens", x: 3360, y: 2490,
          texto: "Um cocheiro levou o homem de cachecol vermelho até a estação de Charing Cross: trem das 23h para Dover, com conexão para o continente. No banco da carruagem ficou um cartão com uma única letra: M.\n\nEvidência 7: o tratado vai sair pelo trem das 23h para Dover.\nEvidência 8: o comprador deixou um cartão com a letra M." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "Como o cofre foi aberto sem arrombamento?",
            opcoes: [
              { texto: "Com a combinação, por alguém de dentro do ministério.", correta: true, resposta: "Exato. O ladrão não precisou forçar nada; ele sabia o segredo." },
              { texto: "Com explosivos silenciosos.", correta: false, resposta: "Não existe explosivo silencioso, Watson, e o cofre está intacto." },
              { texto: "O cofre estava aberto por descuido.", correta: false, resposta: "O ministro jura que o trancou, e o secretário confirma." }
            ] },
          { pergunta: "Quem roubou o tratado?",
            opcoes: [
              { texto: "Percy Lowe, o secretário.", correta: false, resposta: "Lowe não joga cartas e escreve com tinta preta, como manda o regulamento." },
              { texto: "Gerald, o sobrinho do ministro.", correta: true, resposta: "Sim. Dívida paga em dinheiro, tinta violeta nos dedos e o envelope entregue aos pés do Big Ben." },
              { texto: "O próprio ministro.", correta: false, resposta: "O ministro foi quem nos chamou. Não teria motivo para se arruinar." }
            ] },
          { pergunta: "Onde interceptar o tratado?",
            opcoes: [
              { texto: "No clube de carteado de Gerald.", correta: false, resposta: "Gerald já entregou o envelope. Lá só restam as dívidas dele." },
              { texto: "No trem das 23h para Dover, em Charing Cross.", correta: true, resposta: "Elementar. O homem de cachecol vermelho embarcou com o tratado, e Lestrade estará na plataforma." },
              { texto: "No porto de Liverpool.", correta: false, resposta: "Ninguém sai para o continente por Liverpool, Watson." }
            ] }
        ],
        epilogo: "O tratado foi recuperado no vagão-leito, às 22h57. O homem de cachecol vermelho não disse uma palavra, mas no forro do casaco havia uma lista de pagamentos: Paddington, Museu Britânico, Teatro Lyric. Todos assinados com a mesma letra: M."
      }
    }),
    c({
      id: "007", titulo: "AS LUZES DE HIGHGATE", endereco: "Highgate", data: "nov. 1895",
      relato: "Há semanas, luzes dançam à noite entre os túmulos do cemitério de Highgate. Os herdeiros da mansão Ashby, vizinha ao cemitério, fugiram apavorados, e a casa está à venda. Os vizinhos falam do fantasma do velho Lorde Ashby.",
      objetivo: "Desmascarar o “fantasma” de Highgate e descobrir o que ele protege.",
      locais: [
        { id: "mansao", nome: "Mansão Ashby", x: 3150, y: 390,
          texto: "A governanta, Mrs. Pell, é a única que ficou. Jura que ouve correntes à noite, mas na cozinha há pão fresco para quatro pessoas, e ela mora sozinha. O porão tem uma porta nova, de ferro.\n\nEvidência 1: alguém mais come na mansão vazia.\nEvidência 2: o porão foi reforçado recentemente." },
        { id: "cemiterio", nome: "Cemitério de Highgate", x: 3500, y: 340,
          texto: "As “luzes” são lampiões de furta-fogo. Atrás do mausoléu dos Ashby, a grama está gasta numa trilha que some debaixo da laje. Embaixo, um túnel antigo segue na direção da mansão.\n\nEvidência 3: as luzes eram lampiões, não espíritos.\nEvidência 4: um túnel liga o mausoléu ao porão da mansão." },
        { id: "pub", nome: "Pub The Flask", x: 3300, y: 570,
          texto: "O dono do pub reconhece o filho da governanta, Jack Pell, sempre com as mãos sujas de terra e dinheiro novo no bolso. Jack paga as rodadas com libras recém-saídas da casa da moeda.\n\nEvidência 5: Jack Pell anda com dinheiro novo demais.\nEvidência 6: Jack trabalha cavando, mas não tem emprego." },
        { id: "advogado", nome: "Escritório do advogado", x: 2900, y: 520,
          texto: "O advogado dos Ashby revela uma oferta generosa pela mansão, feita por uma firma desconhecida, logo depois do primeiro “fantasma”. O endereço da firma é uma caixa postal na City.\n\nEvidência 7: alguém quer comprar a mansão assombrada.\nEvidência 8: a firma compradora é de fachada." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "O que são as luzes do cemitério?",
            opcoes: [
              { texto: "O espírito do velho Lorde Ashby.", correta: false, resposta: "Espíritos não deixam trilhas na grama nem compram óleo de lampião, Watson." },
              { texto: "Lampiões de quem usa o túnel debaixo do mausoléu.", correta: true, resposta: "Exato. O fantasma é só gente com lampiões, entrando e saindo pelo túnel." },
              { texto: "Gás do pântano.", correta: false, resposta: "Highgate fica numa colina. Não há pântano para soltar gás." }
            ] },
          { pergunta: "Para que serve o túnel?",
            opcoes: [
              { texto: "Para levar mercadoria escondida ao porão da mansão.", correta: true, resposta: "Sim. O porão reforçado é um depósito, e o fantasma afasta os curiosos." },
              { texto: "Era uma passagem antiga esquecida, sem uso.", correta: false, resposta: "A grama gasta e a porta de ferro nova dizem que o túnel é usado toda noite." },
              { texto: "Para os herdeiros visitarem o túmulo do avô.", correta: false, resposta: "Os herdeiros fugiram apavorados. Eles não sabiam do túnel." }
            ] },
          { pergunta: "Quem faz o papel de fantasma?",
            opcoes: [
              { texto: "Jack Pell, o filho da governanta, com ajuda da mãe.", correta: true, resposta: "Elementar. Jack cava e carrega, Mrs. Pell espalha o medo, e uma firma de fachada espera para comprar a casa barata." },
              { texto: "O advogado dos Ashby.", correta: false, resposta: "O advogado nos entregou a pista da firma de fachada. Não é a atitude de um cúmplice." },
              { texto: "O dono do pub.", correta: false, resposta: "Ele só vende cerveja a quem paga, mesmo com dinheiro novo demais." }
            ] }
        ],
        epilogo: "No porão havia caixas de moedas falsas, idênticas às libras novas que apareceram em Paddington, no Museu e no Lyric. A firma de fachada usava a mesma caixa postal do banco sem clientes da City. A teia começava a ter forma."
      }
    }),
    c({
      id: "008", titulo: "CHÁ DAS CINCO EM MAYFAIR", endereco: "Mayfair", data: "dez. 1895",
      relato: "Durante o chá na mansão de Lady Agatha Ashworth, em Mayfair, a anfitriã passou mal com a primeira xícara. Ela sobreviveu e acusa o sobrinho, Henry, que herda tudo. Henry jura inocência. Havia três convidados à mesa.",
      objetivo: "Descobrir quem envenenou o chá de Lady Ashworth.",
      locais: [
        { id: "salao", nome: "Salão de chá", x: 2400, y: 2090,
          texto: "As xícaras são de porcelana pintada. A de Lady Agatha tem uma rosa; a de Henry, uma violeta. Holmes nota que a xícara da rosa está na frente da cadeira de Henry: alguém trocou as xícaras de lugar antes de servir.\n\nEvidência 1: as xícaras foram trocadas de lugar.\nEvidência 2: a xícara envenenada estava, de início, no lugar de Henry." },
        { id: "cozinha", nome: "Cozinha", x: 2580, y: 2190,
          texto: "A cozinheira jura que serviu o mesmo bule a todos. O mordomo diz que Lady Agatha insistiu em arrumar a mesa sozinha naquele dia, “coisa que nunca faz”.\n\nEvidência 3: o veneno não estava no bule.\nEvidência 4: Lady Agatha arrumou as xícaras com as próprias mãos." },
        { id: "farmacia", nome: "Farmácia em Piccadilly", x: 2920, y: 2010,
          texto: "O farmacêutico registra a venda de uma pequena dose de arsênico “para os ratos” a uma criada da casa Ashworth. A criada diz que obedeceu a uma ordem escrita da patroa.\n\nEvidência 5: o arsênico foi comprado a mando de Lady Agatha.\nEvidência 6: a dose era pequena demais para matar." },
        { id: "joalheria", nome: "Joalheria Garrard", x: 2660, y: 1850,
          texto: "O joalheiro conta que Lady Agatha vendeu em segredo as joias da família para cobrir dívidas. Se Henry herdar agora, descobrirá que a herança não existe mais.\n\nEvidência 7: Lady Agatha está arruinada.\nEvidência 8: ela precisava tirar Henry do caminho antes que ele descobrisse." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "O veneno estava no bule?",
            opcoes: [
              { texto: "Sim, a cozinheira envenenou o bule.", correta: false, resposta: "Todos beberam do mesmo bule e só Lady Agatha passou mal." },
              { texto: "Não; estava numa única xícara, colocada de propósito.", correta: true, resposta: "Exato. O veneno estava na xícara da rosa, que começou no lugar de Henry." },
              { texto: "Estava no açúcar.", correta: false, resposta: "Henry e os convidados também adoçaram o chá." }
            ] },
          { pergunta: "Por que Lady Agatha tomou uma dose que não mata?",
            opcoes: [
              { texto: "Foi sorte.", correta: false, resposta: "Sorte é a explicação de quem não pensou o bastante, Watson." },
              { texto: "Ela se envenenou de leve, de propósito, para acusar Henry.", correta: true, resposta: "Sim. Ela mesma encomendou a dose fraca, arrumou as xícaras e fez a cena." },
              { texto: "O arsênico era falsificado.", correta: false, resposta: "O farmacêutico vende arsênico de verdade. A dose é que foi escolhida com cuidado." }
            ] },
          { pergunta: "Quem está por trás do envenenamento?",
            opcoes: [
              { texto: "Henry, o sobrinho herdeiro.", correta: false, resposta: "Henry é justamente a vítima da armação. Ele nem sabia que a herança tinha acabado." },
              { texto: "A criada.", correta: false, resposta: "A criada só cumpriu uma ordem escrita, e guardou o bilhete." },
              { texto: "A própria Lady Agatha.", correta: true, resposta: "Elementar. Arruinada, ela queria Henry preso antes que ele descobrisse que as joias já tinham sido vendidas." }
            ] }
        ],
        epilogo: "Lady Agatha confessou. As dívidas que a arruinaram eram com um agiota da City que cobrava juros com ameaças. Quando Holmes perguntou o nome dele, ela empalideceu: “Não existe nome, Sr. Holmes. Só a letra M nos recibos.”"
      }
    }),
    c({
      id: "009", titulo: "O SUSSURRO DE SÃO PAULO", endereco: "City", data: "dez. 1895",
      relato: "Há uma semana, o jornal The Times publica anúncios estranhos, só com números. Um banqueiro da City trouxe um deles a Baker Street, intrigado: os números batem com a planta do cofre do seu banco.",
      objetivo: "Decifrar os anúncios e impedir o assalto ao banco.",
      locais: [
        { id: "banco", nome: "Banco Thornbury", x: 5950, y: 1720,
          texto: "Holmes bate a bengala no chão do cofre e escuta: em um ponto, o som é oco. O gerente conta que a loja vizinha, uma casa de penhores, está fechada “para reforma” há um mês.\n\nEvidência 1: há um vazio sob o piso do cofre.\nEvidência 2: a casa de penhores vizinha está fechada há um mês." },
        { id: "jornal", nome: "Redação do The Times", x: 5300, y: 1760,
          texto: "Os anúncios foram pagos em dinheiro por um mensageiro. Lidos como horas e minutos, os números marcam um encontro: sábado, à meia-noite, quando o banco fica vazio até segunda.\n\nEvidência 3: os números são uma data e uma hora.\nEvidência 4: o golpe será sábado à meia-noite." },
        { id: "penhores", nome: "Casa de penhores vizinha", x: 6130, y: 1600,
          texto: "Pela janela suja, Holmes vê montes de terra e argila ensacados até o teto. O penhorista, Mr. Jabez Wick, tem os joelhos da calça gastos e sujos, como quem passa o dia cavando.\n\nEvidência 5: há um túnel sendo cavado na loja vizinha.\nEvidência 6: Wick cava de joelhos, dia após dia." },
        { id: "catedral", nome: "Catedral de São Paulo", x: 5500, y: 1480,
          texto: "Na Galeria dos Sussurros, um cochicho de um lado da cúpula chega nítido do outro. Holmes escuta dois homens: “No sábado, o Coronel quer o ouro na carroça antes da uma.”\n\nEvidência 7: a quadrilha obedece a um “Coronel”.\nEvidência 8: o ouro vai sair de carroça antes da uma da manhã." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "O que significam os números dos anúncios?",
            opcoes: [
              { texto: "Preços de ações.", correta: false, resposta: "Ações não se negociam à meia-noite de sábado, Watson." },
              { texto: "A data e a hora do assalto: sábado, à meia-noite.", correta: true, resposta: "Exato. É o único momento em que o banco fica vazio por mais de um dia." },
              { texto: "O endereço do esconderijo.", correta: false, resposta: "Os números são poucos demais para um endereço de Londres." }
            ] },
          { pergunta: "Como os ladrões vão entrar no cofre?",
            opcoes: [
              { texto: "Por um túnel cavado a partir da casa de penhores vizinha.", correta: true, resposta: "Sim. Terra ensacada até o teto, joelhos gastos e um chão oco no cofre." },
              { texto: "Pela porta da frente, com a chave do gerente.", correta: false, resposta: "O gerente nunca larga a chave, e foi ele quem nos procurou." },
              { texto: "Pelo telhado.", correta: false, resposta: "O cofre fica no subsolo. Do telhado só se chega às pombas." }
            ] },
          { pergunta: "Onde Holmes deve esperar os ladrões?",
            opcoes: [
              { texto: "Na redação do The Times.", correta: false, resposta: "O jornal só imprimiu o recado. Os ladrões não voltarão lá." },
              { texto: "Dentro do cofre, no escuro, sábado à meia-noite.", correta: true, resposta: "Elementar. Lestrade e seus homens esperarão em silêncio até a primeira picareta atravessar o piso." },
              { texto: "Na Catedral de São Paulo.", correta: false, resposta: "A Galeria nos deu a pista, mas o ouro está no banco." }
            ] }
        ],
        epilogo: "Wick e três homens foram presos ao sair do túnel, cobertos de argila. O “Coronel” não apareceu. Wick só repetia, rindo: “Vocês pegaram as mãos, Sr. Holmes. A cabeça está longe daqui.”"
      }
    }),
    c({
      id: "010", titulo: "O FALSÁRIO DE LAMBETH", endereco: "Lambeth", data: "dez. 1895",
      relato: "Um Turner recém-vendido por uma fortuna a um lorde é falso, e muito bem pintado. O pintor que o autenticou, Elias Thorne, desapareceu do ateliê em Lambeth. Ele deixou só um pincel molhado e uma xícara de chá ainda morna.",
      objetivo: "Encontrar Elias Thorne e descobrir quem fabrica os quadros falsos.",
      locais: [
        { id: "atelie", nome: "Ateliê de Elias Thorne", x: 4250, y: 3100,
          texto: "Nas telas inacabadas, céus e mares no estilo de Turner. Thorne pintava as cópias, mas no canto de cada uma escondia sua assinatura minúscula, um “E.T.” quase invisível. Ele queria ser descoberto.\n\nEvidência 1: Thorne pintava as falsificações.\nEvidência 2: ele assinava em segredo, como um pedido de socorro." },
        { id: "olaria", nome: "Olaria de Lambeth", x: 4560, y: 3220,
          texto: "Nos fornos da olaria, onde ninguém entra à noite, há molduras antigas sendo “envelhecidas” na fumaça. Um aprendiz conta que um senhor de óculos é trazido aqui toda noite, vigiado por dois homens.\n\nEvidência 3: as molduras são envelhecidas nos fornos.\nEvidência 4: Thorne é obrigado a trabalhar sob vigia." },
        { id: "galeria", nome: "Galeria Vance & Filhos", x: 4200, y: 2850,
          texto: "O marchand, Mr. Lucian Vance, vendeu o Turner falso e outros seis “quadros raros” este ano, sempre pagos ao mesmo banco da City. No livro de vendas, a comissão vai para uma conta chamada “Teia”.\n\nEvidência 5: Vance vende as falsificações.\nEvidência 6: o dinheiro vai para a conta “Teia”, no mesmo banco." },
        { id: "cais", nome: "Cais de Lambeth", x: 4660, y: 2900,
          texto: "Um barqueiro leva caixotes compridos da olaria à galeria toda madrugada, “quadros embrulhados”. Esta noite, em vez de caixotes, levará um passageiro: um velho de óculos, para fora de Londres.\n\nEvidência 7: os quadros saem da olaria de barco.\nEvidência 8: Thorne será levado embora esta noite." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "Thorne é o vilão ou a vítima?",
            opcoes: [
              { texto: "O vilão: ele falsifica e foge com o dinheiro.", correta: false, resposta: "Um vilão não assina suas falsificações para ser descoberto, Watson." },
              { texto: "A vítima: é obrigado a pintar e deixa pistas escondidas.", correta: true, resposta: "Exato. O “E.T.” minúsculo em cada tela era um pedido de socorro." },
              { texto: "Ele não tem relação com os quadros.", correta: false, resposta: "As telas inacabadas no ateliê são a prova de que ele pintava as cópias." }
            ] },
          { pergunta: "Onde está Thorne agora?",
            opcoes: [
              { texto: "Na olaria, até ser levado de barco esta noite pelo cais.", correta: true, resposta: "Sim. Precisamos chegar ao cais antes da maré da madrugada." },
              { texto: "Em casa, escondido.", correta: false, resposta: "O chá ainda morno mostra que ele foi levado às pressas, não que fugiu." },
              { texto: "Na galeria de Vance.", correta: false, resposta: "Vance é esperto demais para guardar o pintor onde recebe clientes." }
            ] },
          { pergunta: "Quem comanda as falsificações?",
            opcoes: [
              { texto: "O aprendiz da olaria.", correta: false, resposta: "O aprendiz foi nossa testemunha. Ele mal sabe ler." },
              { texto: "Lucian Vance, o marchand, a serviço da “Teia”.", correta: true, resposta: "Elementar. Vance vende, a olaria envelhece, Thorne pinta à força, e o dinheiro vai para a conta “Teia”." },
              { texto: "O lorde que comprou o Turner.", correta: false, resposta: "O lorde foi enganado. Ninguém paga uma fortuna para se arruinar de propósito." }
            ] }
        ],
        epilogo: "Thorne foi libertado no cais, à luz dos lampiões. Abraçou Holmes e lhe entregou um caderninho: “Copiei tudo o que eles disseram. Toda a ‘Teia’ responde a um contador em Clerkenwell.” Pela primeira vez, a teia tinha um endereço."
      }
    }),
    c({
      id: "011", titulo: "A TEIA", endereco: "Clerkenwell", data: "dez. 1895",
      relato: "Diamantes, um amuleto, um teatro, um tratado, moedas falsas e quadros. Holmes prende na parede as notas de dez casos: todo o dinheiro corre para a mesma conta. O caderno de Thorne aponta um contador em Clerkenwell.",
      objetivo: "Desmontar a Teia antes que o contador destrua as provas.",
      locais: [
        { id: "relojoeiros", nome: "Oficinas dos relojoeiros", x: 5450, y: 1090,
          texto: "Clerkenwell é a rua dos relojoeiros. Um velho artesão reconhece o livro-caixa de Arthur Bell, do primeiro caso: “Edmund Price trazia o dinheiro da chantagem para cá, para um tal Mr. Crane.”\n\nEvidência 1: o dinheiro da chantagem de Price ia para Crane.\nEvidência 2: o primeiro caso também fazia parte da Teia." },
        { id: "crane", nome: "Escritório de Josiah Crane", x: 5660, y: 900,
          texto: "Uma placa discreta diz “J. Crane, Contabilidade”. Pela fresta da porta, Holmes vê uma lareira acesa e um homem magro queimando papéis um a um. Sobre a mesa, um livro de capa preta com a palavra TEIA.\n\nEvidência 3: Crane é o contador da Teia.\nEvidência 4: ele está destruindo as provas agora." },
        { id: "pub", nome: "Pub The Three Kings", x: 5250, y: 860,
          texto: "No fundo do pub, um homem de cachecol vermelho, o mesmo de Whitehall, conversa com um sujeito alto de bigode militar. Holmes reconhece o porte: “O Coronel, Watson. Coronel Sebastian Moran.”\n\nEvidência 5: o Coronel do assalto da City é Sebastian Moran.\nEvidência 6: Moran e o homem do tratado trabalham juntos." },
        { id: "deposito", nome: "Depósito em Islington", x: 5080, y: 690,
          texto: "Num depósito alugado em nome de uma firma de fachada estão caixas de moedas falsas, molduras envelhecidas e o cachecol vermelho de reserva. Na parede, um mapa de Londres com alfinetes em todos os locais dos casos anteriores.\n\nEvidência 7: o depósito guarda o material de todos os crimes.\nEvidência 8: a Teia planejou cada caso em um único mapa." }
      ],
      solucao: {
        perguntas: [
          { pergunta: "O que liga todos os casos do capítulo?",
            opcoes: [
              { texto: "Nada; foram coincidências.", correta: false, resposta: "Uma coincidência é possível; dez são uma assinatura, Watson." },
              { texto: "O dinheiro de todos os crimes corria para a mesma conta, a Teia.", correta: true, resposta: "Exato. Banco sem clientes, caixa postal, conta “Teia”: o dinheiro sempre deu no mesmo lugar." },
              { texto: "Todos os culpados frequentavam o mesmo pub.", correta: false, resposta: "O pub é só um ponto de encontro. O que os une é o dinheiro." }
            ] },
          { pergunta: "O que Holmes precisa fazer primeiro?",
            opcoes: [
              { texto: "Prender o Coronel Moran no pub.", correta: false, resposta: "Sem as provas do livro TEIA, Moran sairia da cadeia em uma hora." },
              { texto: "Entrar no escritório de Crane antes que o livro TEIA queime.", correta: true, resposta: "Sim. Sem o livro, não há como provar nada contra ninguém." },
              { texto: "Esvaziar o depósito de Islington.", correta: false, resposta: "O depósito não vai fugir. O livro na lareira, sim." }
            ] },
          { pergunta: "Quem é Josiah Crane na Teia?",
            opcoes: [
              { texto: "O chefe de tudo.", correta: false, resposta: "Crane é inteligente, mas obedece. Os recibos são assinados com outra letra." },
              { texto: "O contador que guarda o dinheiro e os segredos da organização.", correta: true, resposta: "Elementar. Crane guardava os livros; Moran comandava os homens. Mas acima dos dois há alguém que assina M." },
              { texto: "Um inocente usado pela quadrilha.", correta: false, resposta: "Inocentes não queimam livros de contas às pressas." }
            ] }
        ],
        epilogo: "Holmes arrancou o livro TEIA da lareira com as páginas ainda fumegando. Crane foi preso; Moran fugiu pelos telhados. Naquela noite, em Baker Street, chegou um bilhete sem remetente: “Sr. Holmes, o senhor me custou dez operações neste outono. Não haverá uma décima primeira. — M.”\n\nFIM DO CAPÍTULO 1."
      }
    })
  ];
  // ainda no formato antigo: aparecem na gaveta, mas ficam lacrados até serem reescritos como investigação
  novos.forEach(n => n.reescrever = true);
  window.CASOS = window.CASOS.filter(x => !x.bloqueado).concat(novos);
})();
