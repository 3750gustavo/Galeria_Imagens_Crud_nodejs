# Galeria (CRUD) de imagens com Node.js, Express, Multer e Bootstrap

Este é um projeto simples de uma galeria de imagens que permite:

* Listar todas as imagens
* Abrir uma imagem para visualização em tela cheia
* Fazer upload de novas imagens
* Excluir uma imagem
* Navegar entre as imagens com setas ou botão aleatório

## Pré-requisitos

* Node.js
* npm

## Instalação

### Backend

1. Clone este repositório
2. Acesse a pasta Backend (`cd Backend`)
3. Instale as dependências:
    ```bash
    npm ci
    ```
    se estiver na raiz do projeto, use:
    ```bash
    npm ci --prefix Backend
    ```
4. Execute `node server.js` se estiver dentro da pasta Backend, ou use:
    ```bash
    node Backend/server.js
    ```

O servidor será iniciado na porta 3000 em todos os endereços de IP da sua máquina (pode hostear no seu pc e acessar pelo celular por exemplo).

### Frontend

Você pode copiar a pasta Frontend para o seu celular ou dispositivo que quiser testar a interface.

**no arquivo script.js troque o ip na primeira linha pelo seu pc onde estiver rodando o servidor**

Os arquivos são:

* index.html
* style.css
* script.js

Para visualizar a página, abra o arquivo index.html diretamente no navegador.

**No celular basta ir até a pasta com os arquivos no seu gerenciador de arquivos e clicar no index.html e em seguida compartilhar pra abrir no seu navegador favorito.**

## Tecnologias utilizadas

* Node.js (Express)
* Multer (para lidar com upload de arquivos)
* Bootstrap (CSS e JavaScript)
* jQuery (para manipulação do DOM e AJAX)

## Atenção

Este projeto é apenas um exemplo básico e não deve ser utilizado em produção sem as devidas melhorias em termos de segurança e otimizações.

Não há autenticação ou autorização, qualquer pessoa que acessar o endereço IP da sua máquina terá acesso às funcionalidades do sistema.

Além disso, os arquivos são armazenados diretamente no disco do servidor, o que pode ser ineficiente para um grande número de imagens.

## Autor
Gustavo Rossoni Corrêa De Barros

## Licença
Este projeto foi lançado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.