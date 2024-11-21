# Mapa Extensão PROEX UEL

## Documentação do Projeto: Formulário de Extensão

### 1. Introdução

O projeto é um formulário interativo para gerenciar ações de extensão. Ele permite que usuários insiram informações detalhadas sobre suas ações, selecionem localizações em um mapa e enviem os dados para um sistema remoto.

### 2. Objetivos

- Facilitar o registro e o gerenciamento de ações de extensão.
- Permitir a seleção de localizações geográficas para cada ação.
- Validar e enviar os dados para uma planilha do Google Sheets utilizando Google Apps Script.

### 3. Estrutura do Projeto

#### 3.1. Arquivos Principais

- `formulario.html`: Define a interface do usuário, incluindo o formulário, mapa e validações.
- `script.gs`: Implementa a lógica no Google Apps Script para receber os dados enviados e armazená-los em uma planilha do Google.

#### 3.2. Bibliotecas Utilizadas

- Leaflet.js: Para a exibição e interação com o mapa.
- Day.js: Para manipulação de datas.
- Google Apps Script: Para integração com o Google Sheets.

### 4. Funcionalidades

#### 4.1. Interface do Formulário

- Campos para informações básicas como título, docentes, telefone e número de participantes.
- Validações de:
    - Título genérico.
    - Período de tempo inválido (data de fim antes da data de início).
    - Valores negativos ou não numéricos.
- Seção de modalidade, visível apenas para o tipo "Projeto de Prestação de Serviço".

#### 4.2. Interação com o Mapa

- Seleção de latitude e longitude ao clicar no mapa.
- Pesquisa por endereços com marcador automático.
- Validação para garantir a seleção de uma localização.

#### 4.3. Envio de Dados

- Geração de um objeto FormData contendo:
    - Informações inseridas no formulário.
    - Latitude e longitude selecionadas.
    - Período formatado com base nas datas.

#### 4.4. Integração com Google Sheets

- Dados enviados para o Google Sheets através de uma requisição POST para um endpoint Apps Script.

### 5. Como Usar

#### 5.1. Configuração

- Certifique-se de que as bibliotecas externas estão acessíveis.
- Configure o arquivo `script.gs` no Google Apps Script, vinculando-o a uma planilha.

#### 5.2. Executando o Formulário

- Abra o arquivo `formulario.html` em um navegador.
- Preencha os campos obrigatórios.
- Clique no mapa para selecionar a localização.
- Submeta o formulário.

#### 5.3. Verificação de Dados

- Após o envio, confirme os dados na planilha associada ao Google Apps Script.

### 6. Validações Implementadas

- Título não pode ser "Título".
- Data de fim deve ser igual ou posterior à data de início.
- Campos numéricos não podem conter valores negativos.
- Latitude e longitude devem ser selecionadas.