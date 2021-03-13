var pokemons_caught = [];
var exp_levels = [0, 0, 4, 13, 32 ,61, 112, 178, 276, 393, 540, 745, 967, 1230, 1591, 1957, 2457, 3046, 3732, 4526, 5440, 6482, 7666, 9003, 10506, 12187, 14060, 16140, 18439, 20974, 23760, 26811, 30146, 33780, 37731, 42017, 46656, 50653, 55969, 60505, 66560, 71677, 78533, 84277, 91988, 98415, 107069, 114205, 123863, 131766, 142500, 151222, 163105, 172967, 185807, 196322, 210739, 222231, 238036, 250562, 267840, 281456, 300293, 315059, 335544, 351520, 373744, 390991, 415050, 433631, 459620, 479600, 507617, 529063, 559209, 582187, 614566, 639146, 673863, 700115, 737280, 765275, 804997, 834809, 877201, 908905, 954084, 987754, 1035837, 1071552, 1122660, 1160499, 1214753, 1254796, 1312322, 1354652, 1415577, 1460276, 1524731, 1571884, 1640000];
function showMyPokemons(){
  var listPoke = "<h4>My Pokemons</h4><ol>";
  let pic_poke;
  for(var i = 0; i < pokemons_caught.length; i++){
    let poke_id = pokemons_caught[i].id;
    let poke_index = i;
    pic_poke = ""+pokemons_caught[i].id;
    while(pic_poke.length < 3){
      pic_poke = ("0"+pic_poke);
    }
    listPoke += "<li><button onclick='pokemonMain("+poke_id+", "+poke_index+")'>"+"<h5>HP:"+pokemons_caught[i].hp+"</h5><img src='pokemon/front/"+pic_poke+".gif'/></button></li>";
  }
  listPoke += "</ol>";
  document.getElementById("myPokemons").innerHTML = listPoke;
}

function pokemonMain(id,index){
  if(!battle){
    myAttacks(pokemons_caught[index]);
    my_pokemon = id+"";
    currentPokemonIndex = index;

    let choice = pokemons_caught[index].name[0].toUpperCase()+pokemons_caught[index].name.substring(1);
    while(my_pokemon.length < 3){
      my_pokemon = ("0"+my_pokemon);
    }
    SoundsManager.playSoundFromSource('sounds/'+my_pokemon+' - '+choice+'.wav');
    // show my pokemon
    // user part
    document.getElementById("self_appearance").innerHTML = "<b>"+choice+"</b>";
    // padding  0 to fetch the image
    var self_image_str = ""+my_pokemon;
    while(self_image_str.length < 3){
      self_image_str = ("0"+self_image_str);
    }
    updatePokemonStats();
    resume_game();
    document.getElementById("self_image").src = "pokemon/back/"+self_image_str+".gif";
  }
  else{
    alert("You can't change a Pokemon in midst of a battle!");
  }
}
var turnsNumber = 0;
function catchPokemon(){
  //document.getElementById("self_attacks").innerHTML = "";
  if(current_turn == turn[0]){
    current_turn = turn[1];
    if(myBag[0].quantity > 0){
        myBag[0].quantity--;
        showBag();
        statusUpdate("Trainer threw a Pokeball on wild "+ enemy_pokemon.name+", waiting...");
        //a = ((3*HPmax - 2*HPcurrent)*ratemodified*bonusBall)/(3*HPmax)
        let HPmax = enemy_hp;
        let HPcurrent = (enemy_hp  * enemy_current_lvl)/100;
        let ratemodified = (Math.random() * 255 + 1);
        let bonusBall = 1;

        let a = ((3*HPmax - 2*HPcurrent)*ratemodified*bonusBall)/(3*HPmax);
        //console.log(a);
        if(a > 100){
          showBag();
          enemy_pokemon.hp = enemy_hp;
          let t = exp_levels[enemy_hp/10];
          enemy_pokemon.exp = t;
          if(my_lvls.max < enemy_pokemon.hp/10){
            my_lvls.max = enemy_pokemon.hp/10;
          }
          else if(my_lvls.min > enemy_pokemon.hp/10){
            my_lvls.min = enemy_pokemon.hp/10;
          }
          pokemons_caught.push(enemy_pokemon);
          statusUpdate("Congratulations trainer! " + enemy_pokemon.name + " is caught!");

          showMyPokemons();
          enemy_pokemon = null;
          resume_game();
        }
        else{
          statusUpdate("You missed the Pokémon!");
        }
      }
      else{
        alert("You don't have Pokeball");
      }
  }
  else{
    statusUpdate("Wait for your turn.")
  }

}
function levelCheck(pklvl){
  let i = 0;
 
  while(pklvl >= exp_levels[i]){
    i++;
  }
  
  let level = i - 1;
  console.log('ANS', ans)
  console.log("Your pokemon is at:"+(i-1));
  pokemons_caught[currentPokemonIndex].hp = ans*10;
  
  //Add current level to pokemon object
  let currentPokemon = pokemons_caught[currentPokemonIndex]
  currentPokemon.current_level = level
  evolution_check(currentPokemon)
}

//<---------EVOLUTION POP UP ---------->
  const evolution_modal = document.getElementById("evolution")
  evolution_modal.addEventListener('click', evolution_popup_modal)

   function evolution_popup_modal(event){
      const response = event.target.value
      if(response === 'no'){
          evolution_modal.classList.add('hidden-elements')
      }
      if (response === 'yes'){
          evolution_modal.classList.add('hidden-elements');
          start_evolution();
      }
  }

//<---------EVOLUTION API ---------->
   function  evolution_check(currentPokemon){
      const{id, evolves_at_level, current_level} = currentPokemon
        if(evolves_at_level === null){
          return 
        };
        if(current_level >= evolves_at_level && !currentPokemon.final_evolution){
            evolution_modal.classList.remove('hidden-elements') 
        }
  }
       
          

   function start_evolution(){

    let currentPokemon = pokemons_caught[0];

    //ACCESS THE POKEMON EVOLUTION CHAIN
      request.open('GET',`https://pokeapi.co/api/v2/pokemon-species/${currentPokemon.id}/`)
         request.onload = function (){
            data = JSON.parse(this.response)
            let current_pokemon_evolution_chain = data.evolution_chain.url;
            //ADD PROPERTIES FOR THE NEXT (FINAL) POKEMON EVOLUTION  
            request.open('GET',`${current_pokemon_evolution_chain}`)
            request.onload = function(){
                data = JSON.parse(this.response) 
                let next_evolution;
                let min_level;
                let final_evolution = false

                //NEXT POKEMON IN THE EVOLUTION CHAIN AND MINIMUM LEVEL TO TRIGGER EVOLUTION
                if(!currentPokemon.next_evolution){
                  next_evolution = data.chain.evolves_to[0].species.name
                  min_level = data.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level
              } else {
                //FINAL POKEMON IN THE EVOLUTION CHAIN AND MINIMUM LEVEL TO TRIGGER EVOLUTION
                  next_evolution = data.chain.evolves_to[0].evolves_to[0].species.name
                  min_level = data.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level
                  final_evolution = true;
              }
 

              // THE EVOLVED POKEMON
                request.open('GET', `https://pokeapi.co/api/v2/pokemon/${next_evolution}/`);
                      request.onload = function(){
                      data = JSON.parse(this.response) 
                        if (data){   
                            newEntry = data;
                            newEntry.hp = 50;
                            newEntry.exp = newEntry.base_experience;
                            newEntry.current_level = currentPokemon.evolves_at_level;
                            newEntry.evolves_at_level = min_level;
                            newEntry.next_evolution = next_evolution;

                            if(final_evolution){
                              newEntry.final_evolution = true;
                            }else{
                              newEntry.final_evolution = false;
                            }
                            myAttacks(newEntry)
          
                            //simulate an evolution by removing the current pokemon and replacing it
                            //with the evolved version
                            pokemons_caught.pop()
                            pokemons_caught.push(newEntry);
                            showMyPokemons();
                            
                          let self_image_str = ""+newEntry.id;
                              while(self_image_str.length < 3){
                                 self_image_str = ("0"+self_image_str);
                              } 
            
                          document.getElementById("self_image").src = "pokemon/back/"+self_image_str+".gif";
                          const pokemon_name = capitalize(newEntry.species.name)
                          document.getElementById("self_appearance").innerHTML = `<b>${pokemon_name}</b>`;
                          SoundsManager.playSoundFromSource("sounds/00"+my_pokemon+" - "+choice+".wav");
                      }
                  
                }
                request.send()
              
            }
            request.send()
         }
         request.send()
        
    }   
 
 

  



