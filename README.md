# comfyplan

Problema

Recebemos vários tipos de datasets com valores e formatos diferentes. Ao receber os dados é importante fazer uma validação preliminar para verificar inconsistências. Essa avaliação é feita manualmente. Gerando uma demora no processamento.

Solução

Criar um sistema web, que receberá o dataset em CSV e irá validar de forma automática. Ao receber os dados o validador lerá o schema onde estarão as regras de validação e irá validar os dados baseados nesse schema.

O schema será composto por: o nome do campo, o validador e uma mensagem de erro

Colunas
RA_Report #
RA_CAERS Created Date
AEC_Event Start Date
PRI_Product Role
PRI_Reported Brand/Product Name
PRI_FDA Industry Code
PRI_FDA Industry Name
CI_Age at Adverse Event
CI_Age Unit
CI_Gender
AEC_One Row Outcomes
SYM_One Row Coded Symptoms

---

docker build -t ruicav/comfy-api .

docker run -p 49160:3000 -d ruicav/comfy-api
