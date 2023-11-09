import { useState } from "react"
import { useCookies } from 'react-cookie'

// passing in mode & setShowModal
const Modal = ({ mode, setShowModal, getData, task }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(null)
    const editMode = mode === 'edit' ? true : false
    
    const [ data, setData ] = useState({
        user_email: editMode ? task.user_email : cookies.Email,
        title: editMode ? task.title : null,
        progress: editMode ? task.progress : 50,
        date: editMode ? task.date : new Date()
        // company_name: doc.company_name,
        // job_title: doc.job_title,
        // year_applied: doc.year_applied,

        // this is res info
        // previous_experience: 
        // gender:
        // ethnicity:
        // college_name:
        // major:
        // skills:
        // clubs:
        // gpa:
        // classes_taken:
        // date_added:
    })    

    const postData = async (e) => {
        // keeps page from refreshing 
        e.preventDefault()
        try {
            const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            if (resp.status === 200) {
                console.log('Worked')
                setShowModal(false)
                getData()
            }
        } catch(err) {
            console.error(err)
        }
    }

    const editData = async(e) => {
        // so form doesnt refresh
        e.preventDefault()
        try {
            const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
                method: "PUT",
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(data)
            })
            if (resp.status === 200) {
                setShowModal(false)
                getData()
            }
        } catch(err) {
            console.error(err)
        }
    }

    const handleChange = (e) => {
        console.log("changing!", e)
        const { name, value } = e.target

        setData(data => ({
            ...data,
            [name] : value
        }))

        console.log(data)
    }

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Let's {mode} your task</h3>
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>

                <form>
                    <input
                        required
                        maxLength={30}
                        placeholder=" Your task goes here"
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                    />
                    <br/>
                    <label for="range">Drag to select your current progress</label>
                    <input
                        required
                        type="range"
                        id="range"
                        min="0"
                        max="100"
                        name="progress"
                        value={data.progress}
                        onChange={handleChange}
                    />
                    <input className={mode} type="submit" onClick={editMode ? editData : postData} />
                </form>
            </div>
        </div>
    )
}

export default Modal