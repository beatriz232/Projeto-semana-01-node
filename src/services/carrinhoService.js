"use strict";

import { cardapio } from "../data/cardapio.js";
import { CONFIG } from "../config/config.js";
import { moeda } from "../utils/formatador.js";

/** Valida se um id é número inteiro positivo */
const validarIdProduto = (idProduto) =>
  Number.isInteger(idProduto) && idProduto > 0;

/** Busca produto por id com tratamento de erro */
const buscarProdutoPorId = (idProduto) => {
  if (!validarIdProduto(idProduto)) {
    throw new Error("ID do produto inválido.");
  }

  const produto = cardapio.find((item) => item.id === idProduto);

  if (!produto) {
    throw new Error(`Produto com id ${idProduto} não encontrado.`);
  }

  return produto;
};

/**
 * Adiciona item ao carrinho (função pura)
 * @param {Array} carrinhoAtual
 * @param {number} idProduto
 * @returns {Array}
 */
export const adicionarAoCarrinho = (carrinhoAtual, idProduto) => {
  const produto = buscarProdutoPorId(idProduto);

  const itemExistente = carrinhoAtual.find(
    (item) => item.id === idProduto
  );

  if (itemExistente) {
    return carrinhoAtual.map((item) =>
      item.id === idProduto
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    );
  }

  return [...carrinhoAtual, { ...produto, quantidade: 1 }];
};

/**
 * Calcula resumo do pedido
 * @param {Array} carrinhoAtual
 * @param {Object} [opts]
 * @returns {Object}
 */
export const calcularResumo = (carrinhoAtual, opts = {}) => {
  const taxaEntrega = opts.taxaEntrega ?? CONFIG.TAXA_ENTREGA;
  const desconto = opts.desconto ?? CONFIG.DESCONTO;
  const minItensDesconto =
    opts.minItensDesconto ?? CONFIG.MIN_ITENS_DESCONTO;

  if (!Array.isArray(carrinhoAtual) || carrinhoAtual.length === 0) {
    return {
      itens: [],
      totalItens: 0,
      subtotal: 0,
      descontoAplicado: 0,
      taxaEntrega,
      totalGeral: taxaEntrega,
    };
  }

  const { itens, totalItens, subtotal } = carrinhoAtual
    .map((item) => ({
      ...item,
      total: item.preco * item.quantidade,
    }))
    .reduce(
      (acc, item) => {
        acc.itens.push(
          `${item.nome} x${item.quantidade} — ${moeda(item.total)}`
        );
        acc.totalItens += item.quantidade;
        acc.subtotal += item.total;
        return acc;
      },
      { itens: [], totalItens: 0, subtotal: 0 }
    );

  const descontoAplicado =
    totalItens >= minItensDesconto
      ? subtotal * desconto
      : 0;

  const totalGeral =
    subtotal - descontoAplicado + taxaEntrega;

  return {
    itens,
    totalItens,
    subtotal,
    descontoAplicado,
    taxaEntrega,
    totalGeral,
  };
};

/** Lista cardápio opcionalmente por categoria */
export const listarCardapio = (categoria = null) => {
  return cardapio
    .filter((item) => !categoria || item.categoria === categoria)
    .map(
      (item) =>
        `${item.id} | ${item.nome.padEnd(20)} | ${moeda(
          item.preco
        )}`
    );
};