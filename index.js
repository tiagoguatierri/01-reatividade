let efeitoAtivo = null;

const mapaDeObjetos = new WeakMap();

function criaEfeito(efeito) {
  efeitoAtivo = efeito;

  efeito();

  efeitoAtivo = null;
}

function rastreia(objeto, chave) {
  let mapaDeDependencias = mapaDeObjetos.get(objeto);

  if (!mapaDeDependencias) {
    mapaDeDependencias = new Map();

    mapaDeObjetos.set(objeto, mapaDeDependencias);
  }

  let dependencias = mapaDeDependencias.get(chave);

  if (!dependencias) {
    dependencias = new Set();

    mapaDeDependencias.set(chave, dependencias);
  }

  if (efeitoAtivo) {
    dependencias.add(efeitoAtivo);
  }
}

function executa(objeto, chave) {
  const mapaDeDependencias = mapaDeObjetos.get(objeto);

  if (mapaDeDependencias) {
    const dependencias = mapaDeDependencias.get(chave);

    dependencias.forEach((efeito) => efeito());
  }
}

const manipuladores = {
  get(objeto, chave) {
    rastreia(objeto, chave);

    return objeto[chave];
  },
  set(objeto, chave, valor) {
    const valorAntigo = objeto[chave];

    objeto[chave] = valor;

    if (valorAntigo !== valor) {
      executa(objeto, chave);
    }
  },
};

const estado = new Proxy(
  {
    nome: 'John',
    sobrenome: 'Doe',
  },
  manipuladores
);

criaEfeito(() => console.log(`${estado.nome} ${estado.sobrenome}`));

estado.nome = 'Tiago';
estado.sobrenome = 'Guatierri';
