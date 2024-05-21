const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    name: { type: String, required: true},
    age: { type: Number, required: true},
    cpf: { type: String, required: true},
    phone: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true}
});

// Sempre que eu fizer alterações em base de dados eu preciso trabalhar com promisses
// aqui estamos utilizando async e await em nossas promisses
// e, sempre que usarmos async e await devemos envolver o await em um bloco try / catch, pois sem o bloco podemos deixar promessas sem resolver e o programa pode parar de funcionar

const LoginModel = mongoose.model('Login', LoginSchema); // trabalhamos com promisse pois isto me retorna uma promisse 

class Login {
    constructor(body){
        this.body = body;
        this.errors = []; // se tivermos algum erro aqui dentro não podemos cadastrar o usuário da base de dados
        this.user = null;
    }

    async login(){
        this.validaLogin();
        if(this.errors.length > 0) return;

        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user) {
            this.errors.push('Usuário não existe.')
            return;
        }
        
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha inválida');
            this.user = null;
            return
        }
    }

    async register(){
        this.valida();
        if(this.errors.length > 0) return;

        await this.userExists();

        if(this.errors.length > 0) return; // temos que chamar esta condição novamente pq o método acima também pode adicionar novos errors

        const salt = bcryptjs.genSaltSync(); // conteúdo da documentação - proteger a senha no banco de dados
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        // se passar do this.valida() e do if acima, inserimos o usuário na base de dados da seguinte forma:
        this.user = await LoginModel.create(this.body);
       
        // como aqui estamos trabalhando com promisse (async await) tudo que ele me retorna também é uma promisse
        // e, como este método é utilizado em nosso loginController (exports.register), preciso adicionar async e await nele também 
    }

    async userExists() { // método para verificar se o email de novo cadastro já existe na base de dados
        this.user = await LoginModel.findOne({ email: this.body.email });
        if(this.user) this.errors.push('Este e-mail já possui cadastro.')
    }

    validaLogin(){
        this.cleanUp();
        if(!validator.isEmail(this.body.email)) this.errors.push('Insira um e-mail válido.')
        // A senha precisa ter entre 6 e 12 caracteres
        if(this.body.password.length < 6 || this.body.password.length > 12) {
            this.errors.push('A senha precisa ter entre 6 e 12 caracteres')
        }
    }

    valida(){
        this.cleanUp();
        // Validação
        if(this.body.name === '') this.errors.push('Por favor, nos informe seu nome.')
        if(this.body.age === '') this.errors.push('Por favor, nos informe sua idade.')
        this.validaCpf();
        if(this.body.phone === '') this.errors.push('Por favor, nos informe um número de telefone para eventual contato.')
        // O e-mail precisa ser válido
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
        // A senha precisa ter entre 6 e 12 caracteres
        if(this.body.password.length < 6 || this.body.password.length > 12) {
            this.errors.push('A senha precisa ter entre 6 e 12 caracteres')
        }
    }

    cleanUp(){ // vai fazer um for nas chaves do meu body e vai garantir que tudo que está dentro do meu body é uma string
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string'){ // se em algum dos campos do formulários tiver algo que não for uma string, vamos converter a uma string vazia
                this.body[key] = '';
            }
        }

        // garantir que só temos os campos que a gente precisa neste model: 
        // ex: tirar o csrf token para não salvar na base de dados
        this.body = {
            name: this.body.name ? this.body.name.trim() : '',
            age: this.body.age ? this.body.age.trim() : '',
            cpf: this.body.cpf ? this.body.cpf.trim() : '',
            phone: this.body.phone ? this.body.phone.trim() : '',
            email: this.body.email ? this.body.email.trim() : '',
            password: this.body.password ? this.body.password.trim() : ''
    };
    }
    
    validaCpf(){
        const cpf = this.body.cpf;

        const number = cpf.replace(/\./g, '').replace(/-/g, '').slice(0, 9);
        
        function primeiroDigito(number) {
            let total = 0
            for (let i = 0; i < 9; i++){
               total += number[i] * [10 - i];
            }
            let valorDigito1 = 11 - (total % 11)
            return (valorDigito1 > 9) ? 0 : valorDigito1;
        }
        
        function segundoDigito(number) {
            const segundoNumber = number.concat(primeiroDigito(number))
            let total2 = 0
            for (let i = 0; i < 10; i++){
               total2 += segundoNumber[i] * [11 - i];
            }
            let valorDigito2 = 11 - (total2 % 11)
            return (valorDigito2 > 9) ? 0 : valorDigito2;
        }

        const lastNumbers = (number.concat(primeiroDigito(number)).concat(segundoDigito(number))).slice(9,11)
            
        if(cpf.slice(-2) !== lastNumbers){
            this.errors.push('CPF inválido')
        }
    }
}

module.exports = Login;