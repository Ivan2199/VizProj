// Funkcija za crtanje stupčastog grafa, ispis imena igrača, prikaz slike igrača i crtanje radarskog grafa
// Parametri: skup podataka o igračima, ID igrača koji se vizualizira, te playerNum (označava poziciju na
// stranici, ako je lijevo, onda je 1, ako je desno onda je 2)
function drawAll(data, id, playerNum) {
  // margine, visina i širina radara
  var marginRadar = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
  };
  var widthRadar =
    Math.min(800, window.innerWidth - 10) -
    marginRadar.left -
    marginRadar.right;
  var heightRadar = Math.min(
    widthRadar,
    window.innerHeight - marginRadar.top - marginRadar.bottom - 20
  );

  const goalkeeperButton = document.getElementById("goalkeeperButton");
  const playerButton = document.getElementById("playerButton");

  goalkeeperButton.addEventListener("click", handleButtonClick);
  playerButton.addEventListener("click", handleButtonClick);

  function handleButtonClick() {
    // Uklanjanje radar charta

    // Uklanjanje bar charta
    const barChartContainer = document.getElementById(`player${playerNum}data`);
    barChartContainer.innerHTML = ""; // Uklanjanje sadržaja iz kontejnera

    const name = document.getElementById(`player${playerNum}name`);
    name.innerText = "";

    // Ponovno crtanje grafikona s praznim podacima
    RadarChart(".radarChart", null, radarChartOptions, abb);
    drawBarChart(null, keys, `#player${playerNum}data`, playerNum, abb);
  }

  // Prikaz imena i slike igrača
  var player = data.find((obj) => obj.sofifa_id == id);
  const firstThree = player.sofifa_id.substring(0, 3);
  const restOfTheString = player.sofifa_id.substring(3);

  if (player) {
    d3.select(`#player${playerNum}name`).html(player.short_name);
    d3.select(`#player${playerNum}Image`)
      .attr(
        "src",
        `https://cdn.sofifa.net/players/${firstThree}/${restOfTheString}/21_60.png`
      )
      .style("width", "90px")
      .style("height", "90px");

    // Inicijalizacija polja podataka za igrača koji se vizualizira
    pokeData[playerNum - 1] = [];

    // Odabir skupa dopuštenih ključeva ovisno o poziciji igrača
    var keys =
      player.player_positions === "GK" ? allowedKeysGoalkeeper : allowedKeys;

    console.log(keys);
    // Ako se prvo odabire crtanje igrača na desnoj strani (drugi igrač), podaci
    // za prvog igrača se postavljaju na 0 zbog načina na koji je biblioteka napisana
    if (playerNum == 2 && pokeData[0].length == 0) {
      for (key in keys) {
        pokeData[0].push({
          axis: keys[key],
          value: 0,
        });
      }
    }

    // Formatiranje podataka kako bi se mogla koristiti RadarChart biblioteka
    for (const key of keys) {
      pokeData[playerNum - 1].push({
        axis: key,
        value: player[key],
      });
    }

    var abb =
      player.player_positions === "GK"
        ? abbreviationMapGoalkeeper
        : abbreviationMap;

    // Kreiranje legende u HTML formatu
    var legendHTML = "";
    for (var i = 0; i < keys.length; i++) {
      var abbreviation = keys[i];
      var fullName = abb[abbreviation];
      legendHTML += `<div>${fullName} - ${abbreviation}</div>`;
    }
    // Definiranje boja za radarski graf
    var colorRadar = d3.scale.ordinal().range(["red", "green"]);

    // Definiranje opcija za radarski graf
    var radarChartOptions = {
      w: widthRadar - 100,
      h: heightRadar - 100,
      margin: marginRadar,
      maxValue: 120,
      levels: 10,
      roundStrokes: false,
      color: colorRadar,
    };

    RadarChart(".radarChart", pokeData, radarChartOptions, abb);
    drawBarChart(
      pokeData[playerNum - 1],
      keys,
      `#player${playerNum}data`,
      playerNum,
      abb
    );

    // Abbreviation map code and legend creation should be placed here

    // Dodavanje legende u podnožje stranice
    d3.select("footer.legend").html(legendHTML);
  }
}

var allowedKeysGoalkeeper = [
  "overall",
  "gk_diving",
  "gk_handling",
  "gk_kicking",
  "gk_speed",
  "gk_positioning",
  "attacking_finishing",
  "attacking_short_passing",
  "skill_ball_control",
  "movement_sprint_speed",
  "movement_acceleration",
];
var allowedKeys = [
  "overall",
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physic",
  "attacking_finishing",
  "attacking_short_passing",
  "skill_ball_control",
  "movement_sprint_speed",
  "movement_acceleration",
];

// Funkcija za pronalaženje ID-ja igrača na temelju imena
function findPlayerByName(name, data) {
  return data.find((obj) => obj.short_name == name)["sofifa_id"];
}

// Kreiranje objekta za mapiranje skraćenica na puna imena
var abbreviationMap = {
  overall: "Ov",
  pace: "Pa",
  shooting: "Sh",
  passing: "Pass",
  dribbling: "Dr",
  defending: "De",
  physic: "Ph",
  attacking_finishing: "AF",
  attacking_short_passing: "ASP",
  skill_ball_control: "SBC",
  movement_sprint_speed: "MSS",
  movement_acceleration: "MA",
};
var abbreviationMapGoalkeeper = {
  overall: "Ov",
  gk_diving: "GD",
  gk_handling: "GH",
  gk_kicking: "GK",
  gk_speed: "GS",
  gk_positioning: "GP",
  attacking_finishing: "AF",
  attacking_short_passing: "ASP",
  skill_ball_control: "SBC",
  movement_sprint_speed: "MSS",
  movement_acceleration: "MA",
};
