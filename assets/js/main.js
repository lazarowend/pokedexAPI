const offset = 0;
const limit = 20;

function converterPokemonToHtml(pokemon) {
  return `
  <li class="pokemon ${pokemon.type}">
  <span class="number">#${pokemon.id}</span>
  <span class="name">${pokemon.name}</span>
  <div class="detail">
  <ol class="types">
      ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
  </ol>
  <img src="${pokemon.photo}" alt="${pokemon.name}">
  </div>
  </li>
  `
}

const pokemonList = document.getElementById("pokemonList");

pokeAPI.getPokemons(offset, limit).then((pokemons = []) => {
    pokemonList.innerHTML += pokemons.map(converterPokemonToHtml).join('')
})
.catch((error) => {console.log(error);})
