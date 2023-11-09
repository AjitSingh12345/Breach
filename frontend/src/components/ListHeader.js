import Modal from './Modal'
import JobModal from './JobModal'
import DocModal from './DocModal'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

// need to destructure prop passed in
const ListHeader = ({ listName, getData }) => {
    const [ showJobModal, setShowJobModal ] = useState(false)
    const [ showDocModal, setShowDocModal ] = useState(false)
    const [ cookies, setCookie, removeCookie ] = useCookies(null)

    const signOut = () => {
        console.log('sign out')
        // need to remove cookies
        removeCookie('Email')
        removeCookie('AuthToken')
        window.location.reload()
    }

    return (
        <div className="list-header">
            <h1>{listName}</h1>
            <div className="button-container">
                <button className="create" onClick={() => setShowDocModal(true)}>ADD NEW</button>
                <button className="signout" onClick={signOut}>SIGN OUT</button>
            </div>
            {/* pass thru set Show Modal so other files can use it to close out of the form when x is clicked */}
            {/* if showModal = true then show this modal component */}
            {showJobModal && <JobModal setShowJobModal={setShowJobModal} getData={getData} />}
            {showDocModal && <DocModal setShowDocModal={setShowDocModal} getData={getData} />}
        </div>
        // {showDocModal && <DocModal className='doc-modal' setShowDocModal={setShowDocModal} getData={getData} />}
    )
}

export default ListHeader
  