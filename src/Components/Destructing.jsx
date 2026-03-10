import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Destructing() {
    useEffect(() => {
    
        window.scrollTo(0,0);
    }, []);

    return (
        <div className="debounce-container">
            <h1 className="title">Array and Object Destructuring</h1>

            <section className="method-section">
                <h2 className="method-title">Array Destructuring</h2>
                <p>Array destructuring allows you to unpack values from arrays or iterable objects into distinct variables.</p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Example 1: Basic Array Destructuring
const actresses = ['Sreeleela', 'Rashmika Mandana', 'Rashi Khanna', 'Nivetha Thomas', 'Hansika Motwani'];
const [firstActress, secondActress, thirdActress, fourthActress, fifthActress] = actresses;
console.log(firstActress, secondActress, thirdActress, fourthActress, fifthActress);
// Output: Sreeleela Rashmika Mandana Rashi Khanna Nivetha Thomas Hansika Motwani`}
                    </CodeBlock>
                

                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Example 2: Ignoring Certain Actresses
const [bestActress, , , , stunningActress] = actresses;
console.log(bestActress, stunningActress);
// Output: Sreeleela Hansika Motwani`}
                    </CodeBlock>
                

                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Example 3: Default Values
const [popularActress, versatileActress, charmingActress, beautifulActress, newActress = 'Another Actress'] = actresses;
console.log(newActress);
// Output: Hansika Motwani`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Object Destructuring</h2>
                <p>Object destructuring allows you to extract properties from objects and bind them to variables.</p>

                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Example 1: Basic Object Destructuring
const actressInfo = {
    name: 'Rashmika Mandana',
    age: 25,
    movies: ['Geetha Govindam', 'Dear Comrade', 'Bheeshma'],
    awards: {
        filmfare: 3,
        siima: 2
    }
};
const { name: actressName, age: actressAge, movies: actressMovies, awards: actressAwards } = actressInfo;
console.log(actressName, actressAge, actressMovies, actressAwards);
// Output: Rashmika Mandana 25 [ 'Geetha Govindam', 'Dear Comrade', 'Bheeshma' ] { filmfare: 3, siima: 2 }`}
                    </CodeBlock>
                

                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Example 4: Nested Object Destructuring
const actressProfile = {
    personalDetails: {
        height: '5 feet 6 inches',
        weight: '55 kg'
    },
    socialMedia: {
        instagram: '@rashmika_mandanna',
        twitter: '@iamRashmika'
    }
};

const { personalDetails: { height, weight }, socialMedia: { instagram, twitter } } = actressProfile;
console.log(height, weight, instagram, twitter);
// Output: 5 feet 6 inches 55 kg @rashmika_mandanna @iamRashmika`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Destructuring Function Parameters</h2>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Example 5: Destructuring Function Parameters
function displayActress({ name, age, movies }) {
    console.log(\`Name: \${name}, Age: \${age}, Movies: \${movies.join(', ')}\`);
}
displayActress(actressInfo);
// Output: Name: Rashmika Mandana, Age: 25, Movies: Geetha Govindam, Dear Comrade, Bheeshma`}
                    </CodeBlock>
                
            </section>
        </div>
    );
}

export default Destructing;
