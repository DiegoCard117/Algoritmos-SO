const readline = require("readline");

class Processo {
  constructor(nome, tempoC, tempoE) {
    this.nome = nome;
    this.tempoC = tempoC;
    this.tempoE = tempoE;
    this.tempoR = tempoE;
    this.concluido = false;
  }
}

class SRT {
  constructor() {
    this.processos = [];
    this.tabela = [];
    this.tempoReal = 0;
  }

  adicionarProcesso(nome, tempoC, tempoE) {
    this.processos.push(new Processo(nome, tempoC, tempoE));
    // Ordena os processos por tempo de chegada e, em caso de empate, por nome
    this.processos.sort((a, b) => {
      if (a.tempoC === b.tempoC) {
        return a.nome.localeCompare(b.nome); // Ordena alfabeticamente
      }
      return a.tempoC - b.tempoC; // Ordena por tempo de chegada
    });
  }

  ordenarSRT() {
    let totalConcluidos = 0;
    const totalProcessos = this.processos.length;

    while (totalConcluidos < totalProcessos) {
      let menorTempo = Infinity;
      let idx = -1;

      for (let i = 0; i < totalProcessos; i++) {
        let p = this.processos[i];
        if (
          p.tempoC <= this.tempoReal &&
          !p.concluido &&
          p.tempoR < menorTempo &&
          p.tempoR > 0
        ) {
          menorTempo = p.tempoR;
          idx = i;
        }
      }

      if (idx !== -1) {
        this.tabela.push(this.processos[idx].nome);
        this.processos[idx].tempoR--;
        if (this.processos[idx].tempoR === 0) {
          this.processos[idx].concluido = true;
          totalConcluidos++;
        }
      } else {
        this.tabela.push("-");
      }

      this.tempoReal++;
    }
  }

  imprimir() {
    console.log("\n*********** INFORMAÇÕES DOS PROCESSOS ***********");
    this.processos.forEach((p) => {
      console.log(
        `Processo ${p.nome} chegou no tempo: ${p.tempoC} com tempo de execução: ${p.tempoE}`
      );
    });

    console.log("\n*********** ESCALONAMENTO (SRT) ***********");
    console.log("Tempo | Processo");
    this.tabela.forEach((nome, i) => {
      console.log(`  ${i}   |   ${nome}`);
    });
  }
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
  const s = new SRT();

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
    s.adicionarProcesso(nome, tempoC, tempoE);
  }

  rl.close();
  s.ordenarSRT();
  s.imprimir();
}

main();

/*
let s = new SRT();
s.adicionarProcesso("A", 0, 5);
s.adicionarProcesso("B", 2, 3);
s.adicionarProcesso("C", 4, 1);
s.ordenarSRT();
s.imprimir();
*/
