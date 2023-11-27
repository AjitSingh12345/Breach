import Modal from './Modal'
import JobModal from './JobModal'
import DocModal from './DocModal'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import {
    Button
} from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import ResultItem from './ResultItem'


// need to destructure prop passed in
const MyJobUploadsPage = ({ listName, userEmail, getData, myDocs }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(null)
    const [ showJobModal, setShowJobModal ] = useState(false)
    const [ uploads, setUploads ] = useState(null)
    const [ docTitles, setDocTitles ] = useState({})

    // this.state = { uploads: null }

    // const authToken = cookies.AuthToken
    // const userEmail = cookies.Email

    const getMyBreaches = async (query) => {
        console.log("get breaches: ", userEmail)
        try {
          const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/myBreaches/${userEmail}`)
          const json = await resp.json()
          setUploads(json)
          console.log("ret: ", json, uploads)
          getDocTitles() 
        } catch (err) {
          console.error(err)
        }

        // now that i have the uploads -> make map of their doc titles
        // getDocTitles() 
    }

    const getDocTitles = async () => {
        console.log("gdt: ", uploads)

        for (let i = 0; i < uploads?.length; i++) {
            const entry = uploads[i]
            // console.log("ee: ", entry)

            // fetch req 
            try {
                const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/documents/TitleFromId/${entry.doc_id}`)
                const json = await resp.json()
                var docTitle = json[0].doc_title
                // console.log('gdt: ', docTitle, " json: ", json[0].doc_title)

                // docTitles[entry.doc_id] = docTitle
                setDocTitles(docTitles => ({
                    ...docTitles,
                    [entry.doc_id] : docTitle
                }))        
            } catch (err) {
                console.error(err)
                console.log('bb: ', err)
                
                // docTitles[entry.doc_id] = "Failed to retrieve"
                setDocTitles(docTitles => ({
                    ...docTitles,
                    [entry.doc_id] : "Failed to retrieve"
                }))
            }

        }

        console.log(docTitles, docTitles && uploads ? docTitles[uploads[0].doc_id] : "nulll")
    }

    // get my breaches when page loads
    useEffect(() => {
        getMyBreaches()
    }, [])
    
    // get doc titles once breaches (uploades) are updated
    useEffect(() => {
        getDocTitles()
    }, [uploads])

    return (
        <div>
            <Button 
            onClick={() => setShowJobModal(true)}
            type="dashed" 
            size="large"
            icon={<PlusOutlined />}
            style={{
                height: 'auto',
                borderColor: 'grey',
                backgroundColor: '#fff1f0',
                left: '45%',
                marginTop: '1%'                
            }}
            >
            <br/>
            ADD NEW
            </Button>

            <h1>These are the breaches you uploaded! <br/> </h1>
            {/* pass thru set Show Modal so other files can use it to close out of the form when x is clicked */}
            {showJobModal && <JobModal setShowJobModal={setShowJobModal} getData={getData} myDocs={myDocs} />}
            
            {/* pass in keys of uploads as headings, & uploads as entires */}
            <ResultItem headings={['Company', 'Position', 'Year Applied', 'doc used']} viewMorePossible={false} entries={uploads} docTitles={docTitles} getDocTitles={getDocTitles} />
        </div>
    )
}

export default MyJobUploadsPage
  