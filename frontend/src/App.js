import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import { useCookies } from 'react-cookie'

const App = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [ tasks, setTasks ] = useState(null)

  const getData = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`)
      const json = await resp.json()
      setTasks(json)
    } catch (err) {
      console.error(err)
    }
  }

  // if we dont put empty dep list, this will run inf 
  useEffect(() => {
    if (authToken) {
      getData()
    }}, [])

  console.log(tasks)

  // sort tasks by date
  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
      <div className="app">
        {/* pass prop into list header; map each sorted task to a list item element */}
        {/* if no auth token -> show authmodal, otherwise show header & tasks and stuff */}
        {!authToken && <Auth/>}
        {authToken && 
          <>
          <ListHeader listName={'*Holiday tick list'} getData={getData} />
          <p className='user-email'>Welcome back {userEmail}</p>
          {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
        </>}
        <p className='copyright'>Ajit Stuff LLC</p>
      </div>
  )
}

export default App