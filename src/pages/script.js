let processoSelecionado;
let pressaoInicial;
let volumeInicial;
let temperaturaInicial;
let pressaoFinal;
let volumeFinal;
let temperaturaFinal;
let energiaInterna = 0;
let trabalho = 0;
let calor = 0;
let intervaloT = [];
let intervaloV = [];
let intervaloP = [];
var R = 0.08206;
var Cv = 12.47;
let fatorConversaoParaJoule = 101.35;

//Funções que calculam as variáveis PVT e parâmetros (U, q e w) nas etapas inicial e final do processo
function setarVariaveis() {
    pressaoInicial = !isNaN(parseFloat(document.getElementById("initial-pressure").value)) ? parseFloat(document.getElementById("initial-pressure").value) : 0;
    volumeInicial = !isNaN(parseFloat(document.getElementById("initial-volume").value)) ? parseFloat(document.getElementById("initial-volume").value) : 0;
    temperaturaInicial = !isNaN(parseFloat(document.getElementById("initial-temperature").value)) ? parseFloat(document.getElementById("initial-temperature").value) : null; //Temperatura em °C
    pressaoFinal = !isNaN(parseFloat(document.getElementById("final-pressure").value)) ? parseFloat(document.getElementById("final-pressure").value) : 0;
    volumeFinal = !isNaN(parseFloat(document.getElementById("final-volume").value)) ? parseFloat(document.getElementById("final-volume").value) : 0;
    temperaturaFinal = !isNaN(parseFloat(document.getElementById("final-temperature").value)) ? parseFloat(document.getElementById("final-temperature").value) : null; //Temperatura em °C
    processoSelecionado = document.querySelector('input[name="process"]:checked').value;

    console.log(processoSelecionado);
}

function zerarVariáveis() {
    pressaoInicial = null;
    volumeInicial = null;
    temperaturaInicial = null;
    pressaoFinal = null;
    volumeFinal = null;
    temperaturaFinal = null;
    intervaloT = [];
    intervaloV = [];
    intervaloP = [];

    document.getElementById("initial-pressure").value = pressaoInicial;
    document.getElementById("initial-volume").value = volumeInicial;
    document.getElementById("initial-temperature").value = temperaturaInicial;
    document.getElementById("final-pressure").value = pressaoFinal;
    document.getElementById("final-volume").value =  volumeFinal;
    document.getElementById("final-temperature").value = temperaturaFinal;
    
    atualizarGrafico();
}

function verificarProcesso() {
    if (processoSelecionado == "isotermico" && temperaturaFinal != temperaturaInicial && temperaturaInicial != null && temperaturaFinal != null) {
        temperaturaFinal = temperaturaInicial;
        pressaoFinal = ((R * (temperaturaFinal+273.15)) / volumeFinal).toPrecision(4);
        
        document.getElementById('final-temperature').value = temperaturaInicial;
        document.getElementById("final-pressure").value = pressaoFinal;
       
        return alert("Processos isotérmicos precisam ter valores iguais de temperatura. Temperatura final corrigida e pressão final recalculada.")

    } else if (processoSelecionado == "isovolumetrico" && volumeFinal!=volumeInicial && volumeInicial!=0 && volumeFinal!=0) {
        volumeFinal = volumeInicial;
        document.getElementById('final-volume').value  = volumeFinal;

        pressaoFinal = ((R * (temperaturaFinal+273.15)) / volumeFinal).toPrecision(4);
        document.getElementById('final-pressure').value = pressaoFinal;

        return alert("Processos isovolumétricos precisam ter valores iguais de volume. Volume final corrigido e pressão final recalculada.")

    } else if (processoSelecionado == "isobarico" && pressaoFinal!=pressaoInicial && pressaoInicial!=0 && pressaoFinal!=0) {
        pressaoFinal = pressaoInicial;
        document.getElementById('final-pressure').value = pressaoFinal;
            
        volumeFinal = ((R * (temperaturaFinal+273.15)) / pressaoFinal).toPrecision(4);
        document.getElementById('final-volume').value  = volumeFinal;

        return alert("Processos isobáricos precisam ter valores iguais de pressão. Pressão final corrigida e volume final recalculado.")
    }
}

function calcularVariavelInicial() {
    if (pressaoInicial!= 0 && volumeInicial!= 0 && temperaturaInicial!=null) {
        verificarProcesso();
        if (processoSelecionado == "isotermico") { //Não modificar temperaturas em processos isotérmicos, atualizar valor de pressão
            pressaoInicial = ((R * (temperaturaInicial+273.15)) / volumeInicial).toPrecision(4);
            document.getElementById("initial-pressure").value = pressaoInicial;
            return alert("É necessário que apenas duas variáveis tenham valores para ser possível calcular a terceira. Pressão inicial atualizada.");
        } else if (processoSelecionado == "isovolumetrico") { //Não modificar volumes em processos isovolumétricos, atualizar valor de pressão
            pressaoInicial = ((R * (temperaturaInicial+273.15)) / volumeInicial).toPrecision(4);
            document.getElementById("initial-pressure").value = pressaoInicial;
            return alert("É necessário que apenas duas variáveis tenham valores para ser possível calcular a terceira. Pressão inicial atualizada.");
        } else  { //Não modificar pressões em processos isobáricos, atualizar valor de volume
            document.getElementById('initial-volume').value = ((R * (temperaturaInicial+273.15)) / pressaoInicial).toPrecision(4);
            return alert("É necessário que apenas duas variáveis tenham valores para ser possível calcular a terceira. Volume inicial atualizado.");
        }
    } else if (pressaoInicial!= 0 && volumeInicial!= 0) {
        temperaturaInicial = (((pressaoInicial * volumeInicial) / R)-273.15).toPrecision(4);    
        document.getElementById('initial-temperature').value = temperaturaInicial;
    } else if (pressaoInicial!= 0 && temperaturaInicial!= null) {
        volumeInicial = ((R * (temperaturaInicial+273.15)) / pressaoInicial).toPrecision(4);
        document.getElementById('initial-volume').value = volumeInicial;
    } else if (volumeInicial != 0 && (temperaturaInicial+273.15) != 0) {
        pressaoInicial = ((R * (temperaturaInicial+273.15)) / volumeInicial).toPrecision(4);
        ;
        document.getElementById('initial-pressure').value = pressaoInicial;
    }
    
    verificarProcesso();
    calcularParametros();
}

function calcularVariavelFinal() {
    if (pressaoFinal != 0 && volumeFinal != 0 && (temperaturaFinal)!= null) {
        verificarProcesso();
        if (processoSelecionado == "isotermico") { //Não modificar temperaturas em processos isotérmicos, atualizar valor de pressão
            pressaoFinal = ((R * (temperaturaFinal+273.15)) / volumeFinal).toPrecision(4);
            document.getElementById("final-pressure").value = pressaoFinal;
            return alert("É necessário que apenas duas variáveis tenham valores para ser possível calcular a terceira. Pressão final atualizada.");
        
        } else if (processoSelecionado == "isovolumetrico") { //Não modificar volumes em processos isovolumétricos, atualizar valor de pressão
            pressaoFinal = ((R * (temperaturaFinal+273.15)) / volumeFinal).toPrecision(4);
            document.getElementById("final-pressure").value = pressaoFinal;
            return alert("É necessário que apenas duas variáveis tenham valores para ser possível calcular a terceira. Pressão final atualizada.");
        
        } else  { //Não modificar pressões em processos isobáricos, atualizar valor de volume
            document.getElementById('final-volume').value = ((R * (temperaturaFinal+273.15)) / pressaoFinal).toPrecision(4);
            return alert("É necessário que apenas duas variáveis tenham valores para ser possível calcular a terceira. Volume final atualizado.");
        }
    } else if (pressaoFinal != 0 && volumeFinal != 0) {
        temperaturaFinal = (((pressaoFinal * volumeFinal) / R)-273.15).toPrecision(4); 
        document.getElementById('final-temperature').value = temperaturaFinal;
    } else if (pressaoFinal != 0 && temperaturaFinal!= null) {
        volumeFinal = ((R * (temperaturaFinal+273.15)) / pressaoFinal).toPrecision(4);
        document.getElementById('final-volume').value = volumeFinal;
    } else if (volumeFinal != 0 && temperaturaFinal!= null) {
        pressaoFinal = ((R * (temperaturaFinal+273.15)) / volumeFinal).toPrecision(4);
        document.getElementById('final-pressure').value = pressaoFinal;
    }

    verificarProcesso();
    calcularParametros();
}

function calcularParametros() {
    if (pressaoFinal != 0 && volumeFinal != 0 && temperaturaFinal!= null && pressaoInicial != 0 && volumeInicial != 0 && temperaturaInicial!= null) {
        if (processoSelecionado == "isotermico") {
            let div = volumeFinal / volumeInicial;
            energiaInterna = 0;
            trabalho = (-R*(temperaturaInicial+273.15)*Math.log(div)*fatorConversaoParaJoule).toPrecision(4);
            calor = -trabalho;
    
            const infoEnergiaInterna = document.getElementById("U");
            const infoTrabalho = document.getElementById("w");
            const infoCalor = document.getElementById("q");
    
            infoEnergiaInterna.innerHTML = '<p style="margin: 0px; padding: 0px;">'+energiaInterna+'</p>';
            infoTrabalho.innerHTML = '<p style="margin: 0px; padding: 0px;">'+trabalho+'</p>';
            infoCalor.innerHTML = '<p style="margin: 0px; padding: 0px;">'+calor+'</p>';
    
        } else if (processoSelecionado == "isovolumetrico") {
            trabalho = 0;
            calor = (Cv*(temperaturaFinal-temperaturaInicial)).toPrecision(4);
            energiaInterna = calor;
    
            const infoEnergiaInterna = document.getElementById("U");
            const infoTrabalho = document.getElementById("w");
            const infoCalor = document.getElementById("q");
    
            infoEnergiaInterna.innerHTML = '<p style="margin: 0px; padding: 0px;">'+energiaInterna+'</p>';
            infoTrabalho.innerHTML = '<p style="margin: 0px; padding: 0px;">'+trabalho+'</p>';
            infoCalor.innerHTML = '<p style="margin: 0px; padding: 0px;">'+calor+'</p>';
            
        } else if (processoSelecionado == "isobarico") {
            energiaInterna = (Cv*(temperaturaFinal-temperaturaInicial)).toPrecision(4);
            trabalho = (-pressaoInicial*(volumeFinal-volumeInicial)*fatorConversaoParaJoule).toPrecision(4);
            calor = (energiaInterna - trabalho).toPrecision(4);
    
            const infoEnergiaInterna = document.getElementById("U");
            const infoTrabalho = document.getElementById("w");
            const infoCalor = document.getElementById("q");
    
            infoEnergiaInterna.innerHTML = `<p style="margin: 0px; padding: 0px;">${energiaInterna}</p>`;
            infoTrabalho.innerHTML = `<p style="margin: 0px; padding: 0px;">${trabalho}</p>`;
            infoCalor.innerHTML = `<p style="margin: 0px; padding: 0;">${calor}</p>`;
        }
    } else {
        const infoEnergiaInterna = document.getElementById("U");
        const infoTrabalho = document.getElementById("w");
        const infoCalor = document.getElementById("q");
    
        infoEnergiaInterna.innerHTML = `<p style="margin: 0px; padding: 0px;">0</p>`;
        infoTrabalho.innerHTML = `<p style="margin: 0px; padding: 0px;">0</p>`;
        infoCalor.innerHTML = `<p style="margin: 0px; padding: 0px;">0</p>`;
    }
}

function atualizarGrafico() {
    chartPV.updateSeries([{ data: intervaloP }]);
    chartPV.updateOptions({ xaxis: { categories: intervaloV.map(String) } });

    chartPT.updateSeries([{ data: intervaloP }]);
    chartPT.updateOptions({ xaxis: { categories: intervaloT.map(String) } });

    chartVT.updateSeries([{ data: intervaloV }]);
    chartVT.updateOptions({ xaxis: { categories: intervaloT.map(String) } });
}

function prepararDados() {
    if (pressaoFinal && volumeFinal && pressaoInicial && volumeInicial) {
        intervaloT = [];
        intervaloV = [];
        intervaloP = [];
        if (temperaturaFinal==temperaturaInicial) { //Gráfico PV
            let incrementoV = Math.abs((volumeFinal - volumeInicial)/15);
            for (let i = 0; i < 16; i += 1) {
                intervaloT.push(temperaturaInicial);

                let volumeStart = volumeInicial > volumeFinal ? volumeFinal : volumeInicial;
                let volumeCalculado = (volumeStart + i*incrementoV);
                intervaloV.push((volumeCalculado.toPrecision(4)));
                
                let pressaoCalculada = ((R*(temperaturaInicial+273.15))/(volumeCalculado)).toPrecision(4);
                intervaloP.push(pressaoCalculada);
            }
        } else if (volumeFinal==volumeInicial) { //Gráfico PT
            let incrementoT = Math.abs((temperaturaFinal - temperaturaInicial)/15);
            for (let i = 0; i < 16; i += 1) {
                intervaloV.push(volumeInicial);

                let temperaturaStart = temperaturaInicial > temperaturaFinal ? temperaturaFinal : temperaturaInicial;
                let temperaturaCalculada = (temperaturaStart + i*incrementoT);
                intervaloT.push((temperaturaCalculada.toPrecision(4)));

                let pressaoCalculada = ((R*(temperaturaCalculada+273.15))/(volumeInicial)).toPrecision(4);
                intervaloP.push(pressaoCalculada);
            }
        } else if (pressaoFinal==pressaoInicial) { //Gráfico VT
            let incrementoT = Math.abs((temperaturaFinal - temperaturaInicial)/15);
            for (let i = 0; i < 16; i += 1) {
                intervaloP.push(pressaoInicial);

                let temperaturaStart = temperaturaInicial > temperaturaFinal ? temperaturaFinal : temperaturaInicial;
                let temperaturaCalculada = (temperaturaStart + i*incrementoT);
                intervaloT.push((temperaturaCalculada.toPrecision(4)));

                let volumeCalulado = ((R*(temperaturaCalculada+273.15))/(pressaoInicial)).toPrecision(4);
                intervaloV.push(volumeCalulado);
            }
            console.log("entrou no isobarico")
        }
        atualizarGrafico();
    }
     
}

const optionsPV = {
    chart: {
        type: 'line',
        height: 350
    },
    series: [{
        name: 'Dados',
        data: intervaloP
    }],
    xaxis: {
        categories: ["1", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50"],
        title: {
            text: 'Volume (L)'
        }
    },
    yaxis: {
        title: {
            text: 'Pressão (atm)'
        }
    },
    grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
    },
    title: {
        text: 'Gráfico PxV',
        align: 'center'
    }
};

const optionsPT = {
    chart: {
        type: 'line',
        height: 350
    },
    series: [{
        name: 'Dados',
        data: intervaloP
    }],
    xaxis: {
        categories: ['0', '25', '50', '75', '100', '125', '150', '175', '200', '225', '250', '275', '300'],
        title: {
            text: 'Temperatura (°C)'
        }
    },
    yaxis: {
        title: {
            text: 'Pressão (atm)'
        }
    },
    grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
    },
    title: {
        text: 'Gráfico PxT',
        align: 'center'
    }
};

const optionsVT = {
    chart: {
        type: 'line',
        height: 350
    },
    series: [{
        name: 'Dados',
        data: intervaloV
    }],
    xaxis: {
        categories: ['0', '25', '50', '75', '100', '125', '150', '175', '200', '225', '250', '275', '300'],
        title: {
            text: 'Temperatura (°C)'
        }
    },
    yaxis: {
        title: {
            text: 'Volume (L)'
        }
    },
    grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
    },
    title: {
        text: 'Gráfico VxT',
        align: 'center'
    }
};

//Acompanhamento dos Eventos
document.getElementById("isotermico").addEventListener('input', (e) => {
    zerarVariáveis();
});

document.getElementById("isovolumetrico").addEventListener('input', (e) => {
    zerarVariáveis();
});

document.getElementById("isobarico").addEventListener('input', (e) => {
    zerarVariáveis();
});

document.getElementById("initial-pressure").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        calcularVariavelInicial();
        prepararDados();
    }
});
    

document.getElementById("initial-volume").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        calcularVariavelInicial();
        prepararDados();
    }
});

document.getElementById("initial-temperature").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        calcularVariavelInicial();
        prepararDados();
    }
});

document.getElementById("final-pressure").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        calcularVariavelFinal();
        prepararDados();
    }
});

document.getElementById("final-volume").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        calcularVariavelFinal();
        prepararDados();
    }
});

document.getElementById("final-temperature").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        calcularVariavelFinal();
        prepararDados();
    }
});

// Renderiza os gráficos
const chartPV = new ApexCharts(document.querySelector(".chart-pv"), optionsPV);
const chartPT = new ApexCharts(document.querySelector(".chart-pt"), optionsPT);
const chartVT = new ApexCharts(document.querySelector(".chart-vt"), optionsVT);
chartPV.render();
chartPT.render();
chartVT.render();