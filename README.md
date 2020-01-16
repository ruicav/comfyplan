# comfyplan (API)

### docker build -t ruicav/comfy-api .

### docker run -p 49160:3000 -d ruicav/comfy-api

Problema

Recebemos vários tipos de datasets com valores e formatos diferentes. Ao receber os dados é importante fazer uma validação preliminar para verificar inconsistências. Essa avaliação é feita manualmente. Gerando uma demora no processamento.

Solução

Criar um sistema web, que receberá o dataset em CSV e irá validar de forma automática. Ao receber os dados o validador lerá o schema onde estarão as regras de validação e irá validar os dados baseados nesse schema.

O schema será composto por: o nome do campo, o validador e uma mensagem de erro

---


