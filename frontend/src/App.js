import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import { useCookies } from 'react-cookie'
import Navbar from './components/Navbar.js'
import ResultItem from './components/ResultItem'
import SearchFormModal from './components/SearchFormModal'
import { Modal } from 'antd'
import ExampleMod from './onlineModal'
import DocModal from './components/DocModal'
import {
  Button,
  Flex
} from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MyJobUploadsPage from './components/MyJobUploadsPage'
import MyDocsPage from './components/MyDocsPage'

const App = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies(null)
  // const authToken = cookies.AuthToken
  // const userEmail = cookies.Email
  const [ breaches, setBreaches ] = useState(null)
  const [ myDocs, setMyDocs ] = useState(null)

  const tmpBreaches = [
    {
      company_name: 'Citadel',
      position: 'SWE Intern',
      year_applied: '2010',
      role: 'Admin',
      email: 'jane.cooper@example.com',
    },
    {
      company_name: 'Google',
      position: 'SWE III',
      year_applied: '2000',
      role: 'Admin',
      email: 'jane.cooper@example.com',
      
          }
    // More entries...
  ]

  // pass these into search form modal to get data back from search form 
  // pass getData into search form so u can call it w a certain query after submit button is hit (or clear)

  const getData = async (query) => {
    console.log('get data: ', query)
    
    /* 
    - turn query into str for endpt (get cant have body like post)
    - make where query here and pass it in -- need to have a diff parser for each type of input 
    - need to pass 2 parts of the query -- 1 for breaches & 1 for docs -> "[part 1]:[part 2]"
    - breach query: company name, position, year applied
    */
    var breach_query = ""
    var begin = true
    if (query != null) {
      for (const [key, value] of Object.entries(query)) {
        console.log(`${key}: ${value}`);
        // need to account for null and empty fields (become empty instead of null once u type then delete)
        if (value != null && value != '' && (key == 'company_name' || key == 'position' || key == 'year_applied')) {
          if (begin) {
            begin = false
            breach_query += 'WHERE'
          } else {
            breach_query += 'AND'
          }
          if (key == 'year_applied') {
            breach_query += ` ${key} = ${value} `
          } else {
            breach_query += ` ${key} = '${value}' `
          }
        } 
      }
    }
   
    var doc_query = ""
    begin = true
    if (query != null) {
      for (const [key, value] of Object.entries(query)) {
        console.log(`${key}: ${value}`);
        if (value != null && !(key == 'company_name' || key == 'position' || key == 'year_applied')) {
          if (begin) {
            doc_query += 'WHERE'
            begin = false
          } else {
            doc_query += 'AND'
          }

          if (key == 'min_gpa') {
            doc_query += ` gpa >= ${value} `
          } else if (key == 'max_gpa') {
            doc_query += ` gpa <= ${value} `
          } else {
            doc_query += ` ${key} = '${value}' `
          }
        } 
      }
    }

    var where_query = `${breach_query}:${doc_query}` 

    console.log("final q: ", where_query)
    try {
      const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/breaches/${where_query}`)
      const json = await resp.json()
      setBreaches(json)
      console.log('a: ', json)
    } catch (err) {
      console.error(err)
      console.log('b: ', err)
    }
    console.log('c')
  }

  const userEmail = 'asing0525@gmail.com'

  const getMyDocs = async (query) => {
      try {
        const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/documents/${userEmail}`)
        const json = await resp.json()
        setMyDocs(json)
      } catch (err) {
        console.error(err)
      }
  }

  // if we dont put empty dep list, this will run inf 
  useEffect(() => {
    // getData();
    getMyDocs();
  }, [])

  console.log("breaches: ", breaches)

  const [ searchDone, setSearchDone ] = useState(false)
  /*
   add a search button here ->
   - when clicked 
   */

   const stuff = () => {
    console.log('done clicky')
    setSearchDone(!searchDone)
   }

  const HomePage = (
    <p>This is the home page</p>
  )

  const SearchPage = (
    <>
      <div className='home-box search'>
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
        {searchDone ? <SearchFormModal getData={getData} /> : <></>}
      </div>

      <div className='home-box results'>
        <ResultItem viewMorePossible={true} headings={['Company', 'Position', 'Year Applied']} entries={breaches} /> 
      </div>
    </>
  )

  return (
    /*
    Im gonna make 2 boxes (1 on left & 1 on right )
    */
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={HomePage} />

        <Route path="/search" element={SearchPage} />

        <Route path="/myUploads" element={<MyJobUploadsPage listName="L1" userEmail={userEmail} getData={getData} myDocs={myDocs} />} />

        <Route path="/myDocs" element={<MyDocsPage listName="L2" userEmail={userEmail} getData={getData}/>} />
      </Routes>
    </div>
  )
}

export default App