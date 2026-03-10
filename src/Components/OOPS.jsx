import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css'
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function OOPS() {

  useEffect(() => {
   window.scrollTo(0,0);
  }, []);

  return (
    <div className='debounce-container'>
      <h1 className="title">JavaScript OOP Concepts</h1>

      <div className="method-section">
        <h3>Introduction to OOP</h3>
        <p>
          Object-Oriented Programming (OOP) is a programming paradigm centered around the concept of "objects". 
          These objects can contain data in the form of fields (often referred to as properties or attributes) and code in the form of procedures 
          (often referred to as methods). OOP aims to implement real-world entities like inheritance, hiding, polymorphism, etc., in programming.
        </p>
        <p>
          OOP facilitates better organization of complex programs, promotes code reuse, and enhances maintainability by modeling real-world scenarios 
          more effectively. The four fundamental pillars of OOP are:
        </p>
        <ul>
          <li>Encapsulation: Bundling data with methods that operate on that data.</li>
          <li>Abstraction: Hiding complex implementation details and showing only the essential features.</li>
          <li>Inheritance: Mechanism where one class inherits properties and methods from another class.</li>
          <li>Polymorphism: Ability to present the same interface for different underlying data types.</li>
        </ul>
      </div>

      <div className="method-section">
        <h3>1. Classes and Objects</h3>
        <p>
          Definition: Classes are blueprints for creating objects. Objects are instances of classes.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    // Class Definition
    class Person {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }

        greet() {
            console.log(\`Hello, my name is \${this.name} and I am \${this.age} years old.\`);
        }
    }

    // Creating an object (instance of Person)
    let person1 = new Person('Alice', 30);
    person1.greet(); // Output: Hello, my name is Alice and I am 30 years old.

    // Methods of Class:
    // .constructor()     - Initializes new instances of the class
    // .greet()           - A method that logs a greeting message
    `}</CodeBlock>
        
      </div>

      {/* 2. Encapsulation */}
      <div className="method-section">
        <h3>2. Encapsulation</h3>
        <p>
          Definition: Encapsulation is the bundling of data with the methods that operate on that data. It restricts direct access to some of the object's components.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class EncapsulatedPerson {
        constructor(name, age) {
            this._name = name; // Convention to indicate private variable
            this._age = age;
        }

        get name() {
            return this._name;
        }

        set name(newName) {
            if (newName.length > 0) {
                this._name = newName;
            } else {
                console.log('Name cannot be empty');
            }
        }

        get age() {
            return this._age;
        }

        set age(newAge) {
            if (newAge > 0) {
                this._age = newAge;
            } else {
                console.log('Age must be a positive number');
            }
        }
    }

    let person2 = new EncapsulatedPerson('Bob', 25);
    console.log(person2.name); // Output: Bob
    person2.age = 26;
    console.log(person2.age); // Output: 26

    // Methods of EncapsulatedPerson:
    // .get name()       - Retrieves the name property
    // .set name(newName)- Sets the name property with validation
    // .get age()        - Retrieves the age property
    // .set age(newAge)  - Sets the age property with validation
    `}</CodeBlock>
        
      </div>

      {/* 3. Inheritance */}
      <div className="method-section">
        <h3>3. Inheritance</h3>
        <p>
          Definition: Inheritance is a mechanism where one class inherits the properties and methods of another class.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class Employee extends Person {
        constructor(name, age, jobTitle) {
            super(name, age); // Call the constructor of the parent class
            this.jobTitle = jobTitle;
        }

        work() {
            console.log(\`\${this.name} is working as a \${this.jobTitle}.\`);
        }
    }

    let employee1 = new Employee('Charlie', 28, 'Software Developer');
    employee1.greet(); // Output: Hello, my name is Charlie and I am 28 years old.
    employee1.work();  // Output: Charlie is working as a Software Developer.

    // Methods of Employee:
    // .work()           - Logs the job title of the employee
    `}</CodeBlock>
        
      </div>

      {/* 4. Polymorphism */}
      <div className="method-section">
        <h3>4. Polymorphism</h3>
        <p>
          Definition: Polymorphism is the ability to present the same interface for differing underlying data types.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class Shape {
        draw() {
            console.log('Drawing a shape');
        }
    }

    class Circle extends Shape {
        draw() {
            console.log('Drawing a circle');
        }
    }

    class Square extends Shape {
        draw() {
            console.log('Drawing a square');
        }
    }

    let shapes = [new Shape(), new Circle(), new Square()];
    shapes.forEach(shape => shape.draw());
    // Output:
    // Drawing a shape
    // Drawing a circle
    // Drawing a square

    // Methods of Shape and its subclasses:
    // .draw() - Overridden in subclasses to provide specific drawing behavior
    `}</CodeBlock>
        
      </div>

      {/* 5. Abstraction */}
      <div className="method-section">
        <h3>5. Abstraction</h3>
        <p>
          Definition: Abstraction means hiding the complex implementation details and showing only the essential features of the object.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class AbstractPerson {
        constructor(name, age) {
            if (this.constructor === AbstractPerson) {
                throw new Error("Cannot instantiate abstract class");
            }
            this.name = name;
            this.age = age;
        }

        // Abstract method (should be implemented by subclass)
        greet() {
            throw new Error("Abstract method has no implementation");
        }
    }

    class ConcretePerson extends AbstractPerson {
        greet() {
            console.log(\`Hello, my name is \${this.name} and I am \${this.age} years old.\`);
        }
    }

    let person3 = new ConcretePerson('David', 40);
    person3.greet(); // Output: Hello, my name is David and I am 40 years old.

    // Notes:
    // - AbstractPerson cannot be instantiated directly
    // - ConcretePerson implements the abstract greet() method
    `}</CodeBlock>
        
      </div>

      {/* 6. Composition */}
      <div className="method-section">
        <h3>6. Composition</h3>
        <p>
          Definition: Composition is a design principle where a class is composed of one or more objects from other classes to achieve complex functionality.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class Engine {
        start() {
            console.log('Engine started');
        }
    }

    class Car {
        constructor(engine) {
            this.engine = engine;
        }

        start() {
            this.engine.start();
            console.log('Car started');
        }
    }

    let myEngine = new Engine();
    let myCar = new Car(myEngine);
    myCar.start();
    // Output:
    // Engine started
    // Car started

    // Methods of Composition:
    // Car uses Engine through composition to delegate the start functionality
    `}</CodeBlock>
        
      </div>

      {/* 7. Aggregation */}
      <div className="method-section">
        <h3>7. Aggregation</h3>
        <p>
          Definition: Aggregation is a special form of association where the child can exist independently of the parent.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class Department {
        constructor(name) {
            this.name = name;
            this.employees = [];
        }

        addEmployee(employee) {
            this.employees.push(employee);
        }

        describe() {
            console.log(\`Department: \${this.name}\`);
            console.log('Employees:');
            this.employees.forEach(emp => emp.greet());
        }
    }

    let dept = new Department('Engineering');
    dept.addEmployee(person1);
    dept.addEmployee(employee1);
    dept.describe();
    // Output:
    // Department: Engineering
    // Employees:
    // Hello, my name is Alice and I am 30 years old.
    // Hello, my name is Charlie and I am 28 years old.

    // Methods of Department:
    // .addEmployee(employee) - Adds an employee to the department
    // .describe()            - Logs the department details and its employees
    `}</CodeBlock>
        
      </div>

      {/* 8. Association */}
      <div className="method-section">
        <h3>8. Association</h3>
        <p>
          Definition: Association represents the relationship between two separate classes that establish through their objects.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class Teacher {
        constructor(name) {
            this.name = name;
        }

        teach() {
            console.log(\`\${this.name} is teaching.\`);
        }
    }

    class Student {
        constructor(name) {
            this.name = name;
        }

        learn() {
            console.log(\`\${this.name} is learning.\`);
        }
    }

    let teacher = new Teacher('Mr. Smith');
    let student = new Student('John');

    teacher.teach(); // Output: Mr. Smith is teaching.
    student.learn(); // Output: John is learning.

    // Association between Teacher and Student:
    // - Teacher and Student are separate classes with their own behaviors
    // - They interact through their respective methods
    `}</CodeBlock>
        
      </div>

      {/* 9. Method Overriding */}
      <div className="method-section">
        <h3>9. Method Overriding</h3>
        <p>
          Definition: Method overriding is a feature that allows a subclass to provide a specific implementation of a method that is already defined in its superclass.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class Animal {
        makeSound() {
            console.log('Some generic animal sound');
        }
    }

    class Dog extends Animal {
        makeSound() {
            console.log('Woof! Woof!');
        }
    }

    let animal = new Animal();
    let dog = new Dog();

    animal.makeSound(); // Output: Some generic animal sound
    dog.makeSound();    // Output: Woof! Woof!

    // Methods of Animal and Dog:
    // .makeSound() - Overridden in Dog to provide specific sound
    `}</CodeBlock>
        
      </div>

      {/* 10. Method Overloading */}
      <div className="method-section">
        <h3>10. Method Overloading</h3>
        <p>
          Definition: JavaScript does not support method overloading in the traditional sense (multiple methods with the same name but different parameters). However, we can simulate it using default parameters or the arguments object.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class MathOperations {
        add(a, b, c) {
            if (typeof c !== 'undefined') {
                return a + b + c;
            }
            return a + b;
        }
    }

    let math = new MathOperations();
    console.log(math.add(1, 2));       // Output: 3
    console.log(math.add(1, 2, 3));    // Output: 6

    // Simulated Method Overloading:
    // - Checks the number of arguments and behaves accordingly
    `}</CodeBlock>
        
      </div>

      {/* 11. Static Methods and Properties */}
      <div className="method-section">
        <h3>11. Static Methods and Properties</h3>
        <p>
          Definition: Static methods and properties are called on the class itself, not on instances of the class.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class Utility {
        static calculateArea(radius) {
            return Math.PI * radius * radius;
        }

        static description = "This is a utility class for mathematical operations.";
    }

    console.log(Utility.calculateArea(5)); // Output: 78.53981633974483
    console.log(Utility.description);       // Output: This is a utility class for mathematical operations.

    // Static Members of Utility:
    // .calculateArea(radius) - Static method to calculate area of a circle
    // .description          - Static property providing class description
    `}</CodeBlock>
        
      </div>

      {/* 12. Getters and Setters */}
      <div className="method-section">
        <h3>12. Getters and Setters</h3>
        <p>
          Definition: Getters and setters allow you to define methods that are executed when a property is accessed or modified.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class Rectangle {
        constructor(width, height) {
            this.width = width;
            this.height = height;
        }

        get area() {
            return this.width * this.height;
        }

        set area(value) {
            console.log('You cannot set the area directly.');
        }
    }

    let rect = new Rectangle(10, 20);
    console.log(rect.area); // Output: 200
    rect.area = 100;         // Output: You cannot set the area directly.

    // Getters and Setters:
    // .get area() - Calculates and returns the area
    // .set area(value) - Prevents direct modification of the area
    `}</CodeBlock>
        
      </div>

      {/* 13. Operator Overloading */}
      <div className="method-section">
        <h3>13. Operator Overloading</h3>
        <p>
          Definition: JavaScript does not support operator overloading. Operator overloading allows operators to have user-defined meanings on user-defined types. However, we can achieve similar functionality using methods.
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    class ComplexNumber {
        constructor(real, imaginary) {
            this.real = real;
            this.imaginary = imaginary;
        }

        add(other) {
            return new ComplexNumber(this.real + other.real, this.imaginary + other.imaginary);
        }

        toString() {
            return \`\${this.real} + \${this.imaginary}i\`;
        }
    }

    let num1 = new ComplexNumber(1, 2);
    let num2 = new ComplexNumber(3, 4);
    let sum = num1.add(num2);
    console.log(sum.toString()); // Output: 4 + 6i

    // Simulated Operator Overloading:
    // - Uses the add() method to perform addition
    // - toString() method to represent the complex number as a string
    `}</CodeBlock>
        
      </div>
    </div>
  );
}

export default OOPS;
