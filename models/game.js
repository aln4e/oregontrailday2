var fs = require('fs')

class Game {
  constructor(id){
    this.partyMembers = [] //array of each partyMember (object)
    this.supplies = {
      oxen: Math.floor(Math.random()*0)+1, //10 ox
      wagonAxels: Math.floor(Math.random()*0)+1, //5 axels
      wagonWheels: Math.floor(Math.random()*0)+1, //6 wheels
      wagonTongues: Math.floor(Math.random()*0)+1, //10 tongues
      setsClothing: Math.floor(Math.random()*20)+1,
      bullet: Math.floor(Math.random()*500)+1,
      poundsFood: Math.floor(Math.random()*200)+101
    }
    this.recentlyBroken = ""
    this.recentlyRecovered = ""
    this.recentlyDeceased = ""
    this.recentlyFellIll = ""
    this.brokeDown = false
    this.locations = [
        { name: "Rachel's Death Valley",
          source: "a.png"},
        { name: "Brady's Terranium",
          source: "b.png"},
        { name: "nicks's Terranium",
          source: "b.png"},
        { name: "alex's Terranium",
          source: "b.png"},
        { name: "antonio's Terranium",
          source: "b.png"},
        { name: "gabe's Terranium",
          source: "b.png"},
        { name: "Brady's bungalow",
          source: "b.png"},
        { name: "Rachel's Death Valley",
          source: "a.png"},
        { name: "Rachel's Death Valley",
          source: "a.png"},
        { name: "Rachel's Death Valley",
          source: "a.png"},
        { name: "Rachel's Death Valley",
          source: "a.png"},
        { name: "Rachel's Death Valley",
          source: "a.png"}
      ] // all the locations in the game
    this.daysSpent = 0;
    this.currentLocation = 0; // index of the locations array
    this.diseases = [
      {name: "cholera", chance: 30},
      {name: "dysentery", chance: 20},
      {name: "broken leg", chance: 80},
      {name: "broken arm", chance: 60},
      {name: "bitten by snake", chance: 100},
      {name: "influenza", chance: 20},
      {name: "spontaneous combustion", chance: 5000}
    ]
    if (id === undefined) {
      this.id = Date.now()
    }
    else {
      this.id = id
    }
  }

  save(){
    fs.writeFileSync('game' + this.id + '.json', JSON.stringify(this))
  }

  load(){
    var rawFile = fs.readFileSync('game' + this.id + '.json')
    var tempGame = JSON.parse(rawFile)
    this.partyMembers = tempGame.partyMembers
    this.supplies = tempGame.supplies
    this.locations = tempGame.locations
    this.daysSpent = tempGame.daysSpent
    this.currentLocation = tempGame.currentLocation
    this.brokeDown = tempGame.brokeDown
    this.recentlyBroken = tempGame.recentlyBroken
  }

//WAGON: these two functions apply probabilities upon wagon breaking down, then decrement from our remaining supplies

  getBroke(chance){
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1){
      return true
    }
    return false
  }

  checkWagon(){
    let allSupplies = Object.getOwnPropertyNames(this.supplies)
    for (var i = 0; i<4; i++){
      if(this.getBroke(10)){
        let selectedSupply = allSupplies[i]
        this.supplies[selectedSupply] -= 1
        if (this.supplies[selectedSupply] < 0){
          this.brokeDown = true
        }
        this.recentlyBroken = selectedSupply
        return true
      }
    }
    return false
  }

//SICKNESS: these two functions apply sickness to a member depending upon probabilites

  getSick(chance){
    //let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1){
      return true
    }
    return false
  }

  checkSick(){
    for (var i = 0; i < this.partyMembers.length; i++){
      if (this.partyMembers[i].status == "well"){
        for(var j=0; j < this.diseases.length; j++){
            if(this.getSick(this.diseases[j].chance)){
              this.partyMembers[i].status = "sick";
              this.partyMembers[i].disease = this.diseases[j].name;
              this.recentlyFellIll = this.partyMembers[i]
              return true;
            }
          }
      }
    }
    return false;
  }

//DEATH: Given that the member is ill, there are probabilities to determine whether the member dies from that illness

  die(chance, partyMemberIndex){
    let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1){
      this.partyMembers[i].status = "dead";
      this.recentlyDeceased = this.partyMembers[i].name
      return true
    }
    return false
  }

  checkDead(){
    for (var i = 0; i < this.partyMembers.length; i++){
      if (this.partyMembers[i].status == "sick"){
        switch(this.partyMembers[i].disease){
          case "dysentery":
            if (this.die(2, i)){
              return true
            }
            break;
          case "cholera":
            if (this.die(2, i)){
              return true
            }
            break;
          case "broken leg":
            if (this.die(20, i)){
              return true
            }
            break;
          case "broken arm":
            if (this.die(100, i)){
              return true
            }
            break;
          case "bitten by snake":
            if (this.die(3, i)){
              return true
            }
            break;
          case "influenza":
            if (this.die(50, i)){
              return true
            }
            break;
          case "spontaneous combustion":
            if (this.die(1, i)){
              return true
            }
            break;
          default:
            break;
        }
      }
    }
    return false
  }

  //RECOVERY: these two functions run probabilites to see if a diseased party member recovers from his illness

  diseaseRecovery(chance, partyMemberIndex){
    let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1){
      this.partyMembers[i].disease = ""
      this.partyMembers[i].status = "well"
      this.recentlyRecovered = this.partyMembers[i].name
      return true
    }
  }

  checkRecovered(){
    for (var i = 0; i < this.partyMembers.length; i++){
      if (this.partyMembers[i].status == "sick"){
        switch(this.partyMembers[i].disease){
          case "dysentery":
            if (this.diseaseRecovery(4, i)){
              return true
            }
            break;
          case "cholera":
            if (this.diseaseRecovery(20, i)){
              return true
            }
            break;
          case "broken leg":
            if (this.diseaseRecovery(5, i)){
              return true
            }
            break;
          case "broken arm":
            if (this.diseaseRecovery(3, i)){
              return true
            }
            break;
          case "bitten by snake":
            if (this.diseaseRecovery(10, i)){
              return true
            }
            break;
          case "influenza":
            if (this.diseaseRecovery(3, i)){
              return true
            }
            break;
          default:
            break;
        }
      }
    }
    return false
  }

// LOSING CONDITIONS: these two functions are to build a losing condition (all dead) and then check all other losing conditions (no food, wagon broken)

  bodyCount(){
    let headCount = 0
    this.partyMembers.forEach(function(member){
    if (member.status !== "dead"){
      headCount++
    }
  })
    return headCount
  }

  checkLose(){
    if(this.bodyCount() == 0 || this.supplies.poundsFood <= 0 || this.brokeDown){
      return true
    }
    return false
  }

//PLAY: this is the heart of the application and determines which screens are shown depending upon the course of the game

  takeTurn(){
    if (this.currentLocation === this.locations.length-1 ){
      return "game-won"
    }
    if (this.checkLose()){
      return "lose"
    }
    if (this.checkDead()){
      this.daysSpent += 5;
      this.supplies.poundsFood -= (2 * this.bodyCount()) ;
      if (this.supplies.poundsFood < 0){
        this.supplies.poundsFood = 0
      }
      return "dead"
    }
    if (this.checkRecovered()){
      return "recovered"
    }
    if (this.checkSick()){
      this.daysSpent += 2;
      this.supplies.poundsFood -= (1 * this.bodyCount()) ;
      if (this.supplies.poundsFood < 0){
        this.supplies.poundsFood = 0
      }
      return "sick"
    }
    if(this.checkWagon()){
      return "broke"
    }
    //check if recovered
    //check if sick
    // check if dead

    //check if damage
    //decrement supplies
    //if all false, next location
    this.currentLocation++;
    this.supplies.poundsFood -= (5 * this.bodyCount()) ;
    if (this.supplies.poundsFood < 0){
      this.supplies.poundsFood = 0
    }
    this.daysSpent += 10
    return 'location'
  }
}

module.exports = Game
