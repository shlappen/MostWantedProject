"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      runSearch(people);
      break;
      default:
    app(people); // restart app
      break;
  }
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}


function displaySearchOptionList(){
  var input = promptFor("Which trait would you like to search by?" + "\n" +
  "'1': Gender" + "\n" +
  "'2': Height" + "\n" +
  "'3': Weight" + "\n" +
  "'4': Eye Color" + "\n" +
  "'5': Occupation" + "\n" +
  "'6': Start new search" + "\n" +
  "Type the number of the option you want or 'restart' or 'quit'", ints);
  return input;
}

function runSearch(people){
  var foundPeople = people;
  var isSearching = true;
  while (isSearching){
    var input = displaySearchOptionList();
    if(input == "6"){
      isSearching = false;
    } else {
      foundPeople = enterSearchCriteria(foundPeople, input);
      if(!foundPeople)
      {
        alert("No matches found. Please try again.");
        runSearch(people);
      }
      else{
        displayPeople(foundPeople);
      }
    }
  }
  runSearch(people);
}

function enterSearchCriteria(foundPeople, input){
  switch(input){
    case "1":
      var trait = "gender";
      var selection = promptFor("Are they male or female?", chars);
      foundPeople = getPeople(trait, selection, foundPeople);
      break;
    case "2":
      var trait = "height";
      var selection = parseInt(promptFor("What is their " + trait + " in inches?", chars));
      foundPeople = getPeople(trait, selection, foundPeople);
      break;
    case "3":
      var trait = "weight";
      var selection = parseInt(promptFor("What is their " + trait + " in pounds?", chars));
      foundPeople = getPeople(trait, selection, foundPeople);
      break;
    case "4":
      var trait = "eyeColor";
      var selection = promptFor("What is their eye color?", chars);
      foundPeople = getPeople(trait, selection, foundPeople);
      break;
    case "5":
      var trait = "occupation";
      var selection = promptFor("What is their " + trait + "?", chars);
      foundPeople = getPeople(trait, selection, foundPeople);
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
      default:
      return runSearch(foundPeople); //ask again and search by a different trait
  }
  return foundPeople;
}

function getPeople(key, value, foundPeople){
  foundPeople = foundPeople.filter(function(person){
    if(person[key] == value){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPeople;
}



// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  var displayOption = prompt("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
    displayPerson(person);
    // TODO: get person's info
    break;
    case "family":
      searchForFamily(person, people);
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  var foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })

  // TODO: find the person using the name they entered
  
  return foundPerson;
}

function displayFamily(person, relationship){
  // Find if there are any family members
  var theFamily = searchForFamily(person);
  for (let i = 0; i < theFamily.length; i++) {
    
  }
  
  let personInfo = "ID: " + person[i].id + "\n";
  personInfo += "First Name: " + person[i].firstName + "\n";
  personInfo += "Last Name: " + person[i].lastName + "\n";
  personInfo += "Relationship: " + relationship + "\n";
  // personInfo += "DOB: " + person[0].dob + "\n";
  // personInfo += "Height: " + person[0].height + "\n";
  // personInfo += "Weight: " + person[0].weight + "\n";
  // personInfo += "Eye Color: " + person[0].eyeColor + "\n";
  // personInfo += "Occupation: " + person[0].occupation + "\n";
  // personInfo += "Parents: " + person[0].parents + "\n";
  // personInfo += "Current Spouse: " + person[0].currentSpouse + "\n";
  // TODO: finish getting the rest of the information to display
  //alert(personInfo);
  console.log(personInfo);
}

function searchForFamily(person, people){
  var spouseList = findCurrentSpouse(person, people);
  var parentList = findParents(person, people);
  return spouseList;
}

function findParents(person, people){
  let idToCheck = person[0].id;
  let personName = person[0].firstName + " " + person[0].lastName;
  // parentsToCheck is the name of the Array each person has containing known parents
  var parentsToCheck = person[0].parents;
  // Now lets loop through the parentsToCheck Array and get their ids
  if (parentsToCheck.length != 0){
    parentsToCheck.forEach(function (arrayItem) {
      var parentId = arrayItem;
      //console.log(parentId);
      //Now we have the parent's id, we can cross check them against "the people" and get their info to output their names and relationships
      people.forEach(function (peoplesItem) {
        if(peoplesItem.id === parentId){
          //now we get gender to determine relationship
          if(peoplesItem.gender === "male"){
            var parentalRelationship = "father"
          }
          else{
            var parentalRelationship = "mother"
          }
          //Now that we have the person and the relationship we will output the info
          console.log(peoplesItem.firstName + " " + peoplesItem.lastName + ": " + parentalRelationship);
          
        }
        //var x = peoplesItem.id + 2;
        //console.log(x);
    });
      
      //console.log(x);
  });
  }
  else{
    //alert(personName + " does not have any known parents.");
    console.log(personName + " does not have any known parents.");
  }
}

function findCurrentSpouse(person, people){
  var spouseToCheck = person[0].currentSpouse;
  var foundFamily = people.map(function(el){
    if(spouseToCheck === el.id){
      let relationship = "spouse";
      console.log(el.firstName + " " + el.lastName + ": spouse");
      //displayFamily(el, relationship);
      return el;
    }
    else{
      return false;
    }
  })
  var nonFalseFoundSpouse = foundFamily.filter(Boolean);
  return nonFalseFoundSpouse;
}

// alerts a list of people // for displaying multiple people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "ID: " + person[0].id + "\n";
  personInfo += "First Name: " + person[0].firstName + "\n";
  personInfo += "Last Name: " + person[0].lastName + "\n";
  personInfo += "Gender: " + person[0].gender + "\n";
  personInfo += "DOB: " + person[0].dob + "\n";
  personInfo += "Height: " + person[0].height + "\n";
  personInfo += "Weight: " + person[0].weight + "\n";
  personInfo += "Eye Color: " + person[0].eyeColor + "\n";
  personInfo += "Occupation: " + person[0].occupation + "\n";
  personInfo += "Parents: " + person[0].parents + "\n";
  personInfo += "Current Spouse: " + person[0].currentSpouse + "\n";
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}


// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}


// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}

function ints(input){
  if(0 < parseInt(input) < 6 || input.toLowerCase == "quit" || input.toLowerCase == "restart"){
    return true;
  }
}
