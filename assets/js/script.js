async function getValor (moneda) {
    try {
        const res = await fetch("https://mindicador.cl/api/");
        const data = await res.json();
        const valor = data[moneda.value].valor;

        return valor;
    }
    catch (e) {
        document.querySelector("body").innerHTML = `
        <div class="error"> 
        <h1 style="border: none;"> ¡Algo salio mal! Error inesperado </h1>
        </div>
        `
    }
}
    
 async function convertir () {
    const moneda = document.querySelector("#monedas");
    const clp = document.querySelector("#clp");
    const valor = await getValor(moneda);
    const resultado = clp.value/valor;
    
    document.querySelector("#resultado").innerHTML = resultado;
    renderGrafica(moneda.value);
    
 }  

 
 async function crearData(moneda) {
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    let monedas = await res.json();
    const serie = monedas.serie;
    const labels = [];
    const valor = [];

    
    for (let i = 0; i < 10 && i < serie.length; i++) {
        const item = serie[i];
        labels.push(item.fecha.split('T')[0]); 
        valor.push(item.valor); 
    };

    const datasets = [
        {
            label: `Valor del ${moneda.toUpperCase()}`,
            borderColor: "rgb(255, 99, 132)",
            data: valor
        }
    ];

    return { labels, datasets };
}

let myChart; 
async function renderGrafica(moneda) {
    const data = await crearData(moneda);
    
    if (myChart) {
        myChart.destroy();
    }

    const config = {
        type: "line",
        data: data,
        
    };

    const myChartElement = document.getElementById("myChart");
    myChartElement.style.backgroundColor = "white";

    myChart = new Chart(myChartElement, config);
}