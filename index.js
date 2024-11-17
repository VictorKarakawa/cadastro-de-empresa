const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

let empresas = [];

app.get('/', (req, res) => {
  res.send(renderForm());
});

app.post('/', (req, res) => {
  const { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone } = req.body;
  let errors = [];

  // Validações dos campos
  if (!cnpj) errors.push('CNPJ é obrigatório.');
  if (!razaoSocial) errors.push('Razão Social é obrigatória.');
  if (!nomeFantasia) errors.push('Nome Fantasia é obrigatório.');
  if (!endereco) errors.push('Endereço é obrigatório.');
  if (!cidade) errors.push('Cidade é obrigatória.');
  if (!uf) errors.push('UF é obrigatória.');
  if (!cep) errors.push('CEP é obrigatório.');
  if (!email) errors.push('Email é obrigatório.');
  if (!telefone) errors.push('Telefone é obrigatório.');

  if (errors.length > 0) {
    res.send(renderForm(errors, { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone }));
  } else {
    empresas.push({ cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone });
    res.redirect('/');
  }
});

function renderForm(errors = [], values = {}) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cadastro de Empresas</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
      <div class="container mt-4">
        <h1 class="text-center text-primary">Cadastro de Empresas</h1>

        <!-- Exibe erros, se houver -->
        ${
          errors.length > 0
            ? `
          <div class="alert alert-danger">
            <strong>Erros encontrados:</strong>
            <ul class="mb-0">
              ${errors.map((error) => `<li>${error}</li>`).join('')}
            </ul>
          </div>
          `
            : ''
        }

        <!-- Formulário -->
        <form class="mt-4 mb-4 border p-4 rounded shadow-sm bg-light" method="POST" action="/">
          <div class="mb-3">
            <label for="cnpj" class="form-label">CNPJ:</label>
            <input type="text" class="form-control" id="cnpj" name="cnpj" value="${values.cnpj || ''}" maxlength="18" oninput="aplicarMascara(this, 'cnpj')" placeholder="Digite o CNPJ">
          </div>
          <div class="mb-3">
            <label for="razaoSocial" class="form-label">Razão Social:</label>
            <input type="text" class="form-control" id="razaoSocial" name="razaoSocial" value="${values.razaoSocial || ''}" placeholder="Digite a razão social">
          </div>
          <div class="mb-3">
            <label for="nomeFantasia" class="form-label">Nome Fantasia:</label>
            <input type="text" class="form-control" id="nomeFantasia" name="nomeFantasia" value="${values.nomeFantasia || ''}" placeholder="Digite o nome fantasia">
          </div>
          <div class="mb-3">
            <label for="endereco" class="form-label">Endereço:</label>
            <input type="text" class="form-control" id="endereco" name="endereco" value="${values.endereco || ''}" placeholder="Digite o endereço">
          </div>
          <div class="row g-3">
            <div class="col-md-6">
              <label for="cidade" class="form-label">Cidade:</label>
              <input type="text" class="form-control" id="cidade" name="cidade" value="${values.cidade || ''}" placeholder="Digite a cidade">
            </div>
            <div class="col-md-3">
              <label for="uf" class="form-label">UF:</label>
              <select id="uf" name="uf" class="form-select">
                <option value="">Selecione...</option>
                ${[
                  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
                  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
                ]
                  .map((estado) =>
                    `<option value="${estado}" ${values.uf === estado ? 'selected' : ''}>${estado}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="col-md-3">
              <label for="cep" class="form-label">CEP:</label>
              <input type="text" class="form-control" id="cep" name="cep" value="${values.cep || ''}" maxlength="9" oninput="aplicarMascara(this, 'cep')" placeholder="Digite o CEP">
            </div>
          </div>
          <div class="mb-3 mt-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" id="email" name="email" value="${values.email || ''}" placeholder="Digite o email">
          </div>
          <div class="mb-3">
            <label for="telefone" class="form-label">Telefone:</label>
            <input type="text" class="form-control" id="telefone" name="telefone" value="${values.telefone || ''}" maxlength="15" oninput="aplicarMascara(this, 'telefone')" placeholder="Digite o telefone">
          </div>
          <button type="submit" class="btn btn-primary w-100">Cadastrar</button>
        </form>

        <h2 class="text-center text-secondary">Empresas Cadastradas</h2>
        ${
          empresas.length > 0
            ? empresas
                .map(
                  (empresa) => `
        <div class="empresa border p-3 rounded mb-3">
          <strong>Razão Social:</strong> ${empresa.razaoSocial}<br>
          <strong>Nome Fantasia:</strong> ${empresa.nomeFantasia}<br>
          <strong>CNPJ:</strong> ${empresa.cnpj}<br>
          <strong>Endereço:</strong> ${empresa.endereco}, ${empresa.cidade} - ${empresa.uf}, ${empresa.cep}<br>
          <strong>Email:</strong> ${empresa.email}<br>
          <strong>Telefone:</strong> ${empresa.telefone}
        </div>`
                )
                .join('')
            : '<p class="text-muted text-center">Nenhuma empresa cadastrada.</p>'
        }
      </div>
      <script>
        function aplicarMascara(input, tipo) {
          let valor = input.value.replace(/\\D/g, ''); // Remove tudo que não é número
          if (tipo === 'cnpj') {
            valor = valor.replace(/(\\d{2})(\\d)/, '$1.$2');
            valor = valor.replace(/(\\d{3})(\\d)/, '$1.$2');
            valor = valor.replace(/(\\d{3})(\\d)/, '$1/$2');
            valor = valor.replace(/(\\d{4})(\\d)/, '$1-$2');
          } else if (tipo === 'cep') {
            valor = valor.replace(/(\\d{5})(\\d)/, '$1-$2');
          } else if (tipo === 'telefone') {
            valor = valor.replace(/(\\d{2})(\\d)/, '($1) $2');
            valor = valor.replace(/(\\d{5})(\\d)/, '$1-$2');
          }
          input.value = valor;
        }
      </script>
    </body>
    </html>
  `;
}
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
