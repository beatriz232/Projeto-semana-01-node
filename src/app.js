"use strict";

import { listarCardapio } from "./services/carrinhoService.js";
import { adicionarAoCarrinho, calcularResumo } from "./services/carrinhoService.js";
import { formatarResumoParaConsole } from "./utils/formatador.js";

/* ===========================
   TESTE VIA CONSOLE
=========================== */

let carrinho = [];

try {
  // Mostrar cardápio filtrado
  console.log("\n=== CARDÁPIO (Lanches) ===\n");
  console.log(listarCardapio("Lanche").join("\n"));

  // Adicionar itens ao carrinho
  carrinho = adicionarAoCarrinho(carrinho, 1);
  carrinho = adicionarAoCarrinho(carrinho, 1);
  carrinho = adicionarAoCarrinho(carrinho, 3);
  carrinho = adicionarAoCarrinho(carrinho, 4);
  carrinho = adicionarAoCarrinho(carrinho, 2);

  // Calcular resumo
  const resumo = calcularResumo(carrinho);

  // Mostrar resumo formatado
  console.log(formatarResumoParaConsole(resumo));

} catch (error) {
  console.error("\nErro:", error.message);
}