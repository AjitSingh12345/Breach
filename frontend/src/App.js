import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import { useEffect, useState } from 'react'

// require('dotenv').config()

const App = () => {
  // process.env.REACT_APP_SERVERURL ?? console.log("set:", process.env.REACT_APP_SERVERURL)

  const userEmail = 'lol@test.com'
  const [ tasks, setTasks ] = useState(null)

  const getData = async () => {
    try {
      // console.log(process.env.PORT, process.env.REACT_APP_SERVERURL)
      const resp = await fetch(`http://localhost:8000/todos/${userEmail}`)
      const json = await resp.json()
      setTasks(json)
    } catch (err) {
      console.error(err)
    }
  }

  // if we dont put empty dep list, this will run inf 
  useEffect(() => getData, [])

  console.log(tasks)

  // sort tasks by date
  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
      <div className="app">
        {/* pass prop into list header; map each sorted task to a list item element */}
        <ListHeader listName={'*Holiday tick list'} getData={getData} />
        {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
      </div>
  )
}

export default App