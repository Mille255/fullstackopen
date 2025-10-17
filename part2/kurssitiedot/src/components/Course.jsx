const Course = ({courses}) => {
  console.log("courses", courses)

   // Calculate the total number of exercises
   const totalExercises = courses.reduce(
    (sum, course) => sum + course.parts.reduce((partSum, part) => partSum + part.exercises, 0),
    0
  )
  
  const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
      <p><strong>Total of {totalExercises} exercises</strong></p>
    );
  };

  return (
    <div>
      <h1>Web development curriculum</h1>
       {courses.map(course => 
          <div key={course.id}>
          <Header name={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
          </div>
          )}
   <h3>Total Exercises: {totalExercises}</h3>  
    </div>
  )
}
const Header = ({name}) => {
  console.log('Header toimii')
   return (
    <div>
      <h2>{name}</h2>
    </div>
  )
}

const Content = ({parts}) => {
  console.log("parts", parts)
  return (
    <div>
       {parts.map(part => 
          <Part key={part.id} part={part} />
          )}
    </div>
  )
}

const Part = ({part}) => {
  return (
    
    <div>
      <p>{part.name} {part.exercises}</p>
    </div>
  )
}

  export default Course