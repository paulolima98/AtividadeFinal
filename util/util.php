<?php
date_default_timezone_set('America/Sao_Paulo');

/**
 * Isola a página a ser exibida usando como base a rota em $_REQUEST['rota']
 *
 * @param string $rota Texto a ser verificado em $_REQUEST['rota']
 * @param callable $pagina Função a ser executada
 */
function router_add($rota, $pagina) {
  $rota_atual = (string) ($_REQUEST['rota'] ?? 'index');

  if ($rota_atual == $rota) {
    call_user_func($pagina);
    exit;
  }
}

// função importantissima para garantir a segurança do envio dos dados e vitar ataques Hacker
function limpaRequest($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}