"use strict";

import { CONFIG } from "../config/config.js";

/** Formata valores como moeda brasileira */
export const moeda = (valor) =>
  new Intl.NumberFormat(CONFIG.LOCALE, {
    style: "currency",
    currency: "BRL",
  }).format(valor);

/** Gera texto formatado para exibir no console */
export const formatarResumoParaConsole = (resumo) => {
  const linhas = [];

  linhas.push("\nRESUMO DO PEDIDO\n");
  linhas.push("--------------------------");

  if (resumo.itens.length === 0) {
    linhas.push("Carrinho vazio.");
  } else {
    resumo.itens.forEach((linha) => linhas.push(linha));
  }

  linhas.push("--------------------------");
  linhas.push(`Itens: ${resumo.totalItens}`);
  linhas.push(`Subtotal: ${moeda(resumo.subtotal)}`);

  if (resumo.descontoAplicado > 0) {
    linhas.push(`Desconto: -${moeda(resumo.descontoAplicado)}`);
  }

  linhas.push(`Taxa de Entrega: ${moeda(resumo.taxaEntrega)}`);
  linhas.push(`Total Geral: ${moeda(resumo.totalGeral)}\n`);

  return linhas.join("\n");
};