import React from 'react';
import Part from './Part';

const Content = ({ parts }) => {

    const renderTotal = () => {
        let total = parts.reduce((a, b) => ({ exercises: a.exercises + b.exercises }));
        if (total !== undefined) {
            return (<p><strong>total of {total.exercises} exercises</strong></p>);
        };
    }
    return (
        <div>
            {parts.map(part =>
                <Part
                    key={part.id}
                    name={part.name}
                    exercises={part.exercises}
                />
            )}
            {renderTotal()}
        </div>
    );
};
export default Content;