// Definir os dados dos recintos e animais
const recintos = [
  { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'macaco', quantidade: 3, tamanho: 1 }] },
  { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
  { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'gazela', quantidade: 1, tamanho: 2 }] },
  { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
  { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'leao', quantidade: 1, tamanho: 3 }] }
];

const animaisPermitidos = {
  leao: { tamanho: 3, biomas: ['savana'], carnivoro: true },
  leopardo: { tamanho: 2, biomas: ['savana'], carnivoro: true },
  crocodilo: { tamanho: 3, biomas: ['rio'], carnivoro: true },
  macaco: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
  gazela: { tamanho: 2, biomas: ['savana'], carnivoro: false },
  hipopotamo: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
};

// Função principal para determinar os recintos viáveis
function encontrarRecintos(tipoAnimal, quantidade) {
  // Validações iniciais
  const animalNome = tipoAnimal.toLowerCase();
  if (!animaisPermitidos[animalNome]) {
    return "Animal inválido";
  }
  if (quantidade <= 0 || !Number.isInteger(quantidade)) {
    return "Quantidade inválida";
  }

  const animal = animaisPermitidos[animalNome];
  const recintosViaveis = [];

  // Loop pelos recintos para verificar as regras
  recintos.forEach(recinto => {
    let espacoOcupado = 0;
    let carnivoroPresente = false;

    recinto.animaisExistentes.forEach(animalExistente => {
      espacoOcupado += animalExistente.quantidade * animalExistente.tamanho;
      if (animaisPermitidos[animalExistente.especie].carnivoro) {
        carnivoroPresente = true;
      }
    });

    // Verifica bioma e espaço disponível
    const biomasRecinto = recinto.bioma.split(' e ');
    const biomaAdequado = biomasRecinto.some(bioma => animal.biomas.includes(bioma));
    const espacoNecessario = quantidade * animal.tamanho + (recinto.animaisExistentes.length > 0 ? 1 : 0);
    const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

    if (!biomaAdequado || espacoDisponivel < espacoNecessario) {
      return; // Pula este recinto
    }

    // Regras específicas
    if (animal.carnivoro && (carnivoroPresente || recinto.animaisExistentes.length > 0)) {
      return;
    }
    if (animalNome === 'hipopotamo' && !biomasRecinto.includes('rio')) {
      return;
    }
    if (animalNome === 'macaco' && recinto.animaisExistentes.length === 0) {
      return;
    }

    // Se todas as condições forem atendidas, o recinto é viável
    recintosViaveis.push(`Recinto nro ${recinto.numero} (espaço livre: ${espacoDisponivel - espacoNecessario}, total: ${recinto.tamanhoTotal})`);
  });

  // Retorna a lista de recintos ou um erro caso nenhum seja viável
  return recintosViaveis.length > 0 ? recintosViaveis : "Não há recinto viável";
}

// Exemplo de chamadas:
console.log(encontrarRecintos('leao', 1)); // Deve retornar os recintos disponíveis para o leão
console.log(encontrarRecintos('macaco', 2)); // Deve retornar os recintos disponíveis para os macacos
console.log(encontrarRecintos('hipopotamo', 1)); // Deve retornar os recintos viáveis para o hipopótamo
console.log(encontrarRecintos('elefante', 1)); // Deve retornar "Animal inválido"
 
 
