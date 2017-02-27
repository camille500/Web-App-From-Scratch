# Web-App-From-Scratch
This readme contains all documentation and annotations made during the course.

## Links to Github Pages
- [Click here for Assignment 5 - Spa](https://camille500.github.io/Web-App-From-Scratch/Assignment%205%20-%20Spa/index.html)
- [Click here for Assignment 6 - Single Page Movie Application](https://camille500.github.io/Web-App-From-Scratch/Assignment%206%20-%20API's%20&%20Routing/)
- [Click here for the Final Assignment - MovieSpot](http://camille-sebastien.com/moviespot)

## Navigation
- [Annotations lesson 1 - 06/02/2017](#annotations-lesson-1---06022017)
- [Assignments 1st week](#assignments-1st-week)
- [Annotations lesson 2 - 08/02/2017](#annotations-lesson-2---08022017)
- [Functional Programming](#annotations-functional-programming)
- [ES6 Course Annotations](#es6-course-annotations)

## Annotations lesson 1 - 06/02/2017

This are the annotations of the first lesson Web App From Scratch. The annotations are part of the live coding example in class: http://codepen.io/Razpudding/pen/XpBbXa?editors=1010

### Objects and methods

- An **object** is an unordered list of primitive data types (numbers, strings, booleans, undefined, null). Each item in the unordered list is called a **property**. (1.1)

```javascript
    var student = {
        name: "Camille",
        age: 23  
    }
```

- It is also possible to make an **array of objects**:
```javascript
    var students = [
        {
            name: "Camille",
            age: 23  
        },
        {
            name: "John Doe",
            age: 27
        }
    ];
```

- A **method** is a **function inside an object**.
```javascript
var student = {
    name: "Camille",
    age: 23,
    smart: true,
    generateMyInfo: function() {
      return generateStudentInfo([this.name, this.age]);
    }
  }

  // This is how u can call the method:
  student.generateStudentInfo();
```

- After calling the method (see above), a function outside of the object is called. It has two **arguments**: The name and age of the student.

- The function below has a **parameter** called 'infoArray'. It stores the arguments given in the example above as array. The **For Loop** loops trough all the items in that array.

```javascript
function generateStudentInfo(infoArray) {
  for (var i in infoArray) {
    console.log('Infofield: ' + i + ' : ' + infoArray[i]);
  }
};
```

### This and Strict Mode

- Using **Strict mode**, your code will be validated in a more strict way than normal. It makes it impossible to use a variable with the same name multiple times for example. It can be placed on the first line of your code. (1.2)

```javascript
"use strict";
```

- The **this** keyword can (for example) be used in a function. When 'this' is used inside a function, it contains information given to that function. (1.3)

### Sources Lesson 1
- (1.1) http://javascriptissexy.com/16-javascript-concepts-you-must-know-well/
- (1.2) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
- (1.3) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

## Assignments 1st week

These are all the assignments I've completed in the first week of Wep App From Scratch.

### Pros and cons of JavaScript frameworks
___
For this assignment I've been doing some research on the pros and cons of using JavaScript frameworks or libraries. The sources are listed below.

#### Pros
- Using frameworks can save you a lot of time. They consist out of stable code and offer all sorts of functions. Before you start a project, half of the work is already done (1.4).
- Most frameworks are provided with a great documentation. This will help you learn faster then when you have to write and learn to understand all the code yourself.
- The bigger frameworks are mostly well secured. When building your own code, it's more likely that there are security issues (1.5).
- Lots of frameworks are open source. It saves a lot of money to use them instead of reinventing the wheel (1.5).

#### Cons

- When using frameworks, you won't learn the language. For example: When using Angular, you learn Angular, not JavaScript (1.5).
- There are many different frameworks available. Some of them are used and updated for a long time, but it can also occur that a framework gets deprecated. In that case you've to build the whole app from ground up again. That takes a lot of time (1.5).
- Frameworks have limitations. The code is already made, and most of the time it's really hard to change something in the framework. Because of that you can not always achieve to build the functionality you want in an application (1.4).

#### The reason why we won't use jQuery
jQuery is a library that can be used to manipulate the DOM. The reason many programmers use it, is because it makes it easy to select and change DOM elements. The problem with jQuery is, is that its not really JavaScript. When building applications that need reusable code blocks, jQuery can start to become a problem. If you get used to using jQuery, you forget or don't even learn how to do some things in JavaScript. That limitates what you can do and prevents you from becoming a great JavaScript developer (1.6). It can be used sometimes, but I understand the fact that we won't use it during the minor. The goal is to make us better developers, and then it's better to write the same functionality in Vanilla JavaScript.

### Pros and cons of single page web applications
___
For this assignment I've been doing some research on the pros and cons of building single page web applications. The sources are listed below.

#### Pros

- Single page web applications are often smaller in size (KB) then multi page apps. Because of that the page and functionality will be faster (1.7).
- The user experience is better, because singe page apps are easy to understand. There are no pages the user have to navigate through. It's also clear where the app starts and where it ends (1.8).
- Its easier to develop the site for mobile. Thats because you can use the same backend as you're using for the desktop version (1.8)

#### Cons

- There isn't space for a lot of content. The best description I've found online to descripe this is: The biggest danger is falling into the trap of stuffing “10 pounds of stuff into a 5 pound bag.” (1.8).
- Because there is just one page and not so much content, it's hard to increase the SEO (1.7).

### Sources Assignments Week 1
- (1.4) http://www.noupe.com/development/javascript-frameworks-94897.html
- (1.5) http://1stwebdesigner.com/web-frameworks/
- (1.6) http://moveelo.com/blog/why-you-should-stop-using-jquery-for-everything
- (1.7) http://www.eikospartners.com/blog/multi-page-web-applications-vs.-single-page-web-applications
- (1.8) https://www.uxpin.com/studio/blog/single-page-vs-multi-page-ui-design-pros-cons/

## Annotations lesson 2 - 08/02/2017
This are the annotations of the second lesson Web App From Scratch.

### Constructor function

- Using a **constructor function** it's possible to create an **object type** that can be used multiple times. In that way you won't have to define that object for every instance (1.9).

```javascript
function CarModels(model,year,miles) {
  this.model = model;
  this.year = year;
  this.miles = miles;
}
```

- The example above is an constructor function. Using the function, its easy to make multiple instances as showed in the example below.

```javascript
var volkswagen = new CarModels("Volkswagen Golf", 2016, 1400);
```

- The variable 'volkswagen' is filled with an object containing the name of the car, the year it was build and the amount of miles driven.

### Prototype function

- Using a prototype function, it's possible to create an function that can be used by every instance of the object it is used on. It's important to declare the instances below the prototype function.

```javascript
CarModels.prototype.toString = function() {
  return "This " + this.model + " from " + this.year + " has driven " + this.miles + " miles";
};
```

- The function above is now available for every instance of the CarModels object. In the example below you can see how the prototype function can be called.

```javascript
volkswagen.toString()
```

### Sources Lesson 2
- (1.9) http://www.javascriptkit.com/javatutors/oopjs2.shtml

## Annotations Functional Programming

- A ***pure function*** is an function that does nothing outside it's own scope. It always returns the same results.
- A ***unary function*** is a function with one parameter, and one return value.

```javascript
function calculateAmount(value) {
    return value * 2;
}
```
- ***Hoisting*** is JavaScript's default behavior of moving declarations to the top (2.1).

### Map, Filter and Reduce

- ```map``` loops over all items in an array.

```javascript
    const array = [7,12,82,91,16,21];
    array.map(function(number) {
        console.log(number);
    });
```
- The code above logs all numbers in the array (one by one) to the console.
- ```filter``` can be used to, for example, only return values higher than 15.

```javascript
    const array = [7,12,82,91,16,21];
    let filtered = array.filter(function(value) {
      return (value > 15);
     });
```
- The code above returns all values higher than 15.
- The ***reduce*** method returns a string from a array.

### Sources Functional Programming
- (2.1) https://www.w3schools.com/js/js_hoisting.asp

## ES6 Course Annotations
-  The ***let*** variable is only available in block-scope. It's contents are not constant. Use let when you need to reassign a variable, or scope a variable at block level.
-  The ***const*** variable is constant, and can't be overwritten. Properties in an const variable can be overwritten though.

```javascript
let thisCanChange = "Hi";
const apiKey = "28372n3h2uf83jf2";
```

- In ES6 there is a new way to concat strings and variables. Using the backtick and ```${ ... }```, you can concat a string and variable.

```javascript
const  studentName = "Camille Sébastien";
let string = `Hallo, mijn naam is ${studentName}.`
```
- There are also a lot of new string methods.

```javascript
// Checks if the string starts with 'Hallo', in this case TRUE will be returned
console.log(string.startsWith('Hallo'));
// Checks if the word 'Hallo' begins from the 3rd character, in this case False
console.log(string.startsWith('Hallo', 2));
// Checks if the string ends with 'oud', in this case TRUE will be returned
console.log(string.endsWith('oud'));
 // Checks only 20 characters, and thus if 'oud' is at the last 3 of the 20 characters, in this case False
console.log(string.endsWith('oud', 20));
// Checks if 'Ik ben' is included inside the string, in this case TRUE.
console.log(string.includes('Ik ben'));
```

- ES6 Introduces a new way to declare functions, using arrow functions

```javascript
// No argument
const sayHi = () => {
  console.log('Hi.');
}

// Single argument
const greetStudent = name => console.log(`Hi ${name}.`);

// Multiple arguments
const logStudentInfo = (name, age) => {
  console.log(`${name} is ${age} jaar oud.`)
}

// Default parameters
const logPrice = (price = 22) => { // If 'price' is undefined, the value of 'price' will be 22.
  console.log(`The item costs €${price},-`);
}
```

### Sources ES6 Course Annotations
- (2.2) https://teamtreehouse.com/library/getting-started-with-es2015
- (2.3) https://teamtreehouse.com/library/introduction-to-babel


## More annotations will follow
