// upload form to upload a new doc to ur account
/*
previous experience: [{company name: work done}]
*/

import MFF1 from "./1MultiFieldForm"
import MFF2 from "./2MultiFieldForm"
import GpaSlider from "./GpaSlider"
import { useState } from "react"
import { useCookies } from 'react-cookie'

import {
    DatePicker,
    Form,
    Select
} from 'antd'

const DocModal = ({ setShowDocModal, getData }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(null)

    const [ docData, setDocData ] = useState({
        // unqiue id?
        unique_id: null,
        school_name: null,
        gpa: null,
        major: null,
        minor: null,
        grad_date: new Date(),
        previous_experiences: [], 
        skills: [],
        clubs_activities: [],
        awards_honors: [],
        ethnicity: null,
        gender: null,
        doc_added_date: new Date()
    }) 

    const postData = async(e) => {
        e.preventDefault()
        try {
            const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/myJobs`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(docData)
            })
            if (resp.status === 200) {
                console.log('Worked')
                setShowDocModal(false)
                getData()
            }
        } catch(err) {
            console.error(err)
        }
    }

    const handleChange = (e) => {
        console.log("curr: ", docData)
        console.log("changing!", e)
        console.log("imp vals:", e.target)
        const { name, value } = e.target
        console.log("imp vals 2: ", name, value)

        setDocData(docData => ({
            ...docData,
            [name] : value
        }))

        console.log(docData)
    }

    const handleChangeSelect = (value, name) => {
        console.log("changing select! ", value, ": ", name)

        setDocData(docData => ({
            ...docData,
            [name] : value
        }))
    }

    const handleChangeDate = (date) => {
        console.log("changing d! ", date)
        const name = 'grad_date'
        const value = date ? date.$y : null

        setDocData(docData => ({
            ...docData,
            [name] : value
        }))

        console.log(docData)
    }

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Let's add your new resume</h3>
                    <button onClick={() => setShowDocModal(false)}>X</button>
                </div>

                <form>
                    <input
                        required
                        maxLength={30}
                        placeholder=" Your College name goes here"
                        name="school_name"
                        value={docData.school_name}
                        onChange={handleChange}
                    />
                    <label>Your gpa goes here</label>
                    <GpaSlider name='gpa' data={docData} setData={setDocData} />
                    <input
                        required
                        maxLength={4}
                        placeholder=" Your major year goes here"
                        name="major"
                        value={docData.major}
                        onChange={handleChange}
                    />
                    <input
                        required
                        maxLength={4}
                        placeholder=" Your minor year goes here"
                        name="minor"
                        value={docData.minor}
                        onChange={handleChange}
                    />
                    <label>Select grad date </label>
                    <DatePicker     
                        required
                        selected={docData.grad_date}
                        onChange={handleChangeDate}
                    />
                    <br/>
                    <label>Previous Experience </label>
                    <MFF2 label1={'Company Name'} label2={'previous_experiences'} name='clubs_activities' docData={docData} setDocData={setDocData}/>
                    <label>Skills </label>
                    <MFF1 label1={'Skill'} name='skills' docData={docData} setDocData={setDocData} />
                    <label>Clubs & Activites </label>
                    <MFF2 label1={'Club'} label2={'Accomplishments'} name='clubs_activities' docData={docData} setDocData={setDocData} />
                    <label>Awards & Honors </label>
                    <MFF1 label1={'Award'} name='awards_honors' docData={docData} setDocData={setDocData} />   
                    <br/>            
                    <Form.Item label="Gender">
                        <Select 
                            name="gender"
                            onChange={(e) => handleChangeSelect(e, 'gender')}
                            label="Gender"
                        >
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                            <Select.Option value="prefer not to disclose">prefer not to disclose</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ethnicity">
                        <Select
                            name="ethnicity"
                            onChange={(e) => handleChangeSelect(e, 'ethnicity')}
                            label="Ethnicity"
                        >
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <input className='create' type='submit' onClick={postData} />
                </form>
            </div>
        </div>
    )
}


export default DocModal