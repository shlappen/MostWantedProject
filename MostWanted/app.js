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
  var input = prompt("Which trait would you like to search by?" + "\n" +
  "'1': Gender" + "\n" +
  "'2': Height" + "\n" +
  "'3': Weight" + "\n" +
  "'4': Eye Color" + "\n" +
  "'5': Occupation" + "\n" +
  "'6': Clear Search" + "\n" +
  "Select by number or enter'restart' to go back to beginning.");
  return input;
}

function runSearch(people){
  //change variable
  var foundPeople = people;
  var isSearching = true;

  while (isSearching){
    //user chooses option:
    var input = displaySearchOptionList();

    if(input == "6"){
      isSearching = false;
    } else {
      foundPeople = enterSearchCriteria(foundPeople, input, people);

    //if foundPeople has no people in it:
      if(!foundPeople)
      {
        alert("No matches found. Please try again.");
        runSearch(people); //start over
      }
      //otherwise display the people that were found:
      else{
        displayPeople(foundPeople);
      }
    }
  }
  runSearch(people);
}

function enterSearchCriteria(foundPeople, input, people){
  switch(input){
    case "1":
      var trait = "gender";
      var selection = promptFor("Are they male or female?", maleFemale);
      foundPeople = getPeople(trait, selection, foundPeople);
      break;
    case "2":
      var trait = "height";
      var selection = parseInt(promptFor("What is their " + trait + " in inches?", ints));
      foundPeople = getPeople(trait, selection, foundPeople);
      break;
    case "3":
      var trait = "weight";
      var selection = parseInt(promptFor("What is their " + trait + " in pounds?", ints));
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
      default:
      return runSearch(people); //ask again
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
    case "d":
    // TODO: get person's descendants
      searchForDescendants(person, people);
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
var descendantsToReturn = [];
function searchForDescendants(person, people){
  //first we identify the person who we are checking to see if they have children
  let idToCheck = person[0].id;
  let personName = person[0].firstName + " " + person[0].lastName;
  // Now lets loop through the people's array and see who even has parents listed
  var foundParents = people.filter(function(el){
    if(el.parents.length != 0){
      return true;
    }
    else{
      return false;
    }
  })
  // We have the array and no let's keep only the people who have parents listed
  var nonFalsePeopleWithParents = foundParents.filter(Boolean);
 // Now let's go through this Array and see if this person has any children by matching their id to an id in someone else's parent Array
 nonFalsePeopleWithParents.map(function(el){
    //Let's loop through the nonFalsePeopleWithParents Array and see if we have a match.
    for(let i = 0; i < el.parents.length; i++){
      if(el.parents[i] === idToCheck){
        if(el.gender === "male"){
          var offspringRelationship = "male descendant"
        }
        else{
          var offspringRelationship = "female descendant"
        }
        descendantsToReturn.push(el);
        var nextPersonToCheckForKids = 	[
          {
          "id": el.id,
          "firstName": el.firstName,
          "lastName": el.lastName,
          "gender": el.gender,
          "dob": el.dob,
          "height": el.height,
          "weight": el.weight,
          "eyeColor": el.eyeColor,
          "occupation": el.occupation,
          "parents": el.parents,
          "currentSpouse": el.currentSpouse
        }
        ];
        console.log(personName + " has descendent: " + el.firstName + " " + el.lastName + ": " + offspringRelationship);
        searchForDescendants(nextPersonToCheckForKids, people);
      }
    }
  })  
  // if(descendantsToReturn && descendantsToReturn.length){
  //   alert(personName + "has the following descendant(s):");
  //   displayPeople(descendantsToReturn);
  // }
  return descendantsToReturn;
}

function searchForFamily(person, people){
  var spouseList = findCurrentSpouse(person, people);
  var parentList = findParents(person, people);
  var childrenList = findChildren(person, people);
  var allFamily = spouseList.concat(parentList);
  allFamily = allFamily.concat(childrenList);
  // let personInfo = person[0].firstName + person[0].lastName + "'s Known Family: \n";
  // prompt(personInfo);
  return allFamily;
}

function findChildren(person, people){
  //first we identify the person who we are checking to see if they have children
  let idToCheck = person[0].id;
  // Now lets loop through the people's array and see who even has parents listed
  var foundParents = people.filter(function(el){
    if(el.parents.length != 0){
      return true;
    }
    else{
      return false;
    }
  })
  // We have the array and no let's keep only the people who have parents listed
  var nonFalsePeopleWithParents = foundParents.filter(Boolean);
 // Now let's go through this Array and see if this person has any children by matching their id to an id in someone else's parent Array
  var childrenToReturn = nonFalsePeopleWithParents.filter(function(el){
    //Let's loop through the individual's parent Array and see if we have a match.
    for(let i = 0; i < el.parents.length; i++){
      if(el.parents[i] === idToCheck){
        if(el.gender === "male"){
          var offspringRelationship = "son";
        }
        else{
          var offspringRelationship = "daughter";
        }
        console.log(el.firstName + " " + el.lastName + ": " + offspringRelationship);
        return true;
      }
      else{
        return false;
      }
    }
  })
  return childrenToReturn;
}

function findParents(person, people){
  let personName = person[0].firstName + " " + person[0].lastName;
  var parentsToCheck = person[0].parents;
  var parentsToReturn =[];
  if (parentsToCheck.length != 0){
    parentsToCheck.forEach(function (arrayItem) {
      var parentId = arrayItem;
      //Now we have the parent's id, we can cross check them against "the people" and get their info to output their names and relationships
      people.forEach(function (peoplesItem) {
        if(peoplesItem.id === parentId){
          //now we get gender to determine relationship
          if(peoplesItem.gender === "male"){
            var parentalRelationship = "father";
          }
          else{
            var parentalRelationship = "mother";
          }
          //Now that we have the person and the relationship we will output the info
          console.log(peoplesItem.firstName + " " + peoplesItem.lastName + ": " + parentalRelationship);
          //displayPersonNameAndRelationship(peoplesItem, parentalRelationship);
          parentsToReturn.push(peoplesItem);
        }
    });
  });
  }
  else{
    //alert(personName + " does not have any known parents.");
    console.log(personName + " does not have any known parents.");
    parentsToReturn = [];
  }
  return parentsToReturn;
}

function findCurrentSpouse(person, people){
  let spouseInfo = "Current Spouse: ";
  let idToCheck = person[0].id;
  var spouseToCheck = person[0].currentSpouse;
  var foundFamily = people.filter(function(personToCheck){
    if(personToCheck.currentSpouse === idToCheck){
        console.log(personToCheck.firstName + " " + personToCheck.lastName + ": spouse");
      return true;
    }
    else{
      spouseInfo += "none known \n";
      return false;
    }
  })
  return foundFamily;
}

// alerts a list of people // for displaying multiple people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPersonNameAndRelationship(person, relationship){
  alert(person.firstName + " " + person.lastName + ": " + relationship);
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

// function intsRestart(input){
//   if(0 < parseInt(input) < 7
//      || input.toLowerCase() == "restart"){
//     return true;
//   }
//     else{
//     return false;
//     }
//   }

function ints(input){
  if(parseInt(input)){
    return true;
  }
  else{
    return false;
  }
}


function maleFemale(input){
  return input.toLowerCase() == "male" || input.toLowerCase() == "female";
}

