import type { DadosCliente, ErrosFormularioPedido } from "../tipos/pedido";
import { dataEhAnteriorAHoje } from "./formatacaoData";

export function validarDadosCliente(dados: DadosCliente): ErrosFormularioPedido {
  const erros: ErrosFormularioPedido = {};

  if (!dados.nome.trim()) {
    erros.nome = "Informe seu nome completo.";
  }

  if (dados.modalidade === "entrega" && !dados.endereco.trim()) {
    erros.endereco = "Informe o endereço completo para entrega.";
  }

  if (!dados.dataDesejada) {
    erros.dataDesejada = "Escolha a data desejada.";
  } else if (dataEhAnteriorAHoje(dados.dataDesejada)) {
    erros.dataDesejada = "A data não pode ser anterior a hoje.";
  }

  return erros;
}

export function formularioEhValido(erros: ErrosFormularioPedido): boolean {
  return Object.keys(erros).length === 0;
}
