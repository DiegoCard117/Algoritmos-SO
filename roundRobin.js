const readline = require("readline");

function roundRobin(processos, quantum) {
  let tempoAtual = 0;
  let fila = [];
  let tabela = [];

  // Clonar e ordenar processos por chegada
  processos = processos.map((p) => ({ ...p, restante: p.tempo }));
  processos.sort((a, b) => {
    if (a.chegada === b.chegada) {
      return a.nome.localeCompare(b.nome); // Ordena alfabeticamente
    }
    return a.chegada - b.chegada;
  });

  processos.forEach((p) => {
    console.log(
      `Processo ${p.nome} chegou no tempo ${p.chegada} com tempo de execução ${p.tempo}`
    );
  });

  while (processos.length > 0 || fila.length > 0) {
    // Se a fila estiver vazia, adianta o tempo até o próximo processo
    if (fila.length === 0 && processos.length > 0) {
      tempoAtual = processos[0].chegada;
    }

    // Adiciona à fila os processos que chegaram até agora
    while (processos.length > 0 && processos[0].chegada <= tempoAtual) {
      fila.push(processos.shift());
    }

    if (fila.length === 0) {
      tabela.push("Idle");
      tempoAtual++;
      continue;
    }

    let processo = fila.shift();
    let tempoExec = Math.min(quantum, processo.restante);

    // Executa o processo durante tempoExec unidades de tempo
    for (let i = 0; i < tempoExec; i++) {
      tabela.push(processo.nome);
      tempoAtual++;
    }

    processo.restante -= tempoExec;

    // Só após o quantum completo adicionamos novos processos
    while (processos.length > 0 && processos[0].chegada <= tempoAtual) {
      fila.push(processos.shift());
    }

    if (processo.restante > 0) {
      fila.push(processo);
    }
  }

  return tabela;
}

//leitura de dados
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(pergunta) {
  return new Promise((resolve) => {
    rl.question(pergunta, (resposta) => {
      resolve(resposta);
    });
  });
}

async function main() {
  const processos = [];
  const quantum = 2;

  let qtd = parseInt(
    await perguntar("Quantos processos deseja inserir? (2 a 15): ")
  );
  for (let i = 0; i < qtd; i++) {
    let nome = await perguntar(`Nome do processo ${i + 1}: `);
    let tempoC = parseInt(
      await perguntar(`Tempo de chegada do processo ${nome}: `)
    );
    let tempoE = parseInt(
      await perguntar(`Tempo de execução do processo ${nome}: `)
    );
    processos.push({ nome: nome, chegada: tempoC, tempo: tempoE });
  }

  rl.close();

  const resultado = roundRobin(processos, quantum);

  console.log("Tempo | Processo");
  resultado.forEach((nome, tempo) => {
    console.log(`${tempo.toString().padStart(5)} | ${nome}`);
  });
}

main();
