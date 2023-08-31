
const pokeAPI = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    pokemon = new Pokemon()
    pokemon.id = pokeDetail.id
    pokemon.name = pokeDetail.name
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.type = type
    pokemon.types = types

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)

    pokemon.abilities = abilities
    pokemon.height = pokeDetail.weight
    pokemon.width = pokeDetail.width

    const status = pokeDetail.stats.map((statsSlot) => {
        status: statsSlot.base_stat
        nameStatus: statsSlot.stat.name
    })

    pokemon.status = status
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeAPI.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)
}

pokeAPI.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
    .then((response) => {return response.json();})
    .then((jsonBody) => {return jsonBody.results})
    .then((pokemons) => pokemons.map(pokeAPI.getPokemonDetail))
    .then((detailRequest) => Promise.all(detailRequest))
    .then((pokemonsDetails) => pokemonsDetails)
}
