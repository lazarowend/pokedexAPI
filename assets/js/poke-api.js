const pokeAPI = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    pokemon = new Pokemon();
    pokemon.id = pokeDetail.id;
    pokemon.name = pokeDetail.name;
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.type = type;
    pokemon.types = types;

    const abilities = pokeDetail.abilities.map(
        (abilitySlot) => abilitySlot.ability.name
    );

    pokemon.abilities = abilities;
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;

    const status = pokeDetail.stats.map((statusSlot) => ({
        stats: statusSlot.base_stat,
        nameStatus: statusSlot.stat.name,
    }));
    pokemon.status = status;
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    return pokemon;
}

pokeAPI.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
};

pokeAPI.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((jsonBody) => {
            return jsonBody.results;
        })
        .then((pokemons) => pokemons.map(pokeAPI.getPokemonDetail))
        .then((detailRequest) => Promise.all(detailRequest))
        .then((pokemonsDetails) => pokemonsDetails);
};

pokeAPI.getPokemonById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Não foi possível encontrar o Pokémon");
            }
            return response.json();
        })
        .then((pokeData) => {
            if (pokeData.detail && pokeData.detail === "Not found.") {
                throw new Error("O Pokémon não foi encontrado");
            }
            return convertPokeApiDetailToPokemon(pokeData);
        })
        .then((pokemon) => pokemon)
        .catch((error) => {
            return null;
        });
};
