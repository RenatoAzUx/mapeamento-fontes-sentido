
import { Question, Dimension } from './types';

export const DIMENSIONS_MAP: Dimension[] = [
  {
    code: 'D1',
    name: 'Auto-Transcendência',
    sources: [
      { code: 'S01', name: 'Engajamento Social' },
      { code: 'S02', name: 'Cuidado com os Outros' },
      { code: 'S03', name: 'Generatividade / Legado' },
      { code: 'S04', name: 'Justiça Social' },
      { code: 'S05', name: 'Responsabilidade Social' },
      { code: 'S06', name: 'Religiosidade Tradicional' },
      { code: 'S07', name: 'Espiritualidade (não institucional)' },
      { code: 'S08', name: 'Cuidado com a Natureza / Ecologia' }
    ]
  },
  {
    code: 'D2',
    name: 'Autoatualização',
    sources: [
      { code: 'S09', name: 'Desenvolvimento Pessoal' },
      { code: 'S10', name: 'Autenticidade' },
      { code: 'S11', name: 'Criatividade' },
      { code: 'S12', name: 'Conhecimento e Aprendizado' },
      { code: 'S13', name: 'Desafio e Superação' },
      { code: 'S14', name: 'Realização Profissional' },
      { code: 'S15', name: 'Autonomia' }
    ]
  },
  {
    code: 'D3',
    name: 'Ordem',
    sources: [
      { code: 'S16', name: 'Tradição' },
      { code: 'S17', name: 'Moralidade Pessoal' },
      { code: 'S18', name: 'Razão e Lógica' },
      { code: 'S19', name: 'Praticidade' },
      { code: 'S20', name: 'Autoconhecimento' }
    ]
  },
  {
    code: 'D4',
    name: 'Bem-estar e Prazer',
    sources: [
      { code: 'S21', name: 'Saúde Física' },
      { code: 'S22', name: 'Vitalidade e Energia' },
      { code: 'S23', name: 'Prazer e Experiências Agradáveis' },
      { code: 'S24', name: 'Relacionamentos Íntimos' },
      { code: 'S25', name: 'Segurança e Estabilidade' },
      { code: 'S26', name: 'Beleza e Estética' },
      { code: 'S27', name: 'Conforto e Qualidade de Vida' }
    ]
  }
];

// Mapeamento para a Curva Emocional (Ato 1, 2 e 3)
export const SOURCE_ACTS: Record<string, number> = {
  // ATO 1: Segurança e Curiosidade (1-45)
  'S12': 1, 'S11': 1, 'S08': 1, 'S24': 1, 'S23': 1, 'S09': 1, 'S01': 1, 'S02': 1, 'S26': 1,
  // ATO 2: Profundidade e Confronto (46-100)
  'S18': 2, 'S14': 2, 'S17': 2, 'S06': 2, 'S07': 2, 'S03': 2, 'S10': 2, 'S04': 2, 'S13': 2, 'S20': 2, 'S16': 2,
  // ATO 3: Direção e Ação (101-135)
  'S05': 3, 'S15': 3, 'S19': 3, 'S21': 3, 'S22': 3, 'S25': 3, 'S27': 3
};

const D1_QUESTIONS_TEXT: Record<string, string[]> = {
  'S01': [
    "Sinto que contribuo ativamente para melhorar a sociedade.",
    "Participo de causas que considero importantes para o coletivo.",
    "Acredito que meu papel social vai além dos meus interesses pessoais.",
    "Me sinto motivado(a) a agir quando vejo injustiças sociais.",
    "Tenho orgulho do impacto social que gero, mesmo que seja pequeno."
  ],
  'S02': [
    "Cuidar de outras pessoas me dá profundo sentido de vida.",
    "Sinto realização ao apoiar alguém em momentos difíceis.",
    "Percebo que sou alguém disponível emocionalmente para os outros.",
    "Meu sentido de vida cresce quando alivio o sofrimento alheio.",
    "Ofereço cuidado sem esperar retorno imediato."
  ],
  'S03': [
    "Sinto desejo de deixar algo que ultrapasse minha própria existência.",
    "Penso sobre o impacto que terei nas próximas gerações.",
    "Busco construir algo que sobreviva ao tempo.",
    "Ensinar ou transmitir conhecimento é importante para mim.",
    "Quero ser lembrado(a) por algo significativo."
  ],
  'S04': [
    "Acredito que lutar por justiça dá sentido à minha vida.",
    "Sinto indignação ativa diante de desigualdades.",
    "Procuro agir de forma ética mesmo quando ninguém está olhando.",
    "Valorizo ambientes que promovem equidade.",
    "Minha vida tem mais sentido quando estou alinhado(a) com valores de justiça."
  ],
  'S05': [
    "Sinto que tenho responsabilidade pelo mundo em que vivo.",
    "Minhas decisões levam em conta o impacto coletivo.",
    "Evito atitudes que prejudiquem o bem comum.",
    "Me sinto parte ativa da sociedade, não apenas espectador(a).",
    "Busco agir de maneira socialmente consciente."
  ],
  'S06': [
    "Minha fé religiosa orienta minhas decisões importantes.",
    "Participo de práticas religiosas com regularidade.",
    "Sinto conexão com uma tradição espiritual organizada.",
    "Minha religião oferece respostas existenciais relevantes para mim.",
    "A vivência religiosa fortalece meu sentido de vida."
  ],
  'S07': [
    "Sinto conexão com algo maior, mesmo sem religião formal.",
    "Experiências de transcendência são importantes para mim.",
    "Acredito que há um propósito mais amplo na existência.",
    "Momentos de contemplação me trazem sentido profundo.",
    "Sinto que minha vida faz parte de algo maior."
  ],
  'S08': [
    "Me sinto conectado(a) à natureza.",
    "Cuidar do meio ambiente é parte do meu sentido de vida.",
    "Experiências na natureza me trazem clareza existencial.",
    "Evito atitudes que prejudiquem o equilíbrio ambiental.",
    "Sinto reverência diante da vida natural."
  ]
};

const D2_QUESTIONS_TEXT: Record<string, string[]> = {
  'S09': [
    "Busco constantemente evoluir como pessoa.",
    "Invisto tempo no meu crescimento interior.",
    "Aprender coisas novas me traz vitalidade.",
    "Sinto que estou me tornando uma versão melhor de mim.",
    "Minha vida tem sentido quando percebo progresso pessoal."
  ],
  'S10': [
    "Sinto que vivo de acordo com quem realmente sou.",
    "Consigo expressar minhas opiniões sem medo excessivo.",
    "Minhas escolhas refletem meus valores internos.",
    "Evito viver apenas para agradar os outros.",
    "Ser verdadeiro(a) comigo mesmo(a) é prioridade."
  ],
  'S11': [
    "Criar algo novo me traz sensação de realização.",
    "Busco expressar ideias de forma original.",
    "Sinto prazer em resolver problemas de forma criativa.",
    "Produzir algo autoral me dá sentido.",
    "Minha vida é mais significativa quando estou criando."
  ],
  'S12': [
    "Buscar conhecimento amplia meu sentido de vida.",
    "Tenho curiosidade sobre o mundo e sobre mim.",
    "Estudar temas profundos me energiza.",
    "Gosto de refletir sobre questões existenciais.",
    "Aprender me faz sentir vivo(a)."
  ],
  'S13': [
    "Enfrentar desafios fortalece meu sentido de vida.",
    "Gosto de superar limites pessoais.",
    "Momentos difíceis me impulsionam a crescer.",
    "Sinto realização ao vencer obstáculos.",
    "Minha vida ganha significado quando avanço apesar do medo."
  ],
  'S14': [
    "Meu trabalho é uma fonte importante de sentido.",
    "Sinto orgulho da minha trajetória profissional.",
    "Minha carreira reflete meus talentos.",
    "Busco excelência no que faço.",
    "Contribuir profissionalmente me faz sentir útil."
  ],
  'S15': [
    "Sinto que tenho controle sobre minhas decisões.",
    "Evito depender excessivamente da aprovação alheia.",
    "Tenho liberdade para escolher meu próprio caminho.",
    "Prefiro assumir responsabilidade pelas minhas escolhas.",
    "Minha vida tem mais sentido quando ajo por decision própria."
  ]
};

const D3_QUESTIONS_TEXT: Record<string, string[]> = {
  'S16': [
    "Valorizo tradições que conectam passado, presente e futuro.",
    "Sinto sentido ao preservar costumes importantes para mim.",
    "Me inspiro em ensinamentos transmitidos por gerações anteriores.",
    "Respeito símbolos e rituais que representam continuidade.",
    "Minha vida ganha estabilidade quando me conecto às minhas raízes."
  ],
  'S17': [
    "Procuro agir de acordo com princípios éticos sólidos.",
    "Sinto desconforto quando ajo contra meus valores.",
    "Manter integridade é essencial para meu sentido de vida.",
    "Tomo decisões baseadas no que considero correto, não apenas conveniente",
    "Agir moralmente é a base da minha paz interior."
  ],
  'S18': [
    "Sinto que a razão me ajuda a compreender o mundo.",
    "Busco explicações lógicas para os acontecimentos.",
    "A clareza de pensamento traz ordem à minha vida.",
    "Valorizo o uso da mente para resolver problemas complexos.",
    "Minha vida faz mais sentido quando compreendo as causas das coisas."
  ],
  'S19': [
    "Ser prático(a) me ajuda a realizar o que considero importante.",
    "Sinto satisfação ao ver resultados concretos das minhas ações.",
    "Focar no que funciona traz estabilidade ao meu cotidiano.",
    "Organizar minha rotina de forma eficiente me dá tranquilidade.",
    "A praticidade é uma ferramenta essencial para meu sentido de vida."
  ],
  'S20': [
    "Compreender minhas próprias motivações é fundamental para mim.",
    "Dedico tempo a refletir sobre quem eu sou.",
    "Sinto que o autoconhecimento ilumina meu propósito.",
    "Reconhecer minhas forças e fraquezas me traz clareza.",
    "Minha vida ganha profundidade quando mergulho em mim mesmo(a)."
  ]
};

const D4_QUESTIONS_TEXT: Record<string, string[]> = {
  'S21': [
    "Cuidar do meu corpo é parte importante do meu sentido de vida.",
    "Sinto que minha saúde influencia diretamente minha motivação.",
    "Busco hábitos que sustentem meu bem-estar físico.",
    "Quando estou fisicamente bem, tudo parece mais significativo.",
    "Vejo a saúde como base para viver com propósito."
  ],
  'S22': [
    "Sinto energia suficiente para viver o que considero importante.",
    "Minha vida tem mais sentido quando me sinto vibrante.",
    "Percebo entusiasmo nas atividades do dia a dia.",
    "Acordo com disposição para agir.",
    "Sinto que minha energia sustenta meus objetivos."
  ],
  'S23': [
    "Permito-me viver momentos de prazer sem culpa excessiva.",
    "Busco experiências que me tragam alegria genuína.",
    "Aprecio pequenos momentos do cotidiano.",
    "Meu sentido de vida inclui desfrutar do presente.",
    "Sinto que o prazer saudável faz parte de uma vida plena."
  ],
  'S24': [
    "Relacionamentos profundos são essenciais para meu sentido de vida.",
    "Sinto que posso ser emocionalmente aberto(a) com alguém.",
    "Compartilhar experiências fortalece meu significado de vida.",
    "Me sinto conectado(a) emocionalmente às pessoas importantes.",
    "A intimidade genuína sustenta minha sensação de plenitude."
  ],
  'S25': [
    "Ter estabilidade financeira contribui para meu sentido de vida.",
    "Sinto tranquilidade quando minha vida está organizada.",
    "Prezo por ambientes previsíveis e seguros.",
    "A estabilidade me permite pensar no futuro com confiança.",
    "Minha vida ganha sentido quando me sinto seguro(a)."
  ],
  'S26': [
    "Experiências estéticas me trazem significado.",
    "Sinto impacto emocional diante da arte ou da natureza.",
    "A beleza amplia minha percepção de vida.",
    "Valorizo ambientes visualmente harmoniosos.",
    "A estética influencia meu estado interior."
  ],
  'S27': [
    "Ter conforto adequado contribui para meu bem-estar.",
    "Procuro equilibrar esforço com descanso.",
    "Valorizo uma vida com qualidade, não apenas produtividade.",
    "Momentos de relaxamento são importantes para mim.",
    "Sinto que qualidade de vida faz parte do sentido de viver."
  ]
};

const generateQuestions = (): Question[] => {
  const qs: Question[] = [];
  let id = 1;

  DIMENSIONS_MAP.forEach((dim) => {
    dim.sources.forEach((src) => {
      let texts: string[] = [];
      
      if (dim.code === 'D1' && D1_QUESTIONS_TEXT[src.code]) {
        texts = D1_QUESTIONS_TEXT[src.code];
      } else if (dim.code === 'D2' && D2_QUESTIONS_TEXT[src.code]) {
        texts = D2_QUESTIONS_TEXT[src.code];
      } else if (dim.code === 'D3' && D3_QUESTIONS_TEXT[src.code]) {
        texts = D3_QUESTIONS_TEXT[src.code];
      } else if (dim.code === 'D4' && D4_QUESTIONS_TEXT[src.code]) {
        texts = D4_QUESTIONS_TEXT[src.code];
      }
      
      const finalTexts = Array(5).fill(0).map((_, i) => {
         if (texts[i]) return texts[i];
         return `[Aguardando dados para ${src.name}] Pergunta ${i + 1}`;
      });

      finalTexts.forEach((text, index) => {
        const qNum = index + 1;
        qs.push({
          id: id++,
          dimension: dim.code,
          source: src.name,
          sourceCode: src.code,
          question_code: `${dim.code}-${src.code}-Q${qNum}`,
          text: text,
          scale_min: 0,
          scale_max: 5
        });
      });
    });
  });

  return qs;
};

export const QUESTIONS = generateQuestions();
export const DIMENSIONS = DIMENSIONS_MAP;
