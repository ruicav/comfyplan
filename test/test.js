var assert = require('assert');
const validation = require('../index');

var assert = require('assert');
describe('Schema test', function() {
  describe('Validations', function() {
    const row = {
      'RA_Report #': '65325',
      'RA_CAERS Created Date': '1/1/2004',
      'AEC_Event Start Date': '8/4/2003',
      'PRI_Product Role': 'Suspect',
      'PRI_Reported Brand/Product Name': 'MIDWEST COUNTRY FAIR CHOCOLATE FLAVORED CHIPS',
      'PRI_FDA Industry Code': '3',
      'PRI_FDA Industry Name': 'Bakery Prod/Dough/Mix/Icing',
      'CI_Age at Adverse Event': '2',
      'CI_Age Unit': 'Year(s)',
      CI_Gender: 'Female',
      'AEC_One Row Outcomes':
        'VISITED AN ER, VISITED A HEALTH CARE PROVIDER, REQ. INTERVENTION TO PRVNT PERM. IMPRMNT., HOSPITALIZATION',
      'SYM_One Row Coded Symptoms': 'SWELLING FACE, RASH, WHEEZING, COUGH, HOSPITALISATION, DYSPNOEA'
    };

    it('Column with INVALID MIN value', function() {
      const schema = {
        'RA_Report #': [{ type: 'min', value: 65326 }]
      };
      assert.equal(validation.isValid({ row, schema }), false);
    });

    it('Column with INVALID MAX value', function() {
      const schema = {
        'RA_Report #': [{ type: 'max', value: 65324 }]
      };
      assert.equal(validation.isValid({ row, schema }), false);
    });
  });
});
