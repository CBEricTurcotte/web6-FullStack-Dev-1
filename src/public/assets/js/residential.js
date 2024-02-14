// VARIABLES //////////

// Declare agent variables
let agentRating = 0;
let agentData = [];
let agentsListUrl = 'http://localhost:3004/agents';
// Declare agent table variables
let agentTableHead = document.getElementById("agent_table_head");
let agentTableBody = document.getElementById("agent_table_body");
// Declare region type variable
let regionTypeSelect = document.getElementById("regions");
// Declare button table variable
let tableButtons = document.querySelectorAll("th button");
// Declare formatter function
let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// FUNCTIONS //////////

// Window onload agent list & render body table
window.onload = async () => {
  try {
    const response = await fetch(agentsListUrl);
    const { data } = await response.json();
    agentData = data;
    renderBodyTable(agentData, 'all');
  } catch (error) {
    console.error('Error fetching agent list:', error);
  }
};


// Function to render body table with agents
function renderBodyTable(agents, region) {
  agentTableBody.innerHTML = "";
  agentTableHead.style.backgroundColor = "#A94545";
  let rowNumber = 1;

  agents.forEach((agent) => {
    const ratingClass =
      agent.rating === 100
        ? "rating-green"
        : agent.rating >= 90
          ? "rating-blue"
          : "rating-purple";

    if (agent.rating >= agentRating && (region === "all" || agent.region === region)) {
      const row = `
        <tr class="${ratingClass}">
          <td>${rowNumber++}</td>
          <td>${agent.first_name} ${agent.last_name}</td>
          <td>${formatter.format(agent.fee)}</td>
          <td>${agent.rating}</td>
          <td>${agent.region}</td>
        </tr>
      `;
      agentTableBody.innerHTML += row;
    }
  });

  if (agentTableBody.innerHTML.length === 0) {
    agentTableBody.innerHTML = "NO AGENT FOUND";
  }
}

// EVENT LISTENER //////////

// Add event listener when region type change
regionTypeSelect.addEventListener("change", () => {
  const regionType = regionTypeSelect.value;
  renderBodyTable(agentData, regionType);
});


// For loop with add event listener when header button is clicked & sort data
for (let i = 0; i < tableButtons.length; i++) {
  let direction = true;

  tableButtons[i].addEventListener("click", () => {
    const regionType = regionTypeSelect.value;
    const buttonID = tableButtons[i].id;

    agentData.sort((a, b) => {
      if (buttonID === 'full_name') {
        const comparison = direction ? 1 : -1;
        return a.first_name.localeCompare(b.first_name) * comparison;
      } else if ((buttonID === 'fee' && direction) ||
        (buttonID === 'rating' && direction)) {
        return a[buttonID] < b[buttonID] ? -1 : 0;
      } else {
        return b[buttonID] < a[buttonID] ? -1 : 0;
      }
    });

    renderBodyTable(agentData, regionType);
    direction = !direction;
  });
}