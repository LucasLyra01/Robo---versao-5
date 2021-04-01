const vetor = [
    {name: "Lucas", apelido: "Lyra"},
    {name: "Vinicius", apelido: "Tricolor"}
];

var ByName = function(objeto){
    return objeto.name;
}

console.log(vetor.map(ByName));