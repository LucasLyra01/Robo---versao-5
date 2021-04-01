var produtos = {
    skus:[{
        especificacao: {
            cor: "Azul",
            tamanho: "Queen"        
        },
        sku: 132
    }, {
        especificacao: {
            cor: "Branco",
            tamanho: "Queen"
        },
        sku: 133
    }]
};

var skuEncontrado = produtos.skus.find(sku => sku.especificacao.cor === 'Azul' && sku.especificacao.tamanho === 'Queen');

console.log(skuEncontrado);