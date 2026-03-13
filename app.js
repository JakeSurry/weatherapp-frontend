const form = document.querySelector("form");
const weatherDiv = document.getElementById("weatherDiv");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = form.elements.city.value;

  if (!city) {
    return;
  }

  try {
    const response = await fetch(`https://weatherapp-backend-1-wqk4.onrender.com/weather?city=${city}`);
    const data = await response.json();

    if (!response.ok) {
      renderOutput(data.error);
      return;
    }

    const time = new Date((data.dt + data.timezone) * 1000);
    let hours = time.getUTCHours();
    let ampm;
    if (hours <= 12) {
      ampm = "AM";
    } else {
      ampm = "PM";
    }
    hours %= 12;
    if (hours == 0) {
      hours = 12;
    }
    const minutes = time.getUTCMinutes().toString().padStart(2, "0");
    const joinedTime = `${hours}:${minutes} ${ampm}`;
    const date = time.toUTCString().slice(0, 16);

    renderOutput(`
    <div class="flex flex-col items-center gap-4 text-orange-200">
        <i class="owf owf-${data.icon} owf-5x"></i>
        <h2 class="text-4xl font-semibold capitalize">${data.name}</h2>
        <p class="text-sm">${date} · ${joinedTime}</p>
        <p class="text-5xl">${Math.round(data.temperature)}°C</p>
        <p class="text-xl capitalize">${data.description}</p>
    </div>
    `);
    weatherDiv.style.display = "flex";
  } catch (error) {
    renderOutput("Could not connect to server");
  }
});

function renderOutput(output) {
  weatherDiv.innerHTML = output;
  weatherDiv.style.display = "flex";
  weatherDiv.style.width = `${form.offsetWidth}px`;
}

window.addEventListener("resize", () => {
  if (weatherDiv.style.display !== "none") {
    weatherDiv.style.width = `${form.offsetWidth}px`;
  }
});
