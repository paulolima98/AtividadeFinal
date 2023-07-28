<?php
require 'util/util.php';

$servername = (string) "localhost";
$username = (string) "root";
$password = (string) "";
$dbname = (string) "cbcm";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

router_add('index', function() {
  global $conn;
  $dados = (array) [];

  $sql = "SELECT * FROM configuracoes order by id";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
      $dados['tempo_temperatura'] = (int) $row['tempo_temperatura'];
      $dados['distancia_sensor'] = (int) $row['distancia_sensor'];
    }
  }

  $tempo_temperatura = (int) ($dados['tempo_temperatura'] ?? 300000);
  $distancia_sensor = (int) ($dados['distancia_sensor'] ?? 5);

  ?>
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png">
    <link rel="icon" type="image/png" href="./assets/img/favicon.png">
    <title>
      CBCM - Central Básica de Controle e Monitoramento
    </title>
    <!--     Fonts and icons     -->
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700" />
    <!-- Nucleo Icons -->
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <!-- Font Awesome Icons -->
    <script src="assets/js/custom.js"></script>
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
    <!-- CSS Files -->
    <link id="pagestyle" href="./assets/css/material-dashboard.css?v=3.0.0" rel="stylesheet" />
    <!-- Custom JS -->
    <script src="https://kit.fontawesome.com/42d5adcbca.js" crossorigin="anonymous"></script>
  </head>
  <body class="g-sidenav-show  bg-gray-200">
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
      <!-- Navbar -->
      <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
        <div class="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <h2 class="font-weight-bolder mb-0">CBCM - Central Básica de Controle e Monitoramento</h2>
          </nav>
        </div>
      </nav>
      <!-- End Navbar -->
      <div class="container-fluid py-4">
        <div class="row">
          <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
            <div class="card">
              <div class="card-header p-3 pt-2">
                <div class="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                  <svg class="mt-1" width="52" height="52" fill="white" viewBox="0 0 16 16">
                    <path d="M7.5 1v7h1V1h-1z"/>
                    <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
                  </svg>
                </div>
                <div class="text-end pt-1">
                  <p class="text-sm mb-0">Alarme</p>
                  <h4 class="mb-0" id="texto-alarme-ativo">Desativado</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
            <div class="card">
              <div class="card-header p-3 pt-2">
                <div class="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                  <svg class="mt-1" id="icone-sistema-conectado" width="52" height="52" fill="white" viewBox="0 0 16 16">
                    <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049z"/>
                    <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065zm-2.183 2.183c.226-.226.185-.605-.1-.75A6.473 6.473 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.478 5.478 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091l.016-.015zM9.06 12.44c.196-.196.198-.52-.04-.66A1.99 1.99 0 0 0 8 11.5a1.99 1.99 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"/>
                  </svg>
                </div>
                <div class="text-end pt-1">
                  <p class="text-sm mb-0">Conexão</p>
                  <h4 class="mb-0" id="texto-conexao-sistema">Desconectado</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
            <div class="card">
              <div class="card-header p-3 pt-2">
                <div class="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                <svg class="mt-1" width="52" height="52" fill="white" viewBox="0 0 16 16">
                  <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415z"/>
                  <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z"/>
                </svg>
                </div>
                <div class="text-end pt-1">
                  <p class="text-sm mb-0">Temperatura atual</p>
                  <h4 class="mb-0" id="texto-temperatura">Sem dados</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-4 col-md-6 mb-md-0 mb-4">
            <div class="card">
              <div class="card-header pb-0">
                <div class="row mb-3">
                  <div class="col-lg-6 col-7">
                    <h4>Configurações</h4>
                  </div>
                  <div class="mt-2 mb-2 d-flex">
                    <h6 class="mb-0">Tema: Light / Dark</h6>
                    <div class="form-check form-switch ps-0 ms-auto my-auto">
                      <input class="form-check-input mt-1 ms-auto" type="checkbox" id="dark-version" onclick="darkMode(this)">
                    </div>
                  </div>
                  <div class="mt-2 mb-2">
                    <h6 class="mb-0">Tempo de consulta da temperatura em milissegundos</h6>
                    <div class="input-group input-group-outline ">
                      <input id="tempo-temperatura" type="text" value="<?= $tempo_temperatura ?>" class="form-control">
                    </div>
                  </div>
                  <div class="mt-2 mb-2">
                    <h6 class="mb-0">Distância do sensor do Alarme em centímetros</h6>
                    <div class="input-group input-group-outline ">
                      <input id="distancia-sensor" type="text" value="<?= $distancia_sensor ?>" class="form-control">
                    </div>
                  </div>
                  <div class="mt-2 mb-2">
                    <button class="btn bg-gradient-primary mt-2 w-100" onclick="salvarConfiguracoes()">Salvar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8 col-md-6 mt-4 mb-4">
            <div class="card z-index-2  ">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                <div class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1">
                  <div class="chart" id="grafico-temperatura">
                    <canvas id="chart-line" class="chart-canvas" height="205"></canvas>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <h6 class="mb-0">Monitoramento da temperatura</h6>
                <hr class="dark horizontal">
                <div class="d-flex ">
                  <i class="material-icons text-sm my-auto me-1">schedule</i>
                  <p class="mb-0 text-sm" id="texto-tempo"> atualizado a <?= $tempo_temperatura ?> milissegundos atrás </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!--   Core JS Files   -->
    <script src="assets/js/core/popper.min.js"></script>
    <script src="assets/js/core/bootstrap.min.js"></script>
    <script src="assets/js/plugins/perfect-scrollbar.min.js"></script>
    <script src="assets/js/plugins/smooth-scrollbar.min.js"></script>
    <script src="assets/js/plugins/chartjs.min.js"></script>
    <script>
      var tempoTemperatura = <?= $tempo_temperatura ?>;

      const consultarTemperatura = (loader = false) => {
        var monitoramentoTemperatura = [];
        var hora = [];
        var temperatura = [];
        js.request.post('/index.php', {
          rota: 'consulta-dados-temperatura'
        }, (resposta) => {
          monitoramentoTemperatura = resposta.dados;
          if (monitoramentoTemperatura.length > 0) {
            let temperaturaAtual = monitoramentoTemperatura[monitoramentoTemperatura.length - 1].temperatura_atual;
            js.element('#texto-temperatura').textContent = js.number_format(temperaturaAtual, 1, ',') + '°';
            js.each(monitoramentoTemperatura, (temp) => {
              hora.push(temp.hora);
              temperatura.push(temp.temperatura_atual);
            });

            let chartStatus = Chart.getChart("chart-line");
            if (chartStatus != undefined) {
              chartStatus.destroy();
            }
            
            var ctx2 = document.getElementById("chart-line").getContext("2d");
            new Chart(ctx2, {
              type: "line",
              data: {
                labels: hora.reverse(),
                datasets: [{
                  label: "Temperatura ",
                  tension: 0,
                  borderWidth: 0,
                  pointRadius: 5,
                  pointBackgroundColor: "rgba(255, 255, 255, .8)",
                  pointBorderColor: "transparent",
                  borderColor: "rgba(255, 255, 255, .8)",
                  borderColor: "rgba(255, 255, 255, .8)",
                  borderWidth: 4,
                  backgroundColor: "transparent",
                  fill: true,
                  data: temperatura,
                  maxBarThickness: 6
                }],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  }
                },
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                scales: {
                  y: {
                    grid: {
                      drawBorder: false,
                      display: true,
                      drawOnChartArea: true,
                      drawTicks: false,
                      borderDash: [5, 5],
                      color: 'rgba(255, 255, 255, .2)'
                    },
                    ticks: {
                      display: true,
                      color: '#f8f9fa',
                      padding: 10,
                      font: {
                        size: 14,
                        weight: 300,
                        family: "Roboto",
                        style: 'normal',
                        lineHeight: 2
                      },
                    }
                  },
                  x: {
                    grid: {
                      drawBorder: false,
                      display: false,
                      drawOnChartArea: false,
                      drawTicks: false,
                      borderDash: [5, 5]
                    },
                    ticks: {
                      display: true,
                      color: '#f8f9fa',
                      padding: 10,
                      font: {
                        size: 14,
                        weight: 300,
                        family: "Roboto",
                        style: 'normal',
                        lineHeight: 2
                      },
                    }
                  },
                },
              },
            });
          }
        }, loader);
        setTimeout(consultarTemperatura, tempoTemperatura);
      }

      const verificarConexao = () => {
        js.request.post('/index.php', {
          rota: 'verifica-conexao'
        }, (resposta) => {
          let dados = resposta.dados;
          alarmeAtivado = dados.alarme_ativado;
          conectado = dados.conectado;
          js.element('#texto-alarme-ativo').textContent = (alarmeAtivado ? 'Ativado' : 'Desativado');
          js.element('#texto-conexao-sistema').textContent = (conectado ? 'Conectado' : 'Desconectado');
        }, false);
        setTimeout(verificarConexao, 2000);
      }

      const salvarConfiguracoes = () => {
        let campoTempoTemperatura = js.element('#tempo-temperatura');
        let campoDistanciaSensor = js.element('#distancia-sensor');

        tempoTemperatura = js.integer(campoTempoTemperatura.value);
        js.element('#texto-tempo').textContent =  'atualizado a ' + tempoTemperatura + ' milissegundos atrás';

        js.request.post('/index.php', {
          rota: 'salvar-configuracoes',
          tempo_temperatura: tempoTemperatura,
          distancia_sensor: js.integer(campoDistanciaSensor.value)
        }, (resposta) => {});
      }

      js.initialize(function () {
        darkMode(js.element('#dark-version'));
        consultarTemperatura();
        verificarConexao();
      });
    </script>
    <script>
      var win = navigator.platform.indexOf('Win') > -1;
      if (win && document.querySelector('#sidenav-scrollbar')) {
        var options = {
          damping: '1'
        }
        Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
      }
    </script>
    <!-- Github buttons -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
    <!-- Control Center for Material Dashboard: parallax effects, scripts for the example pages etc -->
    <script src="assets/js/material-dashboard.min.js?v=3.0.0"></script>
  </body>
  </html>
  <?php
  exit;
});

router_add('recebe-dados-temperatura', function() {
  global $conn;
  $sucesso = (bool) false;
  $mensagem = (string) '';

  // as variaveis da URL capturada por GET
  $temperaturaAtual = limpaRequest(($_GET["temperatura_atual"] ?? 0));
  $dataAtual = date('Y-m-d');
  $horaAtual = date('H:i:s');

  $sql = "INSERT INTO temperatura (data, hora, temperatura_atual) VALUES ('$dataAtual', '$horaAtual', '$temperaturaAtual')";

  if ($conn->query($sql)) {
    $mensagem = (string) "Registro Gravado com Sucesso";
    $sucesso = (bool) true;
  } else $mensagem = (string) "Erro: " . $sql . "<br>" . $conn->error;

  echo json_encode([
    'sucesso' => (bool) $sucesso,
    'mensagem' => (string) $mensagem
  ]);
  
  exit;
});

router_add('consulta-dados-temperatura', function() {
  global $conn;

  $dados = (array) [];
  //comando select na ordem decrescente pelo id
  $sql = "SELECT * FROM temperatura order by id desc limit 8";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
      array_push($dados, [
        'temperatura_atual' => (float) $row['temperatura_atual'],
        'data' => $row['data'],
        'hora' => $row['hora']
      ]);
    }
  }

  echo json_encode([
    'dados' => (array) $dados
  ]);

  exit;
});

router_add('recebe-dados-sistema', function() {
  global $conn;
  $mensagem = (string) '';
  $sucesso = (bool) false;

  $dataAtual = date('Y-m-d');
  $horaAtual = date('H:i:s');
  // as variaveis da URL capturada por GET
  $alarme_ativado = (bool) ($_GET['alarme_ativado'] ?? false);
  $conectado = (bool) ($_GET['conectado'] ?? false);

  $sql = "UPDATE sistema SET data='$dataAtual', hora='$horaAtual', alarme_ativado='$alarme_ativado', conectado='$conectado' WHERE id=1";

  if ($conn->query($sql)) {
    $mensagem = (string) "Registro Gravado com Sucesso";
    $sucesso = (bool) true;
  } else $mensagem = (string) "Erro: " . $sql . "<br>" . $conn->error;

  echo json_encode([
    'sucesso' => (bool) $sucesso,
    'mensagem' => (string) $mensagem
  ]);

  exit;
});

router_add('verifica-conexao', function() {
  global $conn;
  $dados = (array) [];

  // comando select na ordem decrescente pelo id
  $sql = "SELECT * FROM sistema order by id";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
      $dados['alarme_ativado'] = (bool) $row['alarme_ativado'];
      $dados['conectado'] = (bool) $row['conectado'];
      $dados['data'] = $row['data'];
      $dados['hora'] = $row['hora'];
    }
  }

  echo json_encode([
    'dados' => (array) $dados
  ]);

  exit;
});

router_add('salvar-configuracoes', function() {
  global $conn;
  $sucesso = (bool) false;
  $mensagem = (string) '';
  // as variaveis da URL capturada por GET
  $tempo_temperatura = (int) limpaRequest($_REQUEST['tempo_temperatura'] ?? 300000);
  $distancia_sensor = (int) limpaRequest($_REQUEST['distancia_sensor'] ?? 5);

  $sql = "UPDATE configuracoes SET tempo_temperatura='$tempo_temperatura', distancia_sensor='$distancia_sensor' WHERE id=1";

  if ($conn->query($sql)) {
    $mensagem = (string) "Registro Gravado com Sucesso";
    $sucesso = (bool) true;
  } else $mensagem = (string) "Erro: " . $sql . "<br>" . $conn->error;

  echo json_encode([
    'sucesso' => (bool) $sucesso,
    'mensagem' => (string) $mensagem
  ]);

  exit;
});

router_add('envia-configuracoes', function() {
  global $conn;

  // comando select na ordem decrescente pelo id
  $sql = "SELECT * FROM configuracoes order by id desc limit 1";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
      echo (string) $row['tempo_temperatura']."|".$row['distancia_sensor'];
    }
  } else {
    //se não tem dados no servidor
    echo (string) "Nada encontrado";
  }
  $conn->close();
});