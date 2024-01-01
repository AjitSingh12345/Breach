import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import { useCookies } from 'react-cookie'
import ResultItem from './components/ResultItem'
import SearchFormModal from './components/Search Page/SearchFormModal.js'
import { Modal } from 'antd'
import DocModal from './components/My Docs Page/DocModal.js'
import {
  Button,
  Flex
} from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MyJobUploadsPage from './components/My Jobs Page/MyJobUploadsPage.js'
import MyDocsPage from './components/My Docs Page/MyDocsPage.js'
import Navbar from './components/Navbar.js'
import HomePage from './components/HomePage.js'

const App = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [ breaches, setBreaches ] = useState(null)
  const [ myDocs, setMyDocs ] = useState(null)
  const ReqKeys = ['company_name', 'position', 'year_applied', 'college_attended', 'min_gpa', 'max_gpa', 'gender', 'ethnicity']
  const ReqKeysArr = ['previous_employers', 'expereince_keywords', 'skills', 'clubs_activites']

  // pass these into search form modal to get data back from search form 
  // pass getData into search form so u can call it w a certain query after submit button is hit (or clear)
  const getData = async (query) => {
    console.log('get data: ', query)
    console.log(JSON.stringify(query))
    
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
        console.log(`2 ${key}: ${value}`);
        if (value != null && value != '' && !(key == 'company_name' || key == 'position' || key == 'year_applied') && !(ReqKeysArr.includes(key) && value.length == 0)) {
          if (begin) {
            doc_query += 'WHERE'
            begin = false
          } else {
            doc_query += 'AND'
          }

          if (ReqKeysArr.includes(key)) {
            var options = getArrFromObj(key, value)
            console.log(`3 ${key}: ${JSON.stringify(value)}`);
            doc_query += options
          } else if (key == 'min_gpa') {
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
      const tmpq = "WHERE company_name = 'a' AND position = 'b' AND year_applied = 2029 :WHERE (previous_employers like '%loopz%' or previous_employers like '%poopz%') AND (expereince_keywords like '%hi%') AND college_attended = 'a' AND major = 'b' AND gpa >= 0.92 AND gpa <= 3.31 AND (skills like '%java%') AND (clubs_activites like '%bye%')"
      const tmpq2 = "WHERE company_name = 'a' AND position = 'b' AND year_applied = 2029 :WHERE (previous_employers like '|loopz|')"
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


  const getMyDocs = async (query) => {
    console.log("get my docs ... ")
      try {
        const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/documents/${userEmail}`)
        const json = await resp.json()
        setMyDocs(json)
      } catch (err) {
        console.error(err)
      }
  }

  function getArrFromObj(key, obj) {
    /*
    ex.) skills = [java, cpp]
    WHERE skills like '%java% or skills like '%cpp%;
    */
    var ret = ' '
    if (obj.length > 0) {
      ret += '('

      // console.log("hehe: ", key, obj[0].first, obj.length, Object.keys(obj))
      for (let i = 0; i < obj.length; i++) {
        if (i > 0) ret += ' or '
        ret += key + ' like \'|' + obj[i].first + '|\''
      }

      ret += ') '
    }

    console.log("gafo: ", ret)
    return ret
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

  const SearchPage = (
    <div className='wrapper'>
      <div className='home-box search'>
        <Button 
            onClick={stuff}
            type="primary" 
            size="large"
            icon={<SearchOutlined />}
            style={{
                // color: 'black',
                marginLeft: '37%',
                height: 'auto',
                borderColor: 'grey',
                backgroundColor: '#4add00',
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
    </div>
  )

  return (
    <>
      {authToken && 
      <>
        <Navbar/>
          <Routes>
            <Route path="/" element={SearchPage} />

            <Route path="/search" element={SearchPage} />

            <Route path="/myUploads" element={<MyJobUploadsPage listName="L1" userEmail={userEmail} getData={getData} myDocs={myDocs} />} />

            <Route path="/myDocs" element={<MyDocsPage listName="L2" userEmail={userEmail} getData={getData}/>} />
          </Routes>
      </>
      }

      {!authToken &&     
      <div className='auth-body'>
        <div className='div-app'> 
          <Auth/>
        </div>
      </div>
      }

    </>
  )
}

export default App