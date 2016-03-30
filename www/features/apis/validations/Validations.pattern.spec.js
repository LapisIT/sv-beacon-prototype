'use strict';

describe('Service: Validations', function () {

  // load the service's module
  beforeEach(module('svBeaconApis'));

  // instantiate service
  var Validations;
  beforeEach(inject(function (_Validations_) {
    Validations = _Validations_;
  }));

  var correct = 'hiroki.gota@spatialvision.com.au',
    incorrect = 'h@@com',
    number1 = 3,
    decimal1 = 3.5,
    decimal2 = 3.51,
    character1 = '-',
    character2 = '12a',

  //Invalid passwords
    lessThan8CharPassword = 'RMS_123', onlyNumberPass = '12341234', onlyUpperCaseLetterPass = 'ABCDEFGHKLM',
    onlyLowerCaseLetterPass = 'abcdefghklmn', onlyLowerNUpperCaseLetterPass = 'ABCDefghkl', onlySpecialCharPass = '!@#$%^&*()',

  //Valid passwords
    validPassOnlyUpperCase = 'RMS12345', validPassOnlyLowerCase = 'rms12345', validPassUpperNLowerCase = 'Abc12345',
    validPassUpperNLowerCaseNSpecialChar = 'ABC_abc_&123', validPassUpperCaseNSpecialChar = 'ABC%_&123', validPassLowerCaseNSpecialChar = 'abc%_&123',
    validPassLowerCaseNSpecialCharNumericStart = '123abc%_&123', validPassLowerCaseNSpecialCharNumericStartEndWithLetter = '123abc%_&123ABC',
    validPassStartWithSpecialChar = '&^123_df_AAA',
    validEmail = 'parham@sv.com', validEmailWithApostropheInUsername = "par'ham@sv.com", validEmailWithApostropheInDomain = "parham@s'v.com";

    it('email pattern should return true for ' + correct, function () {
    expect(Validations.patterns.email.test(correct)).toBeTruthy();
  });

  it('email pattern should return false for ' + incorrect, function () {
    expect(Validations.patterns.email.test(incorrect)).toBeFalsy();
  });

  it('number pattern should return true for ' + number1, function () {
    expect(Validations.patterns.integer.test(number1)).toBeTruthy();
  });

  it('decimal1 pattern should return true for ' + decimal1, function () {
    expect(Validations.patterns.decimal1.test(decimal1)).toBeTruthy();
  });

  it('decimal1 pattern should return false for ' + character1, function () {
    expect(Validations.patterns.decimal1.test(character1)).toBeFalsy();
  });

  it('decimal1 pattern should return false for ' + character2, function () {
    expect(Validations.patterns.decimal1.test(character2)).toBeFalsy();
  });

  it('decimal1 pattern should return false for ' + decimal2, function () {
    expect(Validations.patterns.decimal1.test(decimal2)).toBeFalsy();
  });

  it('decimal1 pattern should return true for ' + decimal2, function () {
    expect(Validations.patterns.decimal2.test(decimal2)).toBeTruthy();
  });

  var val0_1 = 0.1, val99 = 99.9, val100 = 100, val0_0 = 0.0;

  it('decimal1 pattern should return true for ' + val0_1, function () {
    expect(Validations.patterns.size.test(val0_1)).toBeTruthy();
  });

  it('decimal1 pattern should return true for ' + val99, function () {
    expect(Validations.patterns.size.test(val99)).toBeTruthy();
  });

  it('decimal1 pattern should return true for ' + val100, function () {
    expect(Validations.patterns.size.test(val100)).toBeFalsy();
  });

  it('password pattern should return false for ' + lessThan8CharPassword, function () {
    expect(Validations.patterns.password.test(lessThan8CharPassword)).toBeFalsy();
  });

  it('password pattern should return false for ' + onlyNumberPass, function () {
    expect(Validations.patterns.password.test(onlyNumberPass)).toBeFalsy();
  });

  it('password pattern should return false for ' + onlyUpperCaseLetterPass, function () {
    expect(Validations.patterns.password.test(onlyUpperCaseLetterPass)).toBeFalsy();
  });

  it('password pattern should return false for ' + onlyLowerCaseLetterPass, function () {
    expect(Validations.patterns.password.test(onlyLowerCaseLetterPass)).toBeFalsy();
  });

  it('password pattern should return false for ' + onlyLowerNUpperCaseLetterPass, function () {
    expect(Validations.patterns.password.test(onlyLowerNUpperCaseLetterPass)).toBeFalsy();
  });

  it('password pattern should return false for ' + onlyLowerNUpperCaseLetterPass, function () {
    expect(Validations.patterns.password.test(onlyLowerNUpperCaseLetterPass)).toBeFalsy();
  });

  it('password pattern should return false for ' + onlySpecialCharPass, function () {
    expect(Validations.patterns.password.test(onlySpecialCharPass)).toBeFalsy();
  });

  it('password pattern should return true for ' + validPassOnlyUpperCase, function () {
    expect(Validations.patterns.password.test(validPassOnlyUpperCase)).toBeTruthy();
  });

  it('password pattern should return true for ' + validPassOnlyLowerCase, function () {
    expect(Validations.patterns.password.test(validPassOnlyLowerCase)).toBeTruthy();
  });

  it('password pattern should return true for ' + validPassUpperNLowerCase, function () {
    expect(Validations.patterns.password.test(validPassUpperNLowerCase)).toBeTruthy();
  });

  it('password pattern should return true for ' + validPassUpperNLowerCaseNSpecialChar, function () {
    expect(Validations.patterns.password.test(validPassUpperNLowerCaseNSpecialChar)).toBeTruthy();
  });

  it('password pattern should return true for ' + validPassUpperCaseNSpecialChar, function () {
    expect(Validations.patterns.password.test(validPassUpperCaseNSpecialChar)).toBeTruthy();
  });

  it('password pattern should return true for ' + validPassLowerCaseNSpecialChar, function () {
    expect(Validations.patterns.password.test(validPassLowerCaseNSpecialChar)).toBeTruthy();
  });

  it('password pattern should return true for ' + validPassLowerCaseNSpecialCharNumericStart, function () {
    expect(Validations.patterns.password.test(validPassLowerCaseNSpecialCharNumericStart)).toBeTruthy();
  });

  it('password pattern should return true for ' + validPassLowerCaseNSpecialCharNumericStartEndWithLetter, function () {
    expect(Validations.patterns.password.test(validPassLowerCaseNSpecialCharNumericStartEndWithLetter)).toBeTruthy();
  });

  it('password pattern should return true for ' + validPassStartWithSpecialChar, function () {
    expect(Validations.patterns.password.test(validPassStartWithSpecialChar)).toBeTruthy();
  });

  it('email pattern should return true for ' + validEmail, function () {
    expect(Validations.patterns.password.test(validEmail)).toBeTruthy();
  });

  it('email pattern should return true for ' + validEmailWithApostropheInUsername, function () {
    expect(Validations.patterns.password.test(validEmailWithApostropheInUsername)).toBeTruthy();
  });

  it('email pattern should return false for ', function () {
    expect(Validations.patterns.email.test(validEmailWithApostropheInDomain)).toBeFalsy();
  });

//  it('decimal1 pattern should return true for ' + val0_0, function () {
//    expect(Validations.patterns.size.test(val0_0)).toBeFalsy();
//  });


});
