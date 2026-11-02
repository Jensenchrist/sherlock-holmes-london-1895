/* Capítulo 1 — A Teia (casos 002 a 011), no formato de investigação.
   Cada caso é independente, mas o dinheiro de vários crimes corre para a mesma organização,
   revelada no caso 011. Coordenadas = pixels do mapa-mestre v6 (6620 x 3726).
   Fotos: assets/locais/<caso>_<local>.jpg (provisórias, recortadas do mapa). */
(() => {
  const c = (o) => Object.assign({ ano: 1895, situacao: "ABERTO" }, o);
  const L = (caso, id, nome, bairro, x, y, descricao, desafio, pista) =>
    ({ id, nome, bairro, x, y, foto: `assets/locais/${caso}_${id}.jpg`, descricao, desafio, pista });

  const novos = [
    c({
      id: "002", titulo: "O ÚLTIMO TREM DE PADDINGTON", endereco: "Paddington", data: "out. 1895",
      dificuldade: 1, recompensa: 35, prazoHoras: 24,
      relato: "O mensageiro de um joalheiro embarcou em Bristol com um estojo de diamantes, trancado num vagão de primeira classe. O trem chegou a Paddington sem parar no caminho. O vagão estava vazio, e a janela, trancada.",
      objetivo: "Descobrir como os diamantes sumiram, quem os levou e onde está o mensageiro.",
      perguntas: [
        { id: "como", titulo: "Como os diamantes saíram do vagão?", aceitas: ["leite", "latao"], erradas: [] },
        { id: "quem", titulo: "Quem roubou os diamantes?", aceitas: ["hobbs"], erradas: ["joalheiro", "bilheteiro", "porteiro"] },
        { id: "onde", titulo: "Onde está o mensageiro?", aceitas: ["hotel", "great western", "quarto 12"], erradas: [] }
      ],
      locais: [
        L("002", "estacao", "Estação de Paddington", "Paddington", 700, 1700,
          "Vapor, apitos e carregadores. O condutor Hobbs jura que viu o mensageiro embarcar em Bristol. Holmes se ajoelha no vagão de primeira classe: o tapete está seco, embora chovesse forte em Bristol a manhã toda.",
          { tipo: "HORÁRIOS", enunciado: "O trem saiu de Bristol às 6h40 e o condutor diz que viu o mensageiro embarcar “meia hora antes da partida”. A que horas foi isso?",
            respostas: ["610", "6h10", "0610", "seisedez"], dica: "Tire trinta minutos de 6h40." },
          { pergunta: "quem", texto: "O tapete do vagão estava seco: ninguém molhado da chuva de Bristol entrou ali. A única prova do embarque do mensageiro é a palavra do condutor Hobbs." }),
        L("002", "leiteria", "Leiteria Ashdown", "Kensington", 620, 2330,
          "Os latões de leite que vieram no mesmo trem chegam à leiteria. O leiteiro coça a cabeça: um deles veio leve demais, com a tampa lacrada com cera nova. Dentro, palha e um forro de veludo vazio.",
          { tipo: "CONTA", enunciado: "Cada latão cheio pesa 40 libras. Chegaram 12 latões, e a balança marcou 455 libras no total. Quantas libras faltam?",
            respostas: ["25"], dica: "Doze latões cheios pesariam 480 libras." },
          { pergunta: "como", texto: "O estojo viajou escondido num latão de leite, forrado de veludo, no vagão de bagagem. Alguém o retirou em Paddington antes da entrega." }),
        L("002", "hotel", "Hotel Great Western", "Paddington", 1160, 1380,
          "O porteiro se lembra de um homem de uniforme da ferrovia que alugou um quarto na véspera e não voltou. “Não sei o número, senhor, mas era o número que, multiplicado por ele mesmo, dá 144.”",
          { tipo: "CADEADO", enunciado: "Qual é o número do quarto?", respostas: ["12", "doze"], dica: "Que número vezes ele mesmo dá 144?" },
          { pergunta: "onde", texto: "No quarto 12 está o verdadeiro mensageiro, amarrado e furioso. Foi dopado em Bristol e nunca embarcou. O quarto foi alugado em nome de “W. Hobbs”." }),
        L("002", "hatton", "Hatton Garden", "Clerkenwell", 5450, 1090,
          "A rua dos negociantes de pedras preciosas. Um velho lapidário conta que um homem de mão enfaixada e sotaque de Bristol tentou vender pedras brutas sem nota, e assinou o recibo de consulta.",
          { tipo: "CHARADA", enunciado: "“Sou pedra mas não sou rocha, corto o vidro sem me ferir, e a joalheria me guarda no veludo.” O que sou?",
            respostas: ["diamante", "diamantes"], dica: "É o que estava no estojo do mensageiro." },
          { pergunta: "quem", texto: "O vendedor de mão enfaixada assinou “William Hobbs”: é irmão do condutor. Os dois armaram o roubo juntos." })
      ],
      epilogo: "Os diamantes foram encontrados com William Hobbs em Bristol. Mas ele já tinha recebido uma quantia por eles, em libras novas, de um comprador que se apresentou apenas como “o agente do Professor”. Holmes guardou a nota em silêncio."
    }),

    c({
      id: "003", titulo: "A MÚMIA QUE RESPIRAVA", endereco: "Bloomsbury", data: "out. 1895",
      dificuldade: 1, recompensa: 40, prazoHoras: 24,
      relato: "O vigia noturno do Museu Britânico jura que viu a múmia do sacerdote Nesmin respirar. Na manhã seguinte, o amuleto de ouro do sarcófago era uma cópia de latão. As portas passaram a noite trancadas.",
      objetivo: "Descobrir como o amuleto foi trocado dentro de um museu fechado, por quem e por quê.",
      perguntas: [
        { id: "como", titulo: "Onde o ladrão passou a noite?", aceitas: ["sarcofago"], erradas: [] },
        { id: "quem", titulo: "Quem trocou o amuleto?", aceitas: ["fenwick", "cyril"], erradas: ["moss", "klein", "vigia"] },
        { id: "porque", titulo: "Por que fez isso?", aceitas: ["divida", "jogo", "dinheiro", "pagar"], erradas: [] }
      ],
      locais: [
        L("003", "museu", "Museu Britânico", "Bloomsbury", 3830, 1720,
          "A Sala Egípcia está silenciosa. Holmes passa a lupa pelo sarcófago de Nesmin: há fiapos de lã cinza presos do lado de dentro da tampa, e a poeira do chão foi varrida num semicírculo perfeito.",
          { tipo: "CHARADA", enunciado: "“Durmo há três mil anos enfaixado e nunca acordo; esta noite, alguém dormiu no meu lugar.” Onde o ladrão se escondeu?",
            respostas: ["sarcofago", "nosarcofago"], dica: "É a caixa de pedra onde a múmia descansa." },
          { pergunta: "como", texto: "Fiapos de lã cinza por dentro da tampa: o ladrão passou a noite escondido no sarcófago. O “sopro” da múmia era ele respirando sob o linho." }),
        L("003", "pensao", "Pensão do vigia Moss", "Lambeth", 4560, 3220,
          "O vigia Moss admite, envergonhado, que bebe um gole a cada ronda. “Mas vi o peito da múmia subir e descer, juro pela minha mãe!” Ele não mente: só não sabia o que estava vendo.",
          { tipo: "HORÁRIOS", enunciado: "Moss bebe um gole a cada ronda de 40 minutos, a primeira às 22h. Viu a múmia respirar no quinto gole. Que horas eram?",
            respostas: ["040", "0040", "0h40", "00h40", "meianoiteequarenta"], dica: "O primeiro gole foi às 22h; faltam mais quatro rondas." },
          { pergunta: "quem", texto: "À 0h40 Moss viu a “múmia” respirar. Às 5h, a porta do corredor dos curadores estava destrancada, e só curadores têm essa chave." }),
        L("003", "clube", "Clube de carteado", "Soho", 3150, 1900,
          "Fumaça, cartas marcadas e homens mal-encarados. O dono do clube folheia um caderninho de dívidas. “Fenwick? O curador? Esse deve a casa inteira.”",
          { tipo: "CONTA", enunciado: "Fenwick devia 300 libras e já pagou três parcelas de 60. Quanto ainda deve?",
            respostas: ["120"], dica: "Três vezes 60 são 180." },
          { pergunta: "porque", texto: "Cyril Fenwick tem dívidas de jogo pesadas no Soho, e os cobradores do clube andam ameaçando o curador." }),
        L("003", "ourives", "Ourivesaria Klein", "Clerkenwell", 5660, 900,
          "O ourives Klein fez, semanas atrás, uma cópia em latão de um amuleto egípcio “para uma peça de teatro”. Pagaram em libras novas. Klein anotou o nome do cliente de trás para frente, mania antiga: KCIWNEF.",
          { tipo: "CIFRA", enunciado: "Leia o nome KCIWNEF de trás para frente. Quem encomendou a cópia?",
            respostas: ["fenwick"], dica: "Comece pela última letra: F..." },
          { pergunta: "quem", texto: "A cópia em latão do amuleto foi encomendada por Fenwick, o curador assistente, antes do roubo." })
      ],
      epilogo: "Fenwick devolveu o amuleto e confessou que tinha dívidas de jogo com um clube de Soho. Quem cobrava as dívidas, disse ele tremendo, “trabalha para alguém que ninguém nunca vê”."
    }),

    c({
      id: "004", titulo: "O CANÁRIO DO TEATRO LYRIC", endereco: "Soho", data: "nov. 1895",
      dificuldade: 2, recompensa: 45, prazoHoras: 24,
      relato: "No meio do ensaio, a estrela do Teatro Lyric, Miss Vivian Rose, desmaiou no camarim. Ao lado dela, o canário de estimação estava caído na gaiola. É a terceira vez em um mês que o teatro precisa fechar as portas.",
      objetivo: "Descobrir o que fez Miss Rose desmaiar, quem está por trás e por quê.",
      perguntas: [
        { id: "oque", titulo: "O que fez Miss Rose desmaiar?", aceitas: ["gas"], erradas: [] },
        { id: "quem", titulo: "Quem está por trás dos desmaios?", aceitas: ["grout", "silas"], erradas: ["daisy", "finch", "rose"] },
        { id: "porque", titulo: "Por que fez isso?", aceitas: ["comprar", "barato", "preco", "predio", "teatro"], erradas: [] }
      ],
      locais: [
        L("004", "camarim", "Camarim do Teatro Lyric", "Soho", 3150, 1900,
          "Cheiro forte no ar. O registro do lampião foi aberto até o fim, e a junta do cano tem um corte limpo, feito com faca. O canário, pobre coitado, morreu primeiro.",
          { tipo: "CHARADA", enunciado: "“Nas minas eu canto até o perigo chegar; quando me calo, é hora de correr.” Que bicho sou?",
            respostas: ["canario"], dica: "Estava na gaiola ao lado de Miss Rose." },
          { pergunta: "oque", texto: "Vazamento de gás provocado: o cano do lampião foi cortado com faca. O canário morreu primeiro, como nas minas, e isso salvou Miss Rose." }),
        L("004", "pensao", "Pensão de Daisy Finch", "Camden Town", 3900, 700,
          "A substituta, Miss Daisy Finch, chora: “Eu queria o papel, mas nunca isso!” Ela conta que passou o ensaio inteiro no palco, das 14h às 17h, e que viu um homem de botas de operário no beco dos fundos.",
          { tipo: "LÓGICA", enunciado: "Vinte pessoas viram Daisy no palco das 14h às 17h. Miss Rose desmaiou às 15h30. Daisy poderia estar no camarim nessa hora? (sim ou não)",
            respostas: ["nao"], dica: "15h30 fica entre 14h e 17h." },
          { pergunta: "quem", texto: "Daisy Finch tem álibi: vinte testemunhas. Um homem de botas de operário entrou pelos fundos do teatro na hora do desmaio." }),
        L("004", "gas", "Companhia de Gás", "Bankside", 6050, 3050,
          "O livro de serviços registra uma “inspeção de rotina” no Lyric na hora do ensaio. O inspetor não existe na folha de pagamento. A ordem veio assinada num código de escritório: TJMBT HSPVU.",
          { tipo: "CIFRA", enunciado: "Cada letra foi trocada pela seguinte do alfabeto. Volte uma letra em cada: TJMBT HSPVU. Quem assinou a ordem?",
            respostas: ["silasgrout", "grout"], dica: "T vira S, J vira I..." },
          { pergunta: "quem", texto: "A falsa inspeção de gás, na hora do desmaio, foi autorizada por Silas Grout." }),
        L("004", "imperial", "Teatro Imperial", "Islington", 5080, 690,
          "O teatro rival, de Silas Grout, anda vazio. No escritório, Holmes vê uma carta com uma proposta pelo Lyric: 900 libras, “preço justo para um teatro assombrado”.",
          { tipo: "CONTA", enunciado: "Antes dos desmaios, o Lyric valia três vezes os 900 libras oferecidos. Quanto valia?",
            respostas: ["2700"], dica: "Multiplique 900 por 3." },
          { pergunta: "porque", texto: "Grout quer comprar o prédio do Lyric pelo preço de banana: cada fechamento derruba o valor do teatro." })
      ],
      epilogo: "Miss Rose se recuperou e voltou ao palco na semana seguinte, com casa cheia. Grout foi preso, mas o dinheiro para comprar o Lyric não era dele: vinha de um banco da City que, curiosamente, não tem clientes."
    }),

    c({
      id: "005", titulo: "O AFOGADO SECO", endereco: "Blackfriars", data: "nov. 1895",
      dificuldade: 2, recompensa: 50, prazoHoras: 24,
      relato: "Ao amanhecer, os barqueiros tiraram do Tâmisa, junto à ponte de Blackfriars, o corpo de Mr. Ambrose Clay, sócio de uma companhia de navegação. A polícia diz que ele caiu da ponte, bêbado. Holmes não acredita.",
      objetivo: "Descobrir como Ambrose Clay morreu, quem o matou e por quê.",
      perguntas: [
        { id: "como", titulo: "Como Clay morreu?", aceitas: ["veneno", "envenen", "cianeto", "amendoa"], erradas: [] },
        { id: "quem", titulo: "Quem matou Ambrose Clay?", aceitas: ["mordaunt", "rupert"], erradas: ["barqueiro", "penhorista"] },
        { id: "porque", titulo: "Por quê?", aceitas: ["desfalque", "contas", "roubo", "dinheiro", "descobriu"], erradas: [] }
      ],
      locais: [
        L("005", "ponte", "Ponte de Blackfriars", "Blackfriars", 5400, 2380,
          "O parapeito tem quase a altura de um homem. No colete de Clay, o tabaco está seco, e o relógio de bolso, parado às 23h10, não tem uma gota de água por dentro. Um barqueiro viu uma carroça no cais às 23h30.",
          { tipo: "HORÁRIOS", enunciado: "O relógio parou às 23h10; a carroça chegou ao cais às 23h30. Quantos minutos se passaram?",
            respostas: ["20", "vinte"], dica: "De 23h10 a 23h30." },
          { pergunta: "como", texto: "Tabaco e relógio secos por dentro: Clay nunca afundou. Morreu às 23h10 e o corpo chegou de carroça ao cais 20 minutos depois, com o emblema de uma âncora dourada." }),
        L("005", "necroterio", "Necrotério de St. Thomas", "Lambeth", 4250, 3100,
          "O legista levanta o lençol. “Não há água nos pulmões, Sr. Holmes. E sinta: um cheiro leve, amargo, na boca dele.”",
          { tipo: "CHARADA", enunciado: "“Cheiro a amêndoas amargas mas não sou doce; uma gota basta.” Que veneno sou?",
            respostas: ["cianeto", "veneno"], dica: "Começa com C e é o veneno favorito dos romances policiais." },
          { pergunta: "como", texto: "Sem água nos pulmões e com cheiro de amêndoas amargas: Clay foi envenenado com cianeto antes de chegar ao rio." }),
        L("005", "companhia", "Companhia Clay & Mordaunt", "City", 5900, 1950,
          "Uma âncora dourada na fachada. O sócio, Mr. Rupert Mordaunt, diz que Clay saiu às dez da noite. No escritório, há um copo lavado às pressas e livros de contas com páginas arrancadas. O que sobrou mostra receitas de 5.000 libras, despesas de 3.200 e saldo declarado de 800.",
          { tipo: "CONTA", enunciado: "Receitas de 5.000, despesas de 3.200, saldo declarado de 800. Quantas libras sumiram?",
            respostas: ["1000", "mil"], dica: "5.000 menos 3.200 deveria sobrar quanto?" },
          { pergunta: "porque", texto: "Mil libras sumiram dos livros da companhia. Clay tinha descoberto o desfalque, e as páginas que provavam isso foram arrancadas." }),
        L("005", "penhores", "Casa de penhores", "Camden Town", 4100, 900,
          "O penhorista recebeu ontem um anel de sinete trazido por um cocheiro “a mando do patrão, Mr. Mordaunt”. O cocheiro dirige a carroça da âncora dourada. O anel tem duas iniciais gravadas.",
          { tipo: "CADEADO", enunciado: "As iniciais do anel são as do morto. Quais são? (duas letras)",
            respostas: ["ac"], dica: "Ambrose Clay." },
          { pergunta: "quem", texto: "O anel de Ambrose Clay foi penhorado a mando de Rupert Mordaunt, pelo mesmo cocheiro que levou o corpo ao cais." })
      ],
      epilogo: "As páginas arrancadas foram achadas na lareira de Mordaunt, meio queimadas. Ainda dava para ler: pagamentos mensais ao mesmo banco sem clientes da City. Holmes prendeu os papéis ao lado da nota de Paddington."
    }),

    c({
      id: "006", titulo: "O TRATADO DE WHITEHALL", endereco: "Whitehall", data: "nov. 1895",
      dificuldade: 3, recompensa: 60, prazoHoras: 16,
      relato: "Do cofre do Ministério da Marinha, em Whitehall, sumiu a única cópia de um tratado naval secreto. O cofre não foi arrombado. Se o papel chegar a uma potência estrangeira, haverá guerra. O prazo é apertado.",
      objetivo: "Descobrir quem roubou o tratado, por quê, e onde interceptá-lo.",
      perguntas: [
        { id: "quem", titulo: "Quem roubou o tratado?", aceitas: ["gerald"], erradas: ["lowe", "percy", "ministro", "mycroft"] },
        { id: "porque", titulo: "Por quê?", aceitas: ["divida", "jogo", "carteado", "dinheiro", "cartas"], erradas: [] },
        { id: "onde", titulo: "Onde interceptar o tratado?", aceitas: ["charing", "dover", "trem"], erradas: [] }
      ],
      locais: [
        L("006", "ministerio", "Ministério da Marinha", "Whitehall", 3250, 2250,
          "O cofre foi aberto com a combinação certa. Só três pessoas a conhecem: o ministro, o secretário Percy Lowe e Gerald, sobrinho do ministro. Na escrivaninha, uma mancha de tinta violeta, rara. O ministro murmura: “A combinação é o ano da maior vitória da Marinha.”",
          { tipo: "CADEADO", enunciado: "A combinação é o ano da Batalha de Trafalgar. Qual é?",
            respostas: ["1805"], dica: "Nelson venceu os franceses no começo do século XIX." },
          { pergunta: "quem", texto: "O cofre foi aberto com a combinação, por alguém de dentro. Uma mancha de tinta violeta, rara, ficou na escrivaninha." }),
        L("006", "diogenes", "Clube Diógenes", "Mayfair", 2580, 2190,
          "Ninguém fala no Clube Diógenes. Mycroft Holmes, irmão de Sherlock, entrega um bilhete sem dizer uma palavra: “Gerald perdeu mil libras no carteado esta semana. Pagou mil libras ontem, em dinheiro.”",
          { tipo: "CONTA", enunciado: "Gerald perdeu mil libras e pagou mil libras. Quanto ainda deve?",
            respostas: ["0", "zero", "nada"], dica: "Mil menos mil." },
          { pergunta: "porque", texto: "Gerald tinha uma dívida de jogo de mil libras e a pagou inteira, em dinheiro, logo depois do roubo." }),
        L("006", "bigben", "Torre do Relógio", "Westminster", 2880, 2610,
          "Um jornaleiro aos pés do Big Ben viu um rapaz elegante entregar um envelope a um homem de cachecol vermelho, “nas seis badaladas da tarde”. O rapaz tinha os dedos manchados de violeta.",
          { tipo: "HORÁRIOS", enunciado: "Seis badaladas da tarde: que horas são no relógio de 24 horas?",
            respostas: ["18", "18h", "1800", "18h00"], dica: "Seis da tarde mais doze." },
          { pergunta: "quem", texto: "Às 18h, um rapaz de dedos manchados de violeta, a tinta do ministério, entregou o envelope a um homem de cachecol vermelho." }),
        L("006", "charing", "Estação de Charing Cross", "Strand", 3500, 2100,
          "Um cocheiro levou o homem de cachecol vermelho até a estação. “Ele tinha uma hora e quarenta de folga para o trem das 23h para Dover, senhor.” No banco da carruagem, um cartão com uma única letra: M.",
          { tipo: "HORÁRIOS", enunciado: "Se faltava uma hora e quarenta para o trem das 23h, a que horas o cocheiro o deixou na estação?",
            respostas: ["2120", "21h20"], dica: "23h menos 1h40." },
          { pergunta: "onde", texto: "O tratado vai sair de Londres no trem das 23h para Dover, em Charing Cross. O comprador deixou um cartão com a letra M." })
      ],
      epilogo: "O tratado foi recuperado no vagão-leito, às 22h57. O homem de cachecol vermelho não disse uma palavra, mas no forro do casaco havia uma lista de pagamentos: Paddington, Museu Britânico, Teatro Lyric. Todos assinados com a mesma letra: M."
    }),

    c({
      id: "007", titulo: "AS LUZES DE HIGHGATE", endereco: "Highgate", data: "nov. 1895",
      dificuldade: 3, recompensa: 65, prazoHoras: 30,
      relato: "Há semanas, luzes dançam à noite entre os túmulos do cemitério de Highgate. Os herdeiros da mansão Ashby, vizinha ao cemitério, fugiram apavorados, e a casa está à venda. Os vizinhos falam do fantasma do velho Lorde Ashby.",
      objetivo: "Desmascarar o “fantasma” de Highgate e descobrir o que ele protege.",
      perguntas: [
        { id: "quem", titulo: "Quem faz o papel de fantasma?", aceitas: ["jack", "pell"], erradas: ["advogado", "lorde", "herdeiro"] },
        { id: "oque", titulo: "O que está escondido no porão?", aceitas: ["moeda", "falsa", "falsific", "dinheiro falso"], erradas: [] },
        { id: "porque", titulo: "Por que assustar os herdeiros?", aceitas: ["comprar", "barato", "esconder", "deposito", "tunel", "afastar"], erradas: [] }
      ],
      locais: [
        L("007", "mansao", "Mansão Ashby", "Highgate", 3150, 390,
          "A governanta, Mrs. Pell, é a única que ficou. Jura que ouve correntes à noite. Mas na cozinha há pão fresco cortado para quatro pessoas, e ela mora sozinha. O porão tem uma porta nova, de ferro.",
          { tipo: "CONTA", enunciado: "Pão para quatro, e Mrs. Pell mora sozinha. Quantas pessoas a mais comem na mansão?",
            respostas: ["3", "tres"], dica: "Quatro menos uma." },
          { pergunta: "quem", texto: "Três pessoas comem escondidas na mansão “vazia”, e o porão ganhou uma porta de ferro nova. Mrs. Pell sabe mais do que diz." }),
        L("007", "cemiterio", "Cemitério de Highgate", "Highgate", 3500, 340,
          "Atrás do mausoléu dos Ashby, a grama está gasta numa trilha que some debaixo da laje. Na lápide, cinco letras foram raspadas e brilham sob a lanterna: L, E, N, U, T.",
          { tipo: "CIFRA", enunciado: "Embaralhe as letras L, E, N, U, T e forme uma palavra. O que há debaixo do mausoléu?",
            respostas: ["tunel"], dica: "É uma passagem debaixo da terra." },
          { pergunta: "porque", texto: "As “luzes” são lampiões de quem usa um túnel do mausoléu até o porão da mansão. O fantasma serve para afastar curiosos." }),
        L("007", "banco", "Banco da Inglaterra", "City", 5700, 1800,
          "O pagador do pub de Highgate trouxe as moedas que Jack Pell, filho da governanta, usa para pagar rodadas. O tesoureiro as pesa: “A moeda verdadeira pesa 8 gramas. Estas pesam 7.”",
          { tipo: "CONTA", enunciado: "Um saco deveria ter 10 moedas verdadeiras, mas pesa só 70 gramas. Se cada falsa pesa 7 gramas, quantas moedas falsas há no saco?",
            respostas: ["10", "dez", "todas"], dica: "10 moedas de 7 gramas pesam quanto?" },
          { pergunta: "oque", texto: "As moedas de Jack Pell são falsas, idênticas às libras novas que apareceram em Paddington, no Museu e no Lyric." }),
        L("007", "advogado", "Escritório do advogado", "Holborn", 3640, 1560,
          "O advogado dos Ashby mostra uma oferta generosa pela mansão, feita por uma firma desconhecida logo depois do primeiro “fantasma”. O endereço é uma caixa postal cujo número, diz a carta, é “o ano corrente menos mil”.",
          { tipo: "CADEADO", enunciado: "Estamos em 1895. Qual é o número da caixa postal?",
            respostas: ["895"], dica: "1895 menos 1000." },
          { pergunta: "porque", texto: "Uma firma de fachada, da caixa postal 895, quer comprar a casa assombrada barata, logo depois que o fantasma afugentou os herdeiros." })
      ],
      epilogo: "No porão havia caixas de moedas falsas, idênticas às libras novas que apareceram em Paddington, no Museu e no Lyric. A firma de fachada usava a mesma caixa postal do banco sem clientes da City. A teia começava a ter forma."
    }),

    c({
      id: "008", titulo: "CHÁ DAS CINCO EM MAYFAIR", endereco: "Mayfair", data: "dez. 1895",
      dificuldade: 3, recompensa: 70, prazoHoras: 30,
      relato: "Durante o chá na mansão de Lady Agatha Ashworth, em Mayfair, a anfitriã passou mal com a primeira xícara. Ela sobreviveu e acusa o sobrinho, Henry, que herda tudo. Henry jura inocência.",
      objetivo: "Descobrir onde estava o veneno, quem o colocou e por quê.",
      perguntas: [
        { id: "onde", titulo: "Onde estava o veneno?", aceitas: ["xicara"], erradas: ["bule", "acucar", "leite"] },
        { id: "quem", titulo: "Quem envenenou o chá?", aceitas: ["agatha", "propria", "ela mesma"], erradas: ["criada", "cozinheira", "mordomo"] },
        { id: "porque", titulo: "Por quê?", aceitas: ["divida", "arruinad", "joias", "heranca", "dinheiro", "falida"], erradas: [] }
      ],
      locais: [
        L("008", "mansao", "Mansão Ashworth", "Mayfair", 2400, 2090,
          "Lady Agatha sempre usa a xícara pintada com uma rosa. Hoje, a da rosa estava no lugar de Henry, e ela bebeu da xícara da violeta, que estava no lugar dela. Todos beberam do mesmo bule. Só ela passou mal.",
          { tipo: "LÓGICA", enunciado: "Todos beberam do mesmo bule; só Lady Agatha passou mal, e ela bebeu da xícara que estava no lugar dela. Em qual xícara estava o veneno: rosa ou violeta?",
            respostas: ["violeta"], dica: "Ela não bebeu da xícara de sempre." },
          { pergunta: "onde", texto: "O veneno não estava no bule, e sim numa única xícara, a da violeta. O mordomo diz que Lady Agatha arrumou a mesa sozinha, “coisa que nunca faz”." }),
        L("008", "farmacia", "Farmácia em Piccadilly", "Piccadilly", 2920, 2010,
          "O farmacêutico registra a venda de uma pequena dose de arsênico “para os ratos” a uma criada da casa Ashworth. A criada trazia uma ordem escrita, assinada com três iniciais: L. A. A.",
          { tipo: "CIFRA", enunciado: "L. A. A. são as iniciais de Lady ... Ashworth. Qual é o primeiro nome?",
            respostas: ["agatha"], dica: "É a dona da casa." },
          { pergunta: "quem", texto: "O arsênico foi comprado a mando de Lady Agatha, numa dose pequena demais para matar." }),
        L("008", "agiota", "Escritório do agiota", "City", 5300, 1760,
          "Um homem de óculos escuros folheia contratos. Lady Agatha pegou 2.000 libras emprestadas, com juros de 10% ao mês, e está há três meses sem pagar nada. Os recibos trazem só uma letra: M.",
          { tipo: "CONTA", enunciado: "2.000 libras, juros simples de 10% ao mês (200 por mês), três meses sem pagar. Quanto ela deve agora?",
            respostas: ["2600"], dica: "2.000 mais três vezes 200." },
          { pergunta: "porque", texto: "Lady Agatha está arruinada: deve 2.600 libras a um agiota da City e já vendeu as joias da família. Se Henry herdar, vai descobrir que não há herança." }),
        L("008", "henry", "Pensão de Henry", "Chelsea", 1000, 3100,
          "Henry, nervoso, mostra a passagem do ônibus a cavalo. “Cheguei às 17h10, senhor. O chá foi servido às 17h, eu cheguei dez minutos depois. A mesa já estava posta.”",
          { tipo: "HORÁRIOS", enunciado: "O chá foi servido às 17h e Henry chegou dez minutos depois. A que horas ele chegou?",
            respostas: ["1710", "17h10"], dica: "17h mais dez minutos." },
          { pergunta: "quem", texto: "Henry chegou às 17h10, quando a mesa já estava posta e o chá servido. Ele não tocou nas xícaras antes." })
      ],
      epilogo: "Lady Agatha confessou. As dívidas que a arruinaram eram com um agiota da City que cobrava juros com ameaças. Quando Holmes perguntou o nome dele, ela empalideceu: “Não existe nome, Sr. Holmes. Só a letra M nos recibos.”"
    }),

    c({
      id: "009", titulo: "O SUSSURRO DE SÃO PAULO", endereco: "City", data: "dez. 1895",
      dificuldade: 4, recompensa: 80, prazoHoras: 30,
      relato: "Há uma semana, o jornal The Times publica anúncios estranhos, só com números. Um banqueiro da City trouxe um deles a Baker Street, intrigado: os números batem com a planta do cofre do seu banco.",
      objetivo: "Decifrar os anúncios, descobrir como os ladrões vão entrar e quem os comanda.",
      perguntas: [
        { id: "quando", titulo: "Quando será o assalto?", aceitas: ["sabado"], erradas: [] },
        { id: "como", titulo: "Por onde os ladrões vão entrar?", aceitas: ["tunel", "penhores", "subsolo", "chao", "piso"], erradas: [] },
        { id: "quem", titulo: "Quem comanda a quadrilha?", aceitas: ["coronel"], erradas: ["wick", "gerente", "banqueiro"] }
      ],
      locais: [
        L("009", "times", "Redação do The Times", "Blackfriars", 5300, 1900,
          "Os anúncios foram pagos em dinheiro por um mensageiro. O último diz apenas: 19 1 2 1 4 15 — 0 0.",
          { tipo: "CIFRA", enunciado: "Cada número é uma letra do alfabeto (A=1, B=2...). Que palavra é 19 1 2 1 4 15?",
            respostas: ["sabado"], dica: "19 é a letra S." },
          { pergunta: "quando", texto: "O anúncio diz SÁBADO — 00: sábado à meia-noite, quando o banco fica vazio até segunda." }),
        L("009", "banco", "Banco Thornbury", "City", 6060, 1830,
          "Holmes bate a bengala em seis lajotas do cofre, uma por uma. Quatro soam cheias. O gerente comenta que a casa de penhores vizinha está fechada “para reforma” há um mês.",
          { tipo: "OBSERVAÇÃO", enunciado: "Das seis lajotas, quatro soam cheias. Quantas soam ocas?",
            respostas: ["2", "duas", "dois"], dica: "Seis menos quatro." },
          { pergunta: "como", texto: "Há um vazio sob o piso do cofre, do lado da casa de penhores vizinha, fechada há um mês." }),
        L("009", "ferragens", "Loja de ferragens", "Paddington", 1000, 1550,
          "O ferreiro lembra de um penhorista, Mr. Jabez Wick, que comprou ferramentas de cavar e mandou entregar “na loja ao lado do Banco Thornbury”. Três picaretas a 4 xelins e cinco pás a 3 xelins.",
          { tipo: "CONTA", enunciado: "Três picaretas a 4 xelins e cinco pás a 3 xelins. Quantos xelins ao todo?",
            respostas: ["27"], dica: "12 mais 15." },
          { pergunta: "como", texto: "Jabez Wick, o penhorista vizinho do banco, comprou picaretas e pás: alguém está cavando um túnel até o cofre." }),
        L("009", "catedral", "Catedral de São Paulo", "City", 5500, 1480,
          "Na galeria da cúpula, um cochicho de um lado chega nítido do outro. Holmes encosta o ouvido na parede e escuta dois homens: “No sábado, o Coronel quer o ouro na carroça antes da uma.”",
          { tipo: "CHARADA", enunciado: "“Falo baixinho de um lado e sou ouvido do outro.” A Galeria dos... o quê?",
            respostas: ["sussurros", "sussurro"], dica: "É o nome deste caso." },
          { pergunta: "quem", texto: "A quadrilha obedece a um “Coronel”, que quer o ouro numa carroça antes da uma da manhã de domingo." })
      ],
      epilogo: "Wick e três homens foram presos ao sair do túnel, cobertos de argila. O “Coronel” não apareceu. Wick só repetia, rindo: “Vocês pegaram as mãos, Sr. Holmes. A cabeça está longe daqui.”"
    }),

    c({
      id: "010", titulo: "O FALSÁRIO DE LAMBETH", endereco: "Lambeth", data: "dez. 1895",
      dificuldade: 4, recompensa: 90, prazoHoras: 24,
      relato: "Um Turner recém-vendido por uma fortuna a um lorde é falso, e muito bem pintado. O pintor que o autenticou, Elias Thorne, desapareceu do ateliê em Lambeth. Deixou só um pincel molhado e uma xícara de chá ainda morna.",
      objetivo: "Descobrir o papel de Thorne, onde ele está e quem comanda as falsificações.",
      perguntas: [
        { id: "papel", titulo: "Thorne é vilão ou vítima?", aceitas: ["vitima", "obrigado", "forcado", "sequestr", "prisioneiro"], erradas: [] },
        { id: "onde", titulo: "Onde está Thorne?", aceitas: ["olaria", "cais", "forno"], erradas: [] },
        { id: "quem", titulo: "Quem comanda as falsificações?", aceitas: ["vance", "lucian"], erradas: ["lorde", "aprendiz", "thorne"] }
      ],
      locais: [
        L("010", "atelie", "Ateliê de Elias Thorne", "Lambeth", 4250, 3100,
          "Telas inacabadas no estilo de Turner. No canto de cada uma, quase invisível, Thorne escondeu uma assinatura minúscula de duas letras. Um pintor que falsifica não assina. Um pintor que quer ser encontrado, sim.",
          { tipo: "OBSERVAÇÃO", enunciado: "Quais são as duas letras da assinatura escondida de Elias Thorne?",
            respostas: ["et"], dica: "As iniciais do nome dele." },
          { pergunta: "papel", texto: "Thorne pintava as cópias, mas escondia “E.T.” em cada tela, como um pedido de socorro. Ele queria ser descoberto." }),
        L("010", "lorde", "Mansão do lorde", "Kensington", 760, 2150,
          "O lorde enganado, vermelho de raiva, mostra a nota: pagou 4.000 libras pelo “Turner”. Um perito diz que a tela, como cópia, vale 40.",
          { tipo: "CONTA", enunciado: "Pagou 4.000 libras por uma tela que vale 40. Quantas vezes mais caro ele pagou?",
            respostas: ["100", "cem"], dica: "4.000 dividido por 40." },
          { pergunta: "quem", texto: "O lorde comprou o falso Turner da Galeria Vance & Filhos, pagando cem vezes o valor da tela." }),
        L("010", "galeria", "Galeria Vance & Filhos", "Mayfair", 2660, 1850,
          "O marchand, Mr. Lucian Vance, vendeu sete “quadros raros” este ano. No livro de vendas, a comissão de cada um vai para uma conta com nome em código: UFJB.",
          { tipo: "CIFRA", enunciado: "Volte cada letra uma posição no alfabeto: U F J B. Qual é o nome da conta?",
            respostas: ["teia"], dica: "U vira T." },
          { pergunta: "quem", texto: "Lucian Vance vende as falsificações, e o dinheiro de cada venda vai para a conta TEIA, no mesmo banco sem clientes." }),
        L("010", "olaria", "Olaria de Lambeth", "Lambeth", 4560, 3220,
          "Nos fornos, molduras antigas são “envelhecidas” na fumaça. Um aprendiz conta que um senhor de óculos é trazido aqui toda noite, vigiado, e que esta noite vai embora de barco “com a próxima maré alta”. A última maré alta foi às 15h20, e elas vêm a cada 12h25.",
          { tipo: "HORÁRIOS", enunciado: "Maré alta às 15h20; a próxima vem 12h25 depois. A que horas sai o barco?",
            respostas: ["345", "3h45", "0345"], dica: "15h20 mais 12h dá 3h20 da madrugada; some mais 25 minutos." },
          { pergunta: "onde", texto: "Thorne está preso na olaria e será levado de barco pelo cais às 3h45 da madrugada." })
      ],
      epilogo: "Thorne foi libertado no cais, à luz dos lampiões. Abraçou Holmes e lhe entregou um caderninho: “Copiei tudo o que eles disseram. Toda a ‘Teia’ responde a um contador em Clerkenwell.” Pela primeira vez, a teia tinha um endereço."
    }),

    c({
      id: "011", titulo: "A TEIA", endereco: "Clerkenwell", data: "dez. 1895",
      dificuldade: 5, recompensa: 120, prazoHoras: 24,
      relato: "Diamantes, um amuleto, um teatro, um tratado, moedas falsas e quadros. Holmes prende na parede as notas de dez casos: todo o dinheiro corre para a mesma conta. O caderno de Thorne aponta um contador em Clerkenwell.",
      objetivo: "Provar o que liga os casos, desmascarar o contador e descobrir quem comanda os homens da Teia.",
      perguntas: [
        { id: "liga", titulo: "O que liga todos os casos do outono?", aceitas: ["teia", "conta", "mesmo dinheiro", "mesma"], erradas: ["coincid"] },
        { id: "contador", titulo: "Quem é o contador da Teia?", aceitas: ["crane", "josiah"], erradas: [] },
        { id: "chefe", titulo: "Quem comanda os homens da Teia?", aceitas: ["moran", "coronel"], erradas: ["wick", "vance"] }
      ],
      locais: [
        L("011", "relojoeiros", "Rua dos relojoeiros", "Clerkenwell", 5450, 1090,
          "Um velho relojoeiro guarda o cofre de Arthur Bell, do primeiro caso. “Arthur deixou dito que só abriria para o senhor. A combinação é a hora em que o relógio da oficina parou.”",
          { tipo: "CADEADO", enunciado: "A que horas o relógio da Oficina Bell foi adiantado, no caso 001? (só números)",
            respostas: ["905", "0905", "9h05"], dica: "Lembre do ponteiro grande no I." },
          { pergunta: "liga", texto: "No cofre, o livro-caixa de Arthur Bell: o dinheiro da chantagem de Edmund Price ia para um certo “Mr. Crane”. Até o primeiro caso fazia parte da Teia." }),
        L("011", "crane", "Escritório J. Crane", "Islington", 5080, 690,
          "Uma placa discreta: “J. Crane, Contabilidade”. Um homem magro queima papéis na lareira. Sobre a mesa, um livro de capa preta: TEIA. Holmes lê a primeira página antes que vire cinza: diamantes 500, amuleto 300, teatro 900, tratado 2.000.",
          { tipo: "CONTA", enunciado: "Some: 500 + 300 + 900 + 2.000. Quanto a Teia lucrou só com esses quatro crimes?",
            respostas: ["3700"], dica: "Some primeiro 500 e 300." },
          { pergunta: "contador", texto: "Josiah Crane é o contador da Teia: guarda o dinheiro e os segredos de todos os crimes, e tentou queimar o livro TEIA." }),
        L("011", "clube", "Clube Anglo-Indiano", "Mayfair", 2580, 2190,
          "Cabeças de tigre nas paredes. O porteiro diz que um sócio alto, de bigode militar, esteve aqui com um homem de cachecol vermelho. Sob o maior troféu, a plaqueta está gasta: “Tigre, 1882 — Cel. S. M_R_N”.",
          { tipo: "OBSERVAÇÃO", enunciado: "Complete o sobrenome gasto na plaqueta: M_R_N.",
            respostas: ["moran"], dica: "Faltam duas letras iguais: O." },
          { pergunta: "chefe", texto: "O “Coronel” do assalto da City é o Coronel Sebastian Moran, caçador de tigres e atirador sem igual. Ele e o homem do tratado trabalham juntos." }),
        L("011", "armazem", "Armazém do cais", "Blackfriars", 5720, 2450,
          "Num armazém alugado por uma firma de fachada, caixas de moedas falsas, molduras envelhecidas e um cachecol vermelho. Na parede, um mapa de Londres com um alfinete em cada crime do outono, contando este.",
          { tipo: "CONTA", enunciado: "Um alfinete para cada caso deste outono, do 001 até este. Quantos alfinetes há no mapa?",
            respostas: ["11", "onze"], dica: "Do caso 001 ao 011." },
          { pergunta: "liga", texto: "O armazém guarda o material de todos os crimes, e o mapa da parede prova que a Teia planejou cada um dos onze casos." })
      ],
      epilogo: "Holmes arrancou o livro TEIA da lareira com as páginas ainda fumegando. Crane foi preso; Moran fugiu pelos telhados. Naquela noite, em Baker Street, chegou um bilhete sem remetente: “Sr. Holmes, o senhor me custou dez operações neste outono. Não haverá uma décima primeira. — M.”\n\nFIM DO CAPÍTULO 1."
    })
  ];
  window.CASOS = window.CASOS.filter(x => !x.bloqueado).concat(novos);
})();
