const ESP32_IP = "192.168.217.103"; 
const API_URL = `http://${ESP32_IP}/get_data`;

async function fetchData() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        let loadCell1 = parseFloat(data.loadCell1) || 0;
        let loadCell2 = parseFloat(data.loadCell2) || 0;
        let loadCell3 = parseFloat(data.loadCell3) || 0;
        let loadCell4 = parseFloat(data.loadCell4) || 0;
        let totalWeight = loadCell1 + loadCell2 + loadCell3 + loadCell4;

        document.getElementById("loadCell1").textContent = `${loadCell1.toFixed(2)} kg`;
        document.getElementById("loadCell2").textContent = `${loadCell2.toFixed(2)} kg`;
        document.getElementById("loadCell3").textContent = `${loadCell3.toFixed(2)} kg`;
        document.getElementById("loadCell4").textContent = `${loadCell4.toFixed(2)} kg`;
        document.getElementById("totalWeight").textContent = `${totalWeight.toFixed(2)} kg`;

        document.getElementById("connectionStatus").innerHTML = `<span style="color: #0099ff;">Connected</span>`;

        if (typeof weightChart !== "undefined") {
            weightChart.data.datasets[0].data = [loadCell1, loadCell2, loadCell3, loadCell4];
            weightChart.update();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("connectionStatus").innerHTML = `<span style="color: red;">Not Connected..!</span>`;
    }
}

const ctx = document.getElementById('weightChart').getContext('2d');

const weightChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Load Cell 1', 'Load Cell 2', 'Load Cell 3', 'Load Cell 4'],
        datasets: [{
            data: [loadCell1, loadCell2, loadCell3, loadCell4],
            backgroundColor: ['#aaf6ff', '#0f9cfd', '#86ceff', '#6d94b6'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'top',
        },
    }
});

setInterval(fetchData, 500);
fetchData();
