let allEvents = [];
let currentFilter = "all";

function getEventStatus(eventDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDateObj = new Date(eventDate);
  eventDateObj.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((eventDateObj - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "expired";
  } else if (diffDays === 0) {
    return "ongoing";
  } else if (diffDays <= 7) {
    return "ongoing";
  } else {
    return "upcoming";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("pt-BR", options);
}

function getStatusBadge(status) {
  const badges = {
    upcoming: { class: "badge-upcoming", text: "Em Breve" },
    ongoing: { class: "badge-ongoing", text: "Em Andamento" },
    expired: { class: "badge-expired", text: "Realizada" },
  };
  return badges[status];
}

function getEventIcon(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("workshop")) return "fa-code";
  if (lowerTitle.includes("hackathon")) return "fa-trophy";
  if (lowerTitle.includes("palestra")) return "fa-microphone";
  if (lowerTitle.includes("meetup")) return "fa-users";
  if (lowerTitle.includes("game")) return "fa-gamepad";
  if (lowerTitle.includes("ia") || lowerTitle.includes("machine learning"))
    return "fa-robot";
  if (lowerTitle.includes("web")) return "fa-laptop-code";
  if (lowerTitle.includes("rede")) return "fa-network-wired";
  return "fa-calendar-alt";
}

function getGradientColor(status) {
  const gradients = {
    upcoming: "from-green-900 to-green-700",
    ongoing: "from-orange-900 to-orange-700",
    expired: "from-gray-800 to-gray-700",
  };
  return gradients[status];
}

function renderEvents(events, filter = "all") {
  const container = document.getElementById("events-container");

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((event) => event.status === filter);

  container.innerHTML = "";

  if (filteredEvents.length === 0) {
    container.innerHTML = `
                    <div class="col-span-full text-center py-16">
                        <i class="fas fa-calendar-times text-5xl text-gray-400 mb-4"></i>
                        <h3 class="text-2xl font-semibold mb-2">Nenhuma atividade encontrada</h3>
                        <p class="text-gray-400 max-w-xl mx-auto">
                            ${
                              filter === "all"
                                ? "No momento não há atividades registradas. Fique de olho para futuras atualizações!"
                                : `Não há atividades com o status "${document
                                    .querySelector(`[data-filter="${filter}"]`)
                                    .textContent.trim()}".`
                            }
                        </p>
                    </div>
                `;
    return;
  }

  filteredEvents.forEach((event) => {
    const badge = getStatusBadge(event.status);
    const icon = getEventIcon(event.title);
    const gradient = getGradientColor(event.status);

    const eventCard = `
                    <div class="event-card glass-effect rounded-xl overflow-hidden border border-gray-800" data-status="${
                      event.status
                    }">
                        <div class="relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center">
                            <i class="fas ${icon} text-6xl text-white opacity-20"></i>
                            <div class="absolute top-4 right-4">
                                <span class="${
                                  badge.class
                                } px-3 py-1 rounded-full text-xs font-semibold text-white">
                                    ${badge.text}
                                </span>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex items-center text-sm text-gray-400 mb-3">
                                <i class="fas fa-calendar mr-2"></i>
                                <span>${formatDate(event.date)}</span>
                                ${
                                  event.time
                                    ? `
                                    <span class="mx-2">•</span>
                                    <i class="fas fa-clock mr-2"></i>
                                    <span>${event.time}</span>
                                `
                                    : ""
                                }
                            </div>
                            <h3 class="text-xl font-semibold mb-3">${
                              event.title
                            }</h3>
                            <p class="text-gray-400 text-sm mb-4">
                                ${event.description}
                            </p>
                            <div class="flex items-center justify-between flex-wrap gap-3">
                                ${
                                  event.location
                                    ? `
                                    <div class="flex items-center text-sm text-gray-400">
                                        <i class="fas fa-map-marker-alt mr-2"></i>
                                        <span>${event.location}</span>
                                    </div>
                                `
                                    : ""
                                }
                                ${
                                  event.submissionLink
                                    ? `
                                    <a href="${
                                      event.submissionLink
                                    }" target="_blank" 
                                       class="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                        ${
                                          event.status === "expired"
                                            ? "Ver Resumo"
                                            : "Inscreva-se"
                                        }
                                        <i class="fas fa-arrow-right ml-1"></i>
                                    </a>
                                `
                                    : `
                                    <button class="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                        Ver Detalhes <i class="fas fa-arrow-right ml-1"></i>
                                    </button>
                                `
                                }
                            </div>
                        </div>
                    </div>
                `;

    container.innerHTML += eventCard;
  });
}

async function fetchEvents() {
  const container = document.getElementById("events-container");
  const loadingState = document.getElementById("loading-state");

  try {
    const response = await fetch("/api/events");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const events = await response.json();

    allEvents = events.map((event) => ({
      ...event,
      status: getEventStatus(event.date),
    }));

    allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderEvents(allEvents, currentFilter);
  } catch (error) {
    container.innerHTML = `
                    <div class="col-span-full text-center py-16">
                        <i class="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
                        <h3 class="text-2xl font-semibold mb-2">Erro ao carregar atividades</h3>
                        <p class="text-gray-400 max-w-xl mx-auto mb-6">
                            Não foi possível conectar ao servidor. Tente novamente mais tarde.
                        </p>
                        <button onclick="fetchEvents()" 
                                class="bg-accent text-white px-6 py-2 rounded-full font-medium transition">
                            <i class="fas fa-redo mr-2"></i>Tentar Novamente
                        </button>
                    </div>
                `;
  }
}

const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    currentFilter = btn.dataset.filter;

    renderEvents(allEvents, currentFilter);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetchEvents();
});
