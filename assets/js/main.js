const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const cardPokeDetail = document.getElementById("cardPokeDetail");
const btnCloseCard = document.getElementById("btnCloseCard");
const card = document.querySelector(".card");
const btnSearchPokemon = document.getElementById("btnSearchPokemon");
const valueSearch = document.getElementById("inputSearchPokemon");

const limit = 10;
let offset = 0;
const maxRecords = 151;

//  Ao focar no input para procurar um pokemon o css é resetado
valueSearch.addEventListener("focus", () => {
    valueSearch.style.color = "#000";
    valueSearch.style.border = "1px solid #000";
});

// Chama a função que busca os pokemons e renderiza na tela
function loadPokemonItens(offset, limit) {
    pokeAPI.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons
            .map(
                (pokemon) => `
        <li class="pokemon ${pokemon.type}" onclick="initCard(${pokemon.id})">
            <span class="number">#${pokemon.id}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                        .map((type) => `<li class="type ${type}">${type}</li>`)
                        .join("")}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
      `
            )
            .join("");

        pokemonList.innerHTML += newHtml;
    });
}

// Chama a função que renderiza os pokemons na tela ao carregar o js
loadPokemonItens(offset, limit);

// Chama a função que busca um pokemon baseado no nome ou id
btnSearchPokemon.addEventListener("click", () => {
    let idOrName = valueSearch.value;
    if (idOrName.length > 0) {
        pokeAPI.getPokemonById(idOrName).then((pokemon) => {
            if (pokemon == null) {
                valueSearch.style.color = "#ff0000";
                valueSearch.style.border = "1px solid #ff0000";
            } else {
                const newHtmlOnePoke = `
                <li class="pokemon ${pokemon.type}" onclick="initCard(${
                    pokemon.id
                })">
                    <span class="number">#${pokemon.id}</span>
                    <span class="name">${pokemon.name}</span>

                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types
                                .map(
                                    (type) =>
                                        `<li class="type ${type}">${type}</li>`
                                )
                                .join("")}
                        </ol>

                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                </li>
              `;
                pokemonList.innerHTML = "";
                pokemonList.innerHTML = newHtmlOnePoke;
            }
        });
    } else {
        loadPokemonItens(offset, limit);
    }
});

// Aqui é onde carregamos mais pokemons na tela
loadMoreButton.addEventListener("click", () => {
    valueSearch.value = "";
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;
    loadPokemonItens(offset, limit);
});

// Função que recebe o id do pokemon clicado e chama a função que busca pokemon por id
// e aqui renderizamos o seu card na tela
function initCard(id) {
    pokeAPI.getPokemonById(id).then((pokemon) => {
        const cardHtml = `
    <div class="cardPokeDetail ${pokemon.type}" id="cardPokeDetail">
    <div class="cardHeader">
    <button class="btnCloseCard" onclick="closeCard()">x</button>
    <div class="pokeCardInfo">
        <div class="pokeInfoLeft">
            <h2 class="name">${pokemon.name}</h2>
            <div class="pokeCardTypes">
            ${pokemon.types
                .map((type) => `<span class="type ${type}">${type}</span>`)
                .join("")}
            </div>
        </div>
        <span class="pokeCardId">#${pokemon.id}</span>
    </div>
    <div class="pokePhoto">
        <img src="${pokemon.photo}" alt="${pokemon.name}">
    </div>
</div>     
<div class="cardBody">
    <div class="about">
        <h3>About</h3>
        <ul>
            <li>
                <span>Abilities</span>
                <span>${pokemon.abilities}</span>
            </li>
            <li>
                <span>Heigth</span>
                <span>${pokemon.height}</span>
            </li>
            <li>
                <span>weight</span>
                <span>${pokemon.weight}</span>
            </li>
        </ul>
    </div>
    <div class="status">
        <h3>Stats</h3>
        <ul>
        ${pokemon.status
            .map(
                (stat) => `
        <li>
            <div>
            <span>${stat.nameStatus}</span>
            <span>${stat.stats}</span>
            </div>
            <span class="line ${pokemon.type}" style="width: ${stat.stats}px;"></span>
        </li>
    `
            )
            .join("")}
        </ul>
    </div>
</div>

</div>
    `;
        card.style.display = "block";
        card.innerHTML = cardHtml;
    });
}

// função que fecha o card
function closeCard() {
    (card.innerHTML = ""), (card.style.display = "none");
}
