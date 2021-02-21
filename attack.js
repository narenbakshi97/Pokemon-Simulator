// the attacks are defined here
var myMoves = [];
var enemyMoves = [];
var turn = ["user","pc"];
var current_turn = turn[0];

function enemyAttacks(wild){
  enemyMoves = [];
  let moves = wild.moves;
  for(let i = 0; i < moves.length; i++){
    let tmp = {};
    tmp.name = moves[i].move.name;
    tmp.url = moves[i].move.url;
    tmp.level = moves[i].version_group_details[0].level_learned_at;
    // checking enemy's level
    if(tmp.level < (enemy_hp/10)){
      let requ = new XMLHttpRequest();
      requ.open('GET', tmp.url, true);
      requ.onload = function () {
        data = JSON.parse(this.response);
        tmp.power = data.power;
        tmp.type = data.type.name;
        enemyMoves.push(tmp);
      }
      requ.send();
    }
  }
  //console.log(enemyMoves);
}

function myAttacks(pkmn){
  myMoves = [];
  let moves = pkmn.moves;
  for(let i = 0; i < moves.length; i++){
    let tmp = {};
    tmp.name = moves[i].move.name;
    tmp.url = moves[i].move.url;
    tmp.level = moves[i].version_group_details[0].level_learned_at;
    // checking enemy's level
    if(tmp.level < (pkmn.hp/10)){
      let requ = new XMLHttpRequest();
      requ.open('GET', tmp.url, true);
      requ.onload = function () {
        data = JSON.parse(this.response);
        tmp.power = data.power;
        tmp.type = data.type.name;
        myMoves.push(tmp);
      }
      requ.send();
    }
  }
  //console.log(myMoves);
}

// moves = {name:, power:, type:, level: , url:}
function showMyAttacks(){
  document.getElementById("self_attacks").innerHTML = "";
  let str = "";
  let k = Math.floor(Math.random() * myMoves.length);
  for(let i = 0; i < 4; i++){
      //console.log(myMoves[i].name);
      str += "<button onclick='moveChoice("+k+")'>"+myMoves[k].name+"</button><br>";
      k++;
      if(k > myMoves.length){
        k = 0;
      }
  }
  document.getElementById("self_attacks").innerHTML = str;
}

function moveChoice(index){
  if(current_turn == "user"){
    let theMove = myMoves[index];
    //console.log(theMove);
    // A: attacker's Level
    let A = pokemons_caught[currentPokemonIndex].hp/10;
    // C: attack Power
    let C = theMove.power;

    // my pokemon's type
    pType = pokemons_caught[currentPokemonIndex].types[0].type.name;
    // my poemon's attack type
    paType = theMove.type;
    // enemy's type
    eType = enemy_pokemon.types[0].type.name;
    // B: attacker's Attack or Special
    let B = typeModifier[paType][eType];
    // D: defender's Defense or Special
    let D = typeModifier[eType][paType];
    // Y: typeModifers
    let Y = typeModifier[pType][eType] * 10;
    // X: same-Type attack bonus
    let X = 1;
    if(pType == paType){
      X = 1.5;
    }
    let Z = Math.floor(Math.random() * 255 + 217);
    //((2A/5+2)*B*C)/D)/50)+2)*X)*Y/10)*Z)/255
    //(((((((2 * A / 5 + 2) * B * C) / D) / 50 + 2) * X) * Y / 10) * Z) / 255
    ans = (((((((2 * A / 5 + 2) * B * C) / D) / 50 + 2) * X) * Y / 10) * Z) / 255;

    //console.log(ans);
    // let's actually damge that pokemon
    let damage = ans/enemy_hp * 100;
    //console.log(damage);
    enemy_current_lvl -= damage;
    enemy_current_lvl = Math.floor(enemy_current_lvl);
    new Audio("sounds/Tackle.wav").play();
    document.getElementById("enemy_health").innerHTML = "<strong>Health:"+ enemy_current_lvl +"/100</strong>";
    statusUpdate("Your "+pokemons_caught[currentPokemonIndex].name+" used "+ theMove.name);
    current_turn = turn[1];
    if(enemy_current_lvl <= 0){
      alert("You won!");
      let e = calculateLvl();
      pokemons_caught[currentPokemonIndex].exp += e;
      levelCheck(pokemons_caught[currentPokemonIndex].exp);
      statusUpdate(pokemons_caught[currentPokemonIndex].name + " got, "+ e + " experience points!");
      enemy_pokemon = null;
      myMoney += 30;
      resume_game();
    }
  }
  else{
    alert("Its wild pokemon's turn not your!");
  }
}


// for the enemy pokemonMain
function wildTurn(){
  if(battle){
    //console.log("Yes it's battle time");
    if(current_turn == "pc"){
      //console.log("Enemy's turn");
      let r = Math.floor(Math.random() * enemyMoves.length);
      statusUpdate("Wild "+ enemy_pokemon.name + " used, "+ enemyMoves[r].name+ " move.");
      //console.log(enemyMoves[r]);
      let theMove = enemyMoves[r];
      // A: attacker's Level
      let A = enemy_hp/10;
      // C: attack Power
      let C = theMove.power;

      // enemy pokemon's type
      eType = enemy_pokemon.types[0].type.name;
      // enemy poemon's attack type
      eaType = theMove.type;
      // user's pokemon type
      pType = pokemons_caught[currentPokemonIndex].types[0].type.name;
      // B: attacker's Attack or Special
      let B = typeModifier[eaType][pType];
      // D: defender's Defense or Special
      let D = typeModifier[pType][eaType];
      // Y: typeModifers
      let Y = typeModifier[eType][pType] * 10;
      // X: same-Type attack bonus
      let X = 1;
      if(eType == eaType){
        X = 1.5;
      }
      let Z = Math.floor(Math.random() * 255 + 217);
      //((2A/5+2)*B*C)/D)/50)+2)*X)*Y/10)*Z)/255
      //(((((((2 * A / 5 + 2) * B * C) / D) / 50 + 2) * X) * Y / 10) * Z) / 255
      ans = (((((((2 * A / 5 + 2) * B * C) / D) / 50 + 2) * X) * Y / 10) * Z) / 255;
      //console.log(ans);
      // let's actually damge that pokemon
      let damage = ans/pokemons_caught[currentPokemonIndex].hp * 100;
      //console.log(damage);
      my_current_lvl -= damage;
      my_current_lvl = Math.floor(my_current_lvl);
      new Audio("sounds/Tackle.wav").play();
      document.getElementById("self_health").innerHTML = "<strong>Health:"+ my_current_lvl +"/100</strong>";
      if(my_current_lvl <= 0){
        alert("You are defeated.");
        if(myMoney/2 >= 0 ){
          myMoney /= 2;
        }
        resume_game();
      }
      current_turn = turn[0];
    }
  }
  else{
    //console.log("Enemy waiting for battle");
  }
}

function calculateLvl(){
  let A = (enemy_hp/10) * 2 + 10;
  let C = (enemy_hp/10 + pokemons_caught[currentPokemonIndex].hp/10 + 10);
  let B = (pokemons_caught[currentPokemonIndex].base_experience * (enemy_hp/10)/5);

  //floor( floor(√(A) * (A * A)) * B / floor(√(C) * (C * C))) + 1
  let exp = Math.floor(Math.floor(Math.sqrt(A) * (A * A)) * B / Math.floor(Math.sqrt(C) * (C*C))) + 1;
  console.log(exp);
  return exp;
}
