/* Casos do jogo.
   Coordenadas x, y = pixels do mapa-mestre v6 (6620 x 3726), origem no canto superior esquerdo.
   O caso 001 é PROVISÓRIO, só para testar as telas; os 11 casos oficiais entram aqui.
   Casos com "bloqueado: true" aparecem na gaveta, mas ainda não abrem. */
window.CASOS = [
  {
    id: "001",
    titulo: "A CARTA SEM REMETENTE",
    endereco: "221B Baker Street",
    ano: 1895,
    data: "3 mar. 1895",
    relato: "Chegou a Baker Street uma carta sem remetente, lacrada com cera negra: \"Ela não voltou para casa.\" Holmes ergueu o papel contra a luz. \"O carimbo é de Lambeth, Watson, mas o papel é caro demais para Lambeth.\"",
    objetivo: "Descobrir quem enviou a carta e quem desapareceu.",
    situacao: "ABERTO",
    locais: [
      {
        id: "baker", nome: "221B Baker Street", x: 1700, y: 1110,
        texto: "Holmes examina a carta com a lupa. A cera negra traz a marca de um anel com a letra \"M\". O papel tem marca d'água de uma papelaria fina de Mayfair.\n\nPista: papel caro, cera com a letra M."
      },
      {
        id: "mayfair", nome: "Papelaria Hartley, Mayfair", x: 2480, y: 2110,
        texto: "O Sr. Hartley reconhece o papel. \"Vendo esse papel a uma só freguesa, a Sra. Margaret Vane. Mas há duas semanas quem veio buscá-lo foi a criada dela, uma moça de Lambeth.\"\n\nPista: a criada da Sra. Vane mora em Lambeth."
      },
      {
        id: "lambeth", nome: "Correio de Lambeth", x: 4430, y: 3175,
        texto: "O funcionário lembra da carta. \"Uma moça nervosa, de touca azul. Pediu para não pôr o nome. Disse que a patroa sumiu e que ninguém na casa quis chamar a polícia.\"\n\nPista: a criada enviou a carta; a desaparecida é a patroa."
      }
    ],
    solucao: {
      pergunta: "Quem enviou a carta e quem desapareceu?",
      opcoes: [
        { texto: "A Sra. Vane enviou a carta sobre a criada.", correta: false,
          resposta: "Não. O funcionário do correio descreveu uma moça de touca azul, não uma senhora de Mayfair." },
        { texto: "A criada enviou a carta: a Sra. Vane desapareceu.", correta: true,
          resposta: "Exato. A criada usou o papel da patroa e postou longe de casa, em Lambeth, para não ser reconhecida. A Sra. Margaret Vane é quem não voltou para casa." },
        { texto: "O Sr. Hartley enviou a carta para atrair clientes.", correta: false,
          resposta: "Não. Hartley só reconheceu o papel; nada liga ele ao correio de Lambeth." }
      ]
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
