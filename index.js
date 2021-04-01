const IQOption = require('./lib');

var logado = false;

var conta_real_practice = "PRACTICE";

const email_digitado = ""
const senha_digitada = ""

const paridades = [
    'EURUSD'
]

const dias = 10;
const porcentagem = 80;
const timeframe = 5;

var porct_call = porcentagem
var porct_put = (100 - porcentagem)

// CRIANDO CONEXÃO E AUTENTICANDO COM O LOGIN

IQOption({
    email: email_digitado,
    password: senha_digitada
}).then(async API => {

    logado = true;

    console.log("Logado com sucesso");

    // SETANDO CONTA PARA A CONTA DE TREINAMENTO
    API.setBalance(conta_real_practice);

    // PEGANDO DADOS DESNECESSÁRIOS MAS QUE SÃO INFORMAÇÕES DA CONTA DO USUÁRIO
    dados_conta = await API.getBalance(conta_real_practice);
    moeda = dados_conta['currency'];
    valor_banca = dados_conta['amount'];
    console.log(moeda, valor_banca);

    // CHAMANDO A FUNÇÃO COMPLETA ONDE VAI CHAMAR TODOS OS OUTROS COMANDOS DO CÓDIGO
    if (logado == true){
        operando(API);
    }

}).catch(err => {
    console.error(err);
});

async function operando(API){

    // FUNÇÃO QUE VAI EXECUTAR TUDO

        try {
            
            async function cataloga(par, dias, porct_call, porct_put, timeframe){

                // FUNÇÃO QUE VERIFICA 

                let data = [];
                let datas_testadas = [];
                let time_ = Date.now();
                let sair = false;

                let contador = 0

                while (sair == false) {

                    // CHAMANDO AS VELAS (CANDLESTICKS) DA PLATAFORMA COM AS INFORMAÇÕES
                    // AS INFORMAÇÕES RECEBIDAS SÃO: MAX, MIN, VOLUME, ABERTURA, FECHAMENTO, HORARIO
                    let velas = await API.getCandles(par, (timeframe * 60), 1000, time_);
                    
                    for (let x in velas) {

                        // CONVERTENDO O HORÁRIO QUE É RECEBIDO EM TIMESTAMP 
                        // PARA O HORARIO NO QUAL USAMOS
                        let data_completa = await new Date(velas[x]['from'] * 1000);
                        data_completa = data_completa.toLocaleDateString();
                        
                        // AQUI A FUNÇÃO INCLUDES() VERIFICA SE A VAR. "DATA_COMPLETA" ESTÁ DENTRO
                        // DO VETOR "DATAS_TESTADAS" PARA QUE POSSA SER ADICIONADA
                        // QUANDO NÃO POSSUI NENHUM ELEMENTO IGUAL A FUNÇÃO RETORNA FALSE, CASO CONTRÁRIO, RETORNA TRUE
                        if (datas_testadas.includes(data_completa) == false) {
                            await datas_testadas.push(data_completa);
                        }

                        // AQUI VERIFICA SE A QUANTIDADE DAS POSIÇÕES DENTRO DO VETOR "DATAS_TESTADAS"
                        // É SUPERIOR A QUANTIDADE DE DIAS QUE FOI INFORMADA LOGO NO COMEÇO DO CÓDIGO
                        // PARA QUE O CÓDIGO POSSA RECEBER AS INFORMAÇÕES DENTRO DO ELSE E FINALIZAR O WHILE
                        if (datas_testadas.length <= dias) {
                            
                            if (velas[x]['open'] < velas[x]['close']){
                                velas[x]['cor'] = 'verde';
                            }else if (velas[x]['open'] > velas[x]['close']){
                                velas[x]['cor'] = 'vermelha';
                            }else{
                                velas[x]['cor'] = 'doji';
                            }
                            
                            // CRIANDO UMA POSIÇÃO DENTRO DO VETOR DE VELAS CHAMADO "COR" E ATRIBUINDO UM VALOR AO MESMO
                            data.push(velas[x]);

                        }else{
                            // INFORMAÇÃO NECESSÁRIA PARA QUE O WHILE POSSA SER FINALIZADO
                            sair = true;
                            break
                        }
                    }
                    // **************************************************************** //
                    // PARTE MAIS IMPORTANTE DO CÓDIGO
                    // AQUI É ARMAZENADO O HORÁRIO DAS VELAS PARA SEGUIR NO PRÓXIMO WHILE
                    // E QUE FAZ A PARTE MAIS IMPORTANTE DO CÓDIGO QUE É PEGAR 
                    // AS VELAS DOS OUTROS DIAS TAMBÉM
                    
                    time_ = (velas[0]['from'] - 1)

                    // **************************************************************** //
                    // **************************************************************** //
                    // **************************************************************** //

                }

                let analise = [];

                for (let velas in data) {

                    // CONVERTENDO A DATA QUE ESTÁ EM TIMESTAMP NOVAMENTE PARA HORÁRIO NORMAL
                    let new_date = await new Date(data[velas]['from'] * 1000);

                    // console.log(data[velas]);
                    // SEPARANDO HORAS E MINUTOS PARA FAZER COMPARAÇÕES MAIS A FRENTE
                    let horas = new_date.getHours();
                    let minutos = new_date.getMinutes();

                    // JUNTANDO HORA E MINUTOS PARA FAZER AS COMPARAÇÕES
                    var horario = horas + ":" + minutos;
                    
                    // A FUNÇÃO INCLUDES VERIFICA SE TEM O HORARIO DENTRO DO VETOR "ANALISE"
                    // 
                    if (analise.includes(horario) == false) {
                        // ADICIONA ESSAS POSIÇÕES DENTRO DO VETOR ANÁLISE PARA CONTABILIZAÇÃO DOS DADOS
                        analise[horario] = {verde: 0, vermelha: 0, doji: 0, '%': 0, dir: ''};
                        console.log("primeiro entra aqui");
                        
                    }
                    
                    

                    // SOMA O VALOR DENTRO DO VETOR PARA CONTABILIZAR OS DADOS
                    // SE A COR VERDE FOR SE REPETIR ELE SOMA +1 PARA CONTABILIZAR
                    analise[horario][data[velas]['cor']] += 1
                    // console.log(analise.horario);

                    // 
                    try {
                        console.log("Segundo enrta aqui");
                        analise[horario]['%'] = (100 * (analise[horario]['verde'] / (analise[horario]['verde'] + analise[horario]['vermelha'] + analise[horario]['doji'])))
                    } catch (error) {
                        console.log(error);
                    }
                }

                for (let horario in analise){
                    console.log("Terceito entra aqui");
                    if (analise[horario]['%'] > 50){
                        analise[horario]['dir'] = "CALL";
                    }

                    if (analise[horario]['%'] < 50) {
                        analise[horario]['%'] = 100 - analise[horario]['%']
                        analise[horario]['dir'] = 'PUT'
                    }
                }

                // console.log(analise);

                return analise;

            }

            let catalogacao = [];

            for (let par in paridades){
                console.log("Catalogando " + par);

                catalogacao['par'] = await cataloga(paridades[par], dias, porct_call, porct_put, timeframe);

                console.log(catalogacao);
            }

            // cataloga("EURUSD", dias, porct_call, porct_put, timeframe);

        } catch (err) {
            console.error(err);
        }


}