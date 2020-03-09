import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = ({ handleClick, text }) => {
    return (
        <>
            <button onClick={handleClick}>{text}</button>
        </>
    );
};

const Statistics = ({ good, neutral, bad, all }) => {
    return (
        <div>
            <table>
                <tbody>
                    <Statistic number={good} text='good' />
                    <Statistic number={neutral} text='neutral' />
                    <Statistic number={bad} text='bad' />
                    <Statistic number={good + neutral + bad} text='all' />
                    <Summary good={good} bad={bad} neutral={neutral} all={all} />
                </tbody>
            </table>
        </div>
    );
};
const Statistic = ({ number, text }) => {
    return (
        <>
            <tr>
                <td>{text}</td>
                <td>{number}</td>
            </tr>
        </>
    );
};
const Summary = ({ good, neutral, bad, all }) => {
    const calculateAverage = () => {
        return isNaN((good - bad) / all) ? 0 : (good - bad) / all;
    }
    const calculatePositive = () => {
        return isNaN(good / all) ? 0 : ((good/all)*100);
    }
    return (
        <>
            <tr>
                <td>average</td>
                <td>{calculateAverage()}</td>
            </tr>
            <tr>
                <td>positive</td>
                <td>{calculatePositive()} % </td>
            </tr>  
        </>
    );
};
const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
    const [all, setAll] = useState(0);
    const handleGood = () => {
        setGood(good + 1);
        setAll(all + 1);
    }
    const handleNeutral = () => {
        setNeutral(neutral + 1);
        setAll(all + 1);
    }
    const handleBad = () => {
        setBad(bad + 1);
        setAll(all + 1);
    }
    const renderStats = () => {
        if (all === 0) {
            return <div>No feedback given</div>
        }
        return (
            <div>
                <Statistics good={good} neutral={neutral} bad={bad} all={all} />
            </div>
        );
    };


    return (
        <div>
            <h2>give feedback</h2>
            <Button handleClick={handleGood} text='good' />
            <Button handleClick={handleNeutral} text='neutral' />
            <Button handleClick={handleBad} text='bad' />
            <h2>statistics</h2>
            {renderStats()}
        </div>
    )
};

ReactDOM.render(<App />,
    document.getElementById('root')
);