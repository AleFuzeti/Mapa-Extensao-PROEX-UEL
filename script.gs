const ARQUIVOS = {
  "Projeto de Extensão": "https://docs.google.com/spreadsheets/d/1HHzMxHRoO-LNNr3bHYx6QusKHlDD0XzCykkE_T6JC8A/edit",
  "Curso de Extensão": "https://docs.google.com/spreadsheets/d/1DZpNLFOSZURD1OXygaeMEjG1WlVPcDu5re1-gY-xid0/edit",
  "Evento de Extensão": "https://docs.google.com/spreadsheets/d/1P_4azt6BROlEMgHj8xiWCge_n691eJnQlmVVwKCx-rI/edit",
  "Programa de Extensão": "https://docs.google.com/spreadsheets/d/1b9a9V-8SLHGGO9NBmpiS-serq8v6SE5oLIfAIscaa80/edit",
  "Projeto de Prestação de Serviço": "https://docs.google.com/spreadsheets/d/1Zvn4NdYSQUg077nrsK5pjdBkogW80yh0izyKfksqUA8/edit"
};

const CABECALHOS = [
  'Tipo de Extensão', 'Título', 'Ação', 'Docente(s)', 'Público atendido', 'Número de estudantes de graduação envolvidos', 'Número de estudantes de pós-graduação envolvidos', 'Descrição', 'Período da ação', 'Modalidade', 'Latitude', 'Longitude'
];

function doPost(e) {
  try {
    const params = e.parameter;
    Logger.log("Dados recebidos: " + JSON.stringify(params));

    // Formatar latitude e longitude como texto
    const latitude = `'${params['latitude'] || ''}`;
    const longitude = `'${params['longitude'] || ''}`;

    const data = [
      params['tipo-de-extensao'] || '',
      params['titulo'] || '',
      params['acao'] || '',
      params['docentes'] || '',
      params['publico'] || '',
      params['estudantes-graduacao'] || '',
      params['estudantes-posgraduacao'] || '',
      params['descricao'] || '',
      params['periodo'] || '',
      params['modalidade'] || '',
      latitude,
      longitude,
      params['telefone'] || ''
    ];

    const planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    planilha.appendRow(data);

    return ContentService.createTextOutput("Dados recebidos com sucesso.");
  } catch (error) {
    Logger.log("Erro no doPost: " + error.message);
    return ContentService.createTextOutput("Erro ao processar os dados: " + error.message);
  }
}

function editar(e) {
  const sheet = e.source.getActiveSheet();
  const editedRow = e.range.getRow();
  const editedColumn = e.range.getColumn();

  // Ignorar cabeçalhos
  if (editedRow === 1) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const extensionColumn = headers.indexOf("Tipo de Extensão");
  const statusColumn = headers.indexOf("Aprovação");
  const telefoneColumn = headers.indexOf("Telefone");

  if (editedColumn === statusColumn + 1) {
    const status = data[editedRow - 1][statusColumn];
    const editedData = data[editedRow - 1];
    const editedType = editedData[extensionColumn];
    const dataToInsert = editedData.slice(0, telefoneColumn);

    if (status === "Aprovado") {
      Logger.log("Status alterado para Aprovado. Enviando para a tabela.");
      enviarParaTabela(dataToInsert, editedType);
    } else if (status === "Rejeitado") {
      Logger.log("Status alterado para Rejeitado. Removendo da tabela.");
      removerDaTabela(dataToInsert, editedType);
    } else {
      Logger.log("Status não relevante: " + status);
    }
  }
}

function enviarParaTabela(dados, categoria) {
  try {
    const planilha = abrirArquivo(categoria);
    const todasLinhas = planilha.getDataRange().getValues();

    // Verificar se a linha já existe
    const linhaExiste = todasLinhas.some(linha => JSON.stringify(linha) === JSON.stringify(dados));

    if (!linhaExiste) {
      planilha.appendRow(dados);
      Logger.log("Dados adicionados à categoria: " + categoria);
    } else {
      Logger.log("A linha já existe na planilha. Nenhuma nova linha foi adicionada.");
    }
  } catch (error) {
    Logger.log("Erro ao enviar para tabela: " + error.message);
  }
}

function removerDaTabela(dados, categoria) {
  try {
    const planilha = abrirArquivo(categoria);
    const todasLinhas = planilha.getDataRange().getValues();

    // Procurar e remover a linha
    for (let i = 1; i < todasLinhas.length; i++) {
      if (JSON.stringify(todasLinhas[i]) === JSON.stringify(dados)) {
        planilha.deleteRow(i + 1); // Ajustar índice para o Google Sheets
        Logger.log("Linha removida da categoria: " + categoria);
        return;
      }
    }

    Logger.log("Linha não encontrada na categoria: " + categoria);
  } catch (error) {
    Logger.log("Erro ao remover da tabela: " + error.message);
  }
}

function abrirArquivo(categoria) {
  if (!ARQUIVOS[categoria]) {
    throw new Error("Categoria inválida: " + categoria);
  }

  const arquivo = SpreadsheetApp.openByUrl(ARQUIVOS[categoria]);
  const planilha = arquivo.getActiveSheet();

  // Verifica se há cabeçalhos e adiciona caso a planilha esteja vazia
  if (planilha.getLastRow() === 0) {
    planilha.appendRow(CABECALHOS);
  }

  return planilha;
}

function backupTabela() {
  // Definir a pasta de backup no Google Drive
  var pastaBackup = DriveApp.getFolderById('1VlbkKBO-oayjHzfKVSFlsU4OGicLuVay');
  Logger.log("Pasta de backup localizada: " + pastaBackup.getName());
  
  // Data do backup no formato DD/MM/YYYY
  var dataBackup = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
  Logger.log("Data do backup: " + dataBackup);

  // Para cada arquivo de planilha, copie para a pasta de backup
  for (var categoria in ARQUIVOS) {
    var url = ARQUIVOS[categoria];
    Logger.log("Abrindo arquivo: " + categoria + " com URL: " + url);
    
    try {
      var arquivo = SpreadsheetApp.openByUrl(url);
      var nomeArquivo = dataBackup + " - " + categoria;
      Logger.log("Arquivo aberto com sucesso: " + nomeArquivo);

      // Criar uma cópia do arquivo
      var copia = arquivo.copy(nomeArquivo);
      Logger.log("Cópia do arquivo criada com o nome: " + nomeArquivo);

      // Obter a ID da cópia
      var copiaId = copia.getId();

      // Obter a cópia do arquivo e movê-la para a pasta de backup
      var copiaFile = DriveApp.getFileById(copiaId);
      pastaBackup.addFile(copiaFile); // Adiciona o arquivo copiado na pasta de backup

      // Remover a cópia da pasta original, se necessário
      var pastaOriginal = DriveApp.getFileById(arquivo.getId()).getParents().next();
      pastaOriginal.removeFile(copiaFile); // Se você deseja deixar apenas a cópia na pasta de backup

      Logger.log("Arquivo movido para a pasta de backup: " + pastaBackup.getName());

    } catch (error) {
      Logger.log("Erro ao processar o arquivo " + categoria + ": " + error.message);
    }
  }
}
