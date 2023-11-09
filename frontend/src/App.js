import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import { useCookies } from 'react-cookie'
import Navbar from './components/Navbar.js'
import Example from './components/Example'
import SearchFormModal from './components/SearchFormModal'
import { Modal } from 'antd'
import ExampleMod from './onlineModal'
import DocModal from './components/DocModal'
import {
  Button,
  Flex
} from 'antd'
import { SearchOutlined } from '@ant-design/icons';


const App = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [ tasks, setTasks ] = useState(null)

  // pass these into search form modal to get data back from search form 
  // pass getData into search form so u can call it w a certain query after submit button is hit (or clear)

  const getData = async (query) => {
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

  const [ searchDone, setSearchDone ] = useState(false)
  /*
   add a search button here ->
   - when clicked 
   */

   const stuff = () => {
    console.log('done clicky')
    setSearchDone(!searchDone)
   }

  return (
    /*
    Im gonna make 2 boxes (1 on left & 1 on right )
    */
    <div className="app">

      <Navbar/>
        <div  className='home-box search'>
          <Button 
              onClick={stuff}
              type="dashed" 
              size="large"
              icon={<SearchOutlined />}
              style={{
                  marginLeft: '37%',
                  height: 'auto',
                  borderColor: 'grey',
                  backgroundColor: '#fff1f0',
                  marginBottom: '10%'
                }}
              >
              <br/>
              Show Query
          </Button>          
          {searchDone ? <SearchFormModal/> : <></>}
        </div>
        <div  className='home-box results'>
          {sortedTasks?.map((task) => 
          <ListItem key={task.id} task={task} getData={getData} 
          />)}
        </div>
    </div>
  )
}

export default App