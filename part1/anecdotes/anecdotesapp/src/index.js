import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = (props) => (
    <button onClick={props.handleClick}>
        {props.text}
    </button>
);
const App = (props) => {
    const [selected, setSelected] = useState(0);
    const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
    const renderMostVotes = () => {
        let maxVotes = 0, maxIdx = 0;
        for (var i = 0; i < votes.length; i++)
            if (votes[i] > maxVotes) {
                maxVotes = votes[i];
                maxIdx = i;
            }
        if (maxVotes === 0) {
            return (
                <div>
                    No votes cast yet
                </div>
            );
        }

        else {
            return (
                <div>
                    {anecdotes[maxIdx]}
                    <div>has {maxVotes} votes</div>
                </div>

            );
        }
    };
    const randomNum = () => {
        setSelected(Math.floor(Math.random() * 6));
    }
    const vote = () => {
        const newVotes = [...votes]
        newVotes[selected]++;
        setVotes(newVotes);
    }
    return (
        <div>
            <h1>Anecdote of the day</h1>
            {props.anecdotes[selected]} {votes[selected]}
            <div>
                <Button handleClick={vote} text="vote" />
                <Button handleClick={randomNum} text="New Anecdote" />
            </div>
            <h1>Anecdote with the most votes</h1>
            {renderMostVotes()}
        </div>
    );
};

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)
