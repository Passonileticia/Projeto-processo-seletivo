const $stepText = $('#step-text');
const $stepDescription = $('#step-description');
const $stepOne = $('.step.one');
const $stepTwo = $('.step.two');
const $stepThree = $('.step.three');
const $title = $('#title');
const $containerBtnFormOne = $('#containerBtnFormOne');
const $btnFormOne = $('#btnFormOne');
const $containerBtnFormTwo = $('#containerBtnFormTwo');
const $btnFormTwo = $('#btnFormTwo');
const $containerBtnFormThree = $('#containerBtnFormThree');
const $btnFormThree = $('#btnFormThree');
const $inputNome = $('#nome');
const $inputSobrenome = $('#sobrenome');
const $inputDataNascimento = $('#dataNascimento');
const $inputEmail = $('#email');
const $inputMinibio = $('#minibio');
const $inputEndereco = $('#endereco');
const $inputComplemento = $('#complemento');
const $inputCidade = $('#cidade');
const $inputCep = $('#cep');
const $inputHabilidades = $('#habilidades');
const $inputPontosFortes = $('#pontosFortes');

let nomeValido = false;
let sobrenomeValido = false;
let dataNascimentoValido = false;
let emailValido = false;
let enderecoValido = false;
let cidadeValida = false;
let cepValido = false;
let habilidadesValido = false;
let pontosFortesValido = false;

const minLehgthText = 2;
const minLengthTextArea = 10; 
const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const cepRegex = /^([\d]{2})([\d]{3})([\d]{3})|^[\d]{2}.[\d]{3}-[\d]{3}/;

function validarInput(element, minLength, maxLength,regex) {
    const closest = $(element).closest('.input-data');
    if (!element.value 
        || (minLength && element.value.trim().length < minLength)
        || (maxLength && element.value.trim().length > maxLength)
        || (regex && !element.value.toLowerCase().match(regex))
        ) {
    closest.addClass('error');
    return false;
  }
 closest.removeClass('error');
  return true;
}

function validaFormularioUm(){
    if(nomeValido && sobrenomeValido && emailValido && dataNascimentoValido){
$containerBtnFormOne.removeClass('disabled');
$btnFormOne.removeClass('disabled');
$btnFormOne.off('click').on('click', iniciarFormulario2);
    }else{
        $containerBtnFormOne.addClass('disabled');
        $btnFormOne.addClass('disabled');
        $btnFormOne.off('click');
    }
}

function iniciarFormulario2(){
$stepText.text('Passo 2 de 3 - Dados de correspondencia');
$stepDescription.text('Precisamos desses dados para que possamos entrar em contato se necesario.');
$stepOne.hide();
$stepTwo.show();

$inputEndereco.keyup(function(){
    endecoValido = validarInput(this, minLengthTextArea);
    validarFormularioDois();
    });

$inputCidade.keyup(function(){
cidadeValida = validarInput(this, minLengthText);
validarFormularioDois();
});

$inputCep.keyup(function(){
    this.value = this.value.replace(/\D/g,'');
    cepValido = validarInput(this, null, null, cepRegex);   
if(cepValido){
    this.value = this.value.replace(cepRegex,"$1.$2-$3");
}
validarFormularioDois();
});

$inputComplemento.keyup(function(){
validarFormularioDois();
});
}

function validarFormularioDois(){
    if(enderecoValido && cidadeValida && cepValido){
$containerBtnFormTwo.removeClass('disabled');
$btnFormTwo.removeClass('disabled');
$btnFormTwo.off('click').on('click', iniciarFormulario3); 
}else{
    $containerBtnFormTwo.addClass('disabled');
    $btnFormTwo.addClass('disabled'); 
    $btnFormTwo.off('click');
 }
}

function iniciarFormulario3(){
    $stepText,text('Passo 3 de 3 - Fale sobre você');
    $stepDescription.text('Para que possamos filtrar melhor você no processo, continos um pouco mais sobre suas habilidades e pontos positivos.');
$stepTwo.hide();
$stepThree.show();

$inputHabilidades.keyup(function(){
    habilidadesValido = validarInput(this,minLehgthText);
    validarFormularioTres();
});

$inputPontosFortes.keyup(function(){
pontosFortesValido = validarInput(this,minLehgthText);
validarFormularioTres();
})
}

async function salvarNoTrello(){
try{
 const nome = $inputNome.val();
 const sobrenome = $inputSobrenome.val();
 const email = $inputEmail.val();
 const dataNascimento = $inputDataNascimento.val();
 const minibio = $inputMinibio.val();
 const endereço = $inputEndereco.val();
 const complemento = $inputComplemento.val();
 const cidade = $inputCidade.val();
 const cep = $inputCep.val();
 const habilidades = $inputHabilidades.val();
 const pontosFortes = $inputPontosFortes.val();

 if(!nome || !sobrenomme || !email || !dataNascimento 
    || !endereco || !cidade || !cep || !habilidades 
    || !pontosFortes){
    return alert('Favor preencher todos os dados obrigatórios para seguir.');
 }

const body = {
    name: "Candidato - " + nome + " " + sobrenome,
     desc: `
     Seguem dados do candidato(a):

     ---------------------- Dados pessoais -------
     Nome: ${nome}
     Sobrenome: ${Sobrenome}
     Email: ${email}
     Data de nascimento: ${dataNascimento}
     Minibio: ${minibio}

  ---------------------- Dados de endereço -------
     Endereço: ${endereco}
     Complemento: ${complemento}
     Cidade: ${cidade}
     Cep: ${cep}
     
     ---------------------- Dados do candidato(a) -------
     Habilidade: ${habilidades}
     Pontos Fortes: ${pontosFortes}
     `
     }

 await fetch('https://api.trello.com/1/cards?idList=653ad60db44f13692424b8e7&key=71c748c773116e150c3df7652d58fc08&token=ATTA9d375c67f62f4f2b90286b4b42670f4866649bef1c8dc00c19e64b54ee8cd2d227A33162',{
    method: 'POST', 
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body) 
 });

 return finalizarFormulario();
}catch(e){
    console.log('Ocorreu erro ao salvar no Trello:', e);
}
} 

function validarFormularioTres(){
    if(habilidadesValido && pontosFortesValido){
$containerBtnFormThree.removeClass('disabled');
$btnFormThree.removeClass('disabled');
$btnFormThree.off('click').on('click', salvarNoTrello);
    }else{
        $containerBtnFormThree.addClass('disabled');
$btnFormThree.addClass('disabled');
$btnFormThree.off('click');
    }
}

function finalizarFormulario(){
    $stepThress.hide();
    $stepDescription.hide();
    $title.text('Inscrição realizada com sucesso!');
    $stepText.text('Agradecemos sua inscrição, entraremos em contato assim que possivel, nosso prazo de análise é de cinco dias úteis.');
}

function init() {
    $stepText.text('Passo 1 de 3 - Dados Pessoais');
    $stepDescription.text('Descreva seus dados para que possamos te conhecer melhor.');
    $stepTwo.hide();
    $stepThree.hide();
     
    $inputNome.keyup(function () {
      nomeValido = validarInput(this, minLengthText);
      validaFormularioUm();
      });
      
      $inputSobrenome.keyup(function () {
      sobrenomeValido = validarInput(this, minLengthText);
      validaFormularioUm();
        });
}
        
$inputDataNascimento.keyup(function () {
dataNascimentoValido = validarInput(this, minLengthText);
validaFormularioUm();
});

$inputDataNascimento.change(function () {
dataNascimentoValido = validarInput(this, minLengthText);    
validaFormularioUm();
});

        
$inputEmail.keyup(function () {
   emailValido = validarInput(this, null, null, emailRegex);
   validaFormularioUm();
    });
    
    $inputMinibio.keyup(function () {
        validaFormularioUm();
         });

$inputDataNascimento.on('blur', function () {
    if(!this.value) {
this.type = 'text';
    }
});

init();