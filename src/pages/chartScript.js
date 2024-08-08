let pressaoI = 0;
let volumeI = 0;
let temperaturaI = 0;
let pressaoF = 0;
let volumeF = 0;
let temperaturaF = 0;
let intervaloT = [];
let intervaloV = [];
let intervaloP = [];

//Funções para pegar os dados e colocar nos gráficos
function setarVariaveis() {
    pressaoI=  !isNaN(parseFloat(document.getElementById("initial-pressure").value)) ? parseFloat(document.getElementById("initial-pressure").value) : 0;
    volumeI = !isNaN(parseFloat(document.getElementById("initial-volume").value)) ? parseFloat(document.getElementById("initial-volume").value) : 0;
    temperaturaI = !isNaN(parseFloat(document.getElementById("initial-temperature").value)) ? parseFloat(document.getElementById("initial-temperature").value) : 0; //Temperatura em °C
    pressaoF = !isNaN(parseFloat(document.getElementById("final-pressure").value)) ? parseFloat(document.getElementById("final-pressure").value) : 0;
    volumeF = !isNaN(parseFloat(document.getElementById("final-volume").value)) ? parseFloat(document.getElementById("final-volume").value) : 0;
    temperaturaF = !isNaN(parseFloat(document.getElementById("final-temperature").value)) ? parseFloat(document.getElementById("final-temperature").value) : 0; //Temperatura em °C
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
    console.log("Pressão inicial (atm): "+pressaoI);
    console.log("Volume inicial (L): "+volumeI);
    console.log("Temperatura inicial (°C): "+temperaturaI);
    console.log("Pressão final (atm): "+pressaoF);
    console.log("Volume final (L): "+volumeF);
    console.log("Temperatura final (°C): "+temperaturaF);

    if (pressaoF && volumeF && pressaoI && volumeI) {
        console.log("Chegou aqui");
        let incrementoT = (temperaturaF - temperaturaI) / 8;
        let incrementoV = (volumeF - volumeI)/8; // lógica para não ter v<=0
        let incrementoP = (pressaoF - pressaoI)/8; // lógica para não ter v<=0

        intervaloT.push(temperaturaI - incrementoT); //posição 0
        intervaloV.push(volumeI - incrementoV); //posição 0
        intervaloP.push(pressaoI - incrementoP); //posição 0

        intervaloT.push(temperaturaI); //posição 1
        intervaloV[1] = volumeI.toString(); //posição 1
        intervaloP[1] = pressaoI.toString(); //posição 1

        for (let i = 2; i < 9; i += 1) {
            intervaloT.push(temperaturaI + i*incrementoT);
            intervaloV.push(volumeI + i*incrementoV);
            intervaloP.push(pressaoI + i*incrementoP);
        }

        intervaloT.push(temperaturaF); 
        intervaloV.push(volumeF);
        intervaloP.push(pressaoF);

        intervaloT.push(temperaturaI + incrementoT); //posição 10
        intervaloV.push(volumeI + incrementoV); //posição 10
        intervaloP.push(pressaoI + incrementoP); //posição 10

        console.log("CHEGOU")
        atualizarGrafico();
    }
     
}

const optionsPV = {
    chart: {
        type: 'area',
        height: 350
    },
    series: [{
        name: 'Dados',
        data: intervaloP
    }],
    xaxis: {
        categories: intervaloV ? intervaloV : ["1", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50"],
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
        categories: intervaloT ? intervaloT : ['0', '25', '50', '75', '100', '125', '150', '175', '200', '225', '250', '275', '300'],
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
        categories: intervaloT ? intervaloT : ['0', '25', '50', '75', '100', '125', '150', '175', '200', '225', '250', '275', '300'],
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

document.getElementById("initial-pressure").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        prepararDados();
    }
});
    

document.getElementById("initial-volume").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        prepararDados();
    }
});

document.getElementById("initial-temperature").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        prepararDados();
    }
});

document.getElementById("final-pressure").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        prepararDados();
    }
});

document.getElementById("final-volume").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
        prepararDados();
    }
});

document.getElementById("final-temperature").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setarVariaveis();
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