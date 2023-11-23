import Modal from './Modal'
import JobModal from './JobModal'
import DocModal from './DocModal'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import {
    Button,
    notification
} from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import ResultItem from './ResultItem'
import MoreInfoModal from './MoreInfoModal'

// need to destructure prop passed in
const MyDocsPage = ({ listName, userEmail, getData }) => {
    const [ showDocModal, setShowDocModal ] = useState(false)
    const [ showInfoModal, setShowInfoModal ] = useState(false)
    const [ info, setInfo ] = useState(null)
    const [ myDocs, setMyDocs ] = useState(null)

    const getMyDocs = async (query) => {
        try {
          const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/documents/${userEmail}`)
          const json = await resp.json()
          setMyDocs(json)
        } catch (err) {
          console.error(err)
        }
    }

    const handleViewMore = async (doc_id) => {
        // get doc info
        console.log("view more of doc: ", doc_id)
    
        if (doc_id != null) {
          // fetch req 
          try {
            const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/documents/byId/${doc_id}`)
            const json = await resp.json()
            setInfo(json)
            console.log('aa: ', info, " json: ", json)
          } catch (err) {
            console.error(err)
            console.log('bb: ', err)
          }
        } else {
          setInfo(null) // ???
        }
    
        setShowInfoModal(true)
    }

    // if we dont put empty dep list, this will run inf 
    useEffect(() => {
        // getData("my docs page")
        getMyDocs()
    }, [])    

    return (
        <div>
            <Button 
                onClick={() => setShowDocModal(true)}
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
            
            <h1>My uploaded documents <br/> </h1>
            
            {myDocs?.map((doc) => 
            <p>{doc.doc_title} <a onClick={() => handleViewMore(doc.doc_id)} href="#" className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-indigo-600 hover:text-indigo-900">
                View More
            </a> <br/> </p>
            )}

            {/* pass thru set Show Modal so other files can use it to close out of the form when x is clicked */}
            {showDocModal && <DocModal setShowDocModal={setShowDocModal} getData={getData} />}

            {showInfoModal && <MoreInfoModal input={info} showModal={showInfoModal} setShowModal={setShowInfoModal} />}

        </div>
    )
}

export default MyDocsPage
  