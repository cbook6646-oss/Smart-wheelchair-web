// ============================================
// SMART WHEELCHAIR — APP LOGIC (Simulated Mode)
// ============================================
// NOTE: All sensor data is currently SIMULATED.
// This will be replaced with real EV3 data in Step 7 (Bluetooth integration).

// ---------- STATE ----------
const state = {
  connected: false,
  mode: "manual", // "manual" | "autonomous"
  battery: 87,
  distance: 42,
  color: "black",
  selectedDestination: null,
};

// ---------- DOM REFERENCES ----------
const splashScreen = document.getElementById("splash-screen");
const app = document.getElementById("app");

const connectBtn = document.getElementById("connect-btn");
const connectionValue = document.getElementById("connection-value");
const statusConnectionCard = document.getElementById("status-connection");

const batteryValue = document.getElementById("battery-value");
const distanceValue = document.getElementById("distance-value");
const colorValue = document.getElementById("color-value");
const colorDot = document.getElementById("color-dot");

const statusBatteryCard = document.getElementById("status-battery");
const statusDistanceCard = document.getElementById("status-distance");

const robotStatusBanner = document.getElementById("robot-status-banner");
const robotStatusText = document.getElementById("robot-status-text");

const modeManualBtn = document.getElementById("mode-manual-btn");
const modeAutonomousBtn = document.getElementById("mode-autonomous-btn");
const manualPanel = document.getElementById("manual-panel");
const autonomousPanel = document.getElementById("autonomous-panel");

const btnForward = document.getElementById("btn-forward");
const btnBackward = document.getElementById("btn-backward");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnStopSmall = document.getElementById("btn-stop-small");
const btnEmergencyStop = document.getElementById("btn-emergency-stop");

const destinationGrid = document.getElementById("destination-grid");
const btnStartRoute = document.getElementById("btn-start-route");

// ============================================
// 1. SPLASH SCREEN
// ============================================
window.addEventListener("load", () => {
  setTimeout(() => {
    splashScreen.classList.add("hidden");
    app.classList.remove("hidden");
  }, 2200);
});

// ============================================
// 2. CONNECT BUTTON (simulated for now)
// ============================================
connectBtn.addEventListener("click", () => {
  state.connected = !state.connected;

  if (state.connected) {
    connectBtn.dataset.state = "connected";
    connectBtn.querySelector(".connect-label").textContent = "Connected";
    connectionValue.textContent = "Online";
    statusConnectionCard.classList.add("scanning");
    setRobotStatus("Standing by");
  } else {
    connectBtn.dataset.state = "disconnected";
    connectBtn.querySelector(".connect-label").textContent = "Connect";
    connectionValue.textContent = "Offline";
    statusConnectionCard.classList.remove("scanning");
    setRobotStatus("Disconnected");
  }
});

// ============================================
// 3. ROBOT STATUS HELPER
// ============================================
function setRobotStatus(text) {
  robotStatusText.textContent = text;
}

// ============================================
// 4. MODE SWITCH (Manual / Autonomous)
// ============================================
modeManualBtn.addEventListener("click", () => switchMode("manual"));
modeAutonomousBtn.addEventListener("click", () => switchMode("autonomous"));

function switchMode(mode) {
  state.mode = mode;

  modeManualBtn.classList.toggle("active", mode === "manual");
  modeAutonomousBtn.classList.toggle("active", mode === "autonomous");

  manualPanel.classList.toggle("hidden", mode !== "manual");
  autonomousPanel.classList.toggle("hidden", mode !== "autonomous");

  setRobotStatus(mode === "manual" ? "Manual mode active" : "Autonomous mode active");
}

// ============================================
// 5. DIRECTIONAL CONTROLS (Manual mode)
// ============================================
btnForward.addEventListener("click", () => sendManualCommand("forward"));
btnBackward.addEventListener("click", () => sendManualCommand("backward"));
btnLeft.addEventListener("click", () => sendManualCommand("left"));
btnRight.addEventListener("click", () => sendManualCommand("right"));
btnStopSmall.addEventListener("click", () => sendManualCommand("stop"));

function sendManualCommand(command) {
  if (!state.connected) {
    setRobotStatus("Not connected — connect first");
    return;
  }

  console.log(`[SIMULATED] Command sent to EV3: ${command}`);

  const labels = {
    forward: "Moving forward",
    backward: "Moving backward",
    left: "Turning left",
    right: "Turning right",
    stop: "Stopped",
  };

  setRobotStatus(labels[command]);
}

// ============================================
// 6. EMERGENCY STOP
// ============================================
btnEmergencyStop.addEventListener("click", () => {
  console.log("[SIMULATED] EMERGENCY STOP triggered");
  setRobotStatus("EMERGENCY STOP");
  robotStatusBanner.classList.add("state-stop");
  robotStatusBanner.classList.remove("state-alert");
});

// ============================================
// 7. DESTINATION SELECTION (Autonomous mode)
// ============================================
destinationGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".dest-card");
  if (!card) return;

  document.querySelectorAll(".dest-card").forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");

  state.selectedDestination = card.dataset.destination;
  btnStartRoute.disabled = false;

  setRobotStatus(`Destination set: ${card.querySelector("span").textContent}`);
});

// ============================================
// 8. START ROUTE (Autonomous mode)
// ============================================
btnStartRoute.addEventListener("click", () => {
  if (!state.connected) {
    setRobotStatus("Not connected — connect first");
    return;
  }
  if (!state.selectedDestination) return;

  console.log(`[SIMULATED] Route started to: ${state.selectedDestination}`);
  setRobotStatus(`En route to ${state.selectedDestination.replace("-", " ")}`);
});

// ============================================
// 9. SIMULATED SENSOR DATA (with warnings + pulse)
// ============================================
function simulateSensorData() {
  // Battery
  state.battery = Math.max(0, state.battery - Math.random() * 0.3);
  batteryValue.textContent = `${Math.round(state.battery)}%`;
  pulseValue(batteryValue);

  statusBatteryCard.classList.toggle("warning-red", state.battery < 20);
  statusBatteryCard.classList.toggle("warning-amber", state.battery >= 20 && state.battery < 40);

  // Distance
  state.distance = Math.max(3, Math.round(20 + Math.random() * 80));
  distanceValue.textContent = `${state.distance} cm`;
  pulseValue(distanceValue);

  const isClose = state.distance < 15;
  const isNear = state.distance >= 15 && state.distance < 30;
  statusDistanceCard.classList.toggle("warning-red", isClose);
  statusDistanceCard.classList.toggle("warning-amber", isNear);

  if (isClose) {
    setRobotStatus("Obstacle detected — avoiding");
    robotStatusBanner.classList.add("state-alert");
    robotStatusBanner.classList.remove("state-stop");
  } else {
    robotStatusBanner.classList.remove("state-alert");
  }

  // Color
  const colors = [
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#f5f5f5" },
    { name: "Red", hex: "#FF3B5C" },
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  state.color = randomColor.name;
  colorValue.textContent = randomColor.name;
  colorDot.setAttribute("fill", randomColor.hex);
  pulseValue(colorValue);
}

function pulseValue(el) {
  el.classList.remove("pulse");
  void el.offsetWidth; // force reflow so animation can replay
  el.classList.add("pulse");
}

// Only simulate data updates while "connected"
setInterval(() => {
  if (state.connected) {
    simulateSensorData();
  }
}, 2000);