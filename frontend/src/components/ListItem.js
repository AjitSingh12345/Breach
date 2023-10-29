import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar'
import { useState } from 'react'
import Modal from './Modal'

// require('dotenv').config()

const ListItem = ({ task, getData }) => {
    const [ showModal, setShowModal ] = useState(false)
    
    const deleteItem = async () => {
        try {
            console.log(process.env.REACT_APP_SERVERURL)
            const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
                method: "DELETE"
            })
            if (resp.status === 200) {
                getData()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <li className="list-item">         
            <div className="info-container">
                <TickIcon/>
                <p className="task-title">{task.title}</p>
                <ProgressBar/>
            </div>

            <div className='button-container'>
                <button className='edit' onClick={() => setShowModal(true)}>EDIT</button>
                <button className='delete' onClick={deleteItem}>DELETE</button>
            </div>
            {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task} />}
        </li>
    )
}

export default ListItem