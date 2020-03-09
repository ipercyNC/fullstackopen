import React from 'react';
import Course from './Course';

const Courses = ({ courses }) => {
    return (
        <div>
            {courses.map(course =>
                <Course
                    key={course.id}
                    name={course.name}
                    parts={course.parts}
                />
            )}
        </div>
    );

};
export default Courses;