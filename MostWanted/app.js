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
    case "descendants":
    // TODO: get person's descendants
      let descendantOutput = searchForDescendants(person, people);
      displayDescendants(descendantOutput);
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
  // TODO: find the person using the name they entered
  var foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })

  if(foundPerson == null || foundPerson.length === 0){
    alert("Could not find that individual.");
    return app(people); // restart
  }
  else{
    return foundPerson;
  }
}
var descendantsToReturn = [];
var descendantDisplayText = "";
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
  //var descendantDisplayText = "";
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
        descendantDisplayText = descendantDisplayText + el.firstName + " " + el.lastName + " is a " + offspringRelationship + " of " + personName + " \n";
        //Example of recursive function using searchForDescendants function <===================================================================CHECK THIS OUT=======================================
        searchForDescendants(nextPersonToCheckForKids, people);
      }
    }
  })
  return descendantDisplayText;
  //return descendantsToReturn;
}

function searchForFamily(person, people){
  var spouseList = findCurrentSpouse(person, people);
  var parentList = findParents(person, people);
  var childrenList = findChildren(person, people);
  var siblings = findSiblings(person, parentList, people)
  //var allFamily = spouseList.concat(parentList);
  //allFamily = allFamily.concat(childrenList);
  // let personInfo = person[0].firstName + person[0].lastName + "'s Known Family: \n";
  // prompt(personInfo);
  //return allFamily;
  displayPersonFamilyInfo(person, spouseList, parentList, childrenList, siblings)
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

function findSiblings(person, parentList, people){
  var personId = person[0].id;
  var siblings;
  var i;
  //filter peopleWithParents list for people whose parent's id matches one of the subject's parents' id
  if(parentList.length != 0){
    for(i = 0; i < parentList.length; i++){
      siblings = people.filter(function(person){
        if(person.parents[i] == parentList[i].id && personId != person.id){
          return true;
        }
        else{
          return false;
        }
      })
    }
  }
  else{
    siblings = [];
  }
  return siblings;
}



function findCurrentSpouse(person, people){
  var spouseToCheck = person[0].currentSpouse;
  //Example of .map array method <===================================================================CHECK THIS OUT=======================================
  var foundFamily = people.map(function(el){
    if(spouseToCheck === el.id){
      console.log(el.firstName + " " + el.lastName + ": spouse");
      return el;
    }
    else{
      return false;
    }
  })
  var nonFalseFoundSpouse = foundFamily.filter(Boolean);
  return nonFalseFoundSpouse;
}


//DISPLAY FUNCTIONS
// alerts a list of people // for displaying multiple people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}


function displayDescendants(descendantInput){
  let infoToShow = "Descendants: " + "\n";
  infoToShow =infoToShow + descendantInput;
  alert(infoToShow);
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

function displayPersonFamilyInfo(person, spouseArray, parentArray, childrenArray, siblingArray){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = person[0].firstName + " " + person[0].lastName + " Family Info\n";
  personInfo += "----------"+ "\n";
  personInfo += "Current Spouse: " + "\n";
  if(spouseArray.length === 0){
    personInfo += "--> unknown" + "\n";
  }
  else{
    for(let i = 0; i < spouseArray.length; i++){
        personInfo += "-->" + spouseArray[i].firstName + " " + spouseArray[i].lastName + "\n";
    }
  }
  personInfo += "----------"+ "\n";
  personInfo += "Parents: " + "\n";
  if(parentArray.length === 0){
    personInfo += "--> unknown" + "\n";
  }
  else{
    for(let i = 0; i < parentArray.length; i++){
        personInfo += "-->" + parentArray[i].firstName + " " + parentArray[i].lastName;
        if(parentArray[i].gender === "male"){
          personInfo += ", father" + "\n";
        }
        else{
          personInfo += ", mother" + "\n";
        }
    }
  }
  personInfo += "----------"+ "\n";
  personInfo += "Children: " + "\n";
  if(childrenArray.length === 0){
    personInfo += "--> unknown" + "\n";
  }
  else{
    for(let i = 0; i < childrenArray.length; i++){
        personInfo += "-->" + childrenArray[i].firstName + " " + childrenArray[i].lastName;
        if(childrenArray[i].gender === "male"){
          personInfo += ", son" + "\n";
        }
        else{
          personInfo += ", daughter" + "\n";
        }
    }
  }
  personInfo += "----------"+ "\n";
  personInfo += "Siblings:"+ "\n";
  if(siblingArray.length === 0){
    personInfo += "--> unknown" + "\n";
  }
  else{
    for(let i = 0; i < siblingArray.length; i++){
      personInfo += "-->" + siblingArray[i].firstName + " " + siblingArray[i].lastName;
      if(siblingArray[i].gender === "male"){
        personInfo += ", brother" + "\n";
      }
      else{
        personInfo += ", sister" + "\n";
      }
    } 
  }
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}




//VALIDATION
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

