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
      GetSearchCriteria();
      app(people)
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
  "'6': Search" + "\n" +
  "Type the number of the option you want or 'restart' or 'quit'", chars);
  //add to array?
  return input;
}

function getSearchCriteria(){
  let searchParameters = [];
  var isSearching = true;
  while (isSearching){
    var input = displaySearchOptionList();
    if(input == "6"){
      isSearching = false;
    } else {
      searchParameters = enterSearchCriteria(searchParameters, input);
    }
  }
  return searchParameters;
}

// {"Gender": ""}, {"Height" : 0}, {"Weight" : 0}, {"Eye Color" : ""}, {"Occupation" : ""}

function enterSearchCriteria(searchParameters, input){
  switch(input){
    case "1":
      searchParameters.push({"gender" : promptFor("Male or female?", chars)});
      break;
    case "2":
      searchParameters.push({"height" : promptFor("Please enter height in inches.", chars)});
      break;
      default:
        getSearchCriteria();
  }
  return searchParameters;
}

//  function searchByMultipleTraits(people){
//   var value;
//   var traitName;
//   var trait = displaySearchOptionList();
//   switch(trait){
//     case '1':
//       traitName = "gender"
//       value = promptFor("Male or female?", chars);
//       people = getPeople(people, traitName, value);
      
//       break;

//     case '2':
//       traitName = "height";
      
//       value = promptFor("Please enter height in inches.", chars);
//       people = getPeople(people, traitName, value);
//       trait = displaySearchOptionList()
//       break;
    // case '3':
    //   let trait = "weight";
    //   let value = promptFor("Please weight in pounds.", chars);
    //   searchResults = searchBy(people, trait, value);
    //   break;
    // case '4':
    //   let trait = "eyeColor"
    //   let value = promptFor("Please weight in pounds.", chars);
    //   searchResult = searchBy(people, trait, value);
    //   break;
    // case '5':
    //   let trait = "occupation"
    //   let value = promptFor("What is their occupation?", chars);
    //   searchResult = searchBy(people, trait, value);
    //   break;
  //   case '6':
  //     displayPeople(people);
  //   default: 
  //   app(people);
  //     break;
  // }
// }

// function getPeople(people, traitName, value){
// var foundPeople = people.filter(function(person){
//   if(person[traitName] == value){
//     return true;
//   }
//   else{
//     return false;
//   }
// })
// return foundPeople;
// }

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
    // TODO: get person's family
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
  personInfo += "Current Spouse: " + person[0].currentSpouse + "\n";
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
