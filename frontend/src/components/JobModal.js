// This is to add new Job u passed res screen for

import { useState } from "react"
import { useCookies } from 'react-cookie'
import {
    Button,
    Select,
    DatePicker
} from 'antd';

const JobModal = ({ setShowJobModal, getData }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(null)

    const [ jobData, setJobData ] = useState({
        company_name: null,
        position: null,
        year_applied: 2000,
        doc_id: null,
        job_added_date: new Date()
    }) 

    const postData = async(e) => {
        e.preventDefault()
        try {
            const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/myJobs`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(jobData)
            })
            if (resp.status === 200) {
                console.log('Worked')
                setShowJobModal(false)
                getData()
            }
        } catch(err) {
            console.error(err)
        }
    }

    const handleChange = (e) => {
        console.log("changing!", e)
        console.log("imp vals:", e.target)
        const { name, value } = e.target
        console.log("imp vals 2: ", name, value)

        setJobData(jobData => ({
            ...jobData,
            [name] : value
        }))

        console.log(jobData)
    }

    const handleChangeDate = (date) => {
        console.log("changing d! ", date ? date.$y : null)
        const name = 'year_applied'
        const value = date ? date.$y : null

        setJobData(jobData => ({
            ...jobData,
            [name] : value
        }))

        console.log(jobData)
    }

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Let's add your passed job screen</h3>
                    <button onClick={() => setShowJobModal(false)}>X</button>
                </div>

                <form>
                    <input
                        required
                        maxLength={30}
                        placeholder=" Your Company goes here"
                        name="company_name"
                        value={jobData.company_name}
                        onChange={handleChange}
                    />
                    <input
                        required
                        maxLength={30}
                        placeholder=" Your Position goes here"
                        name="position"
                        value={jobData.position}
                        onChange={handleChange}
                    />
                    {/* <input
                        required
                        maxLength={4}
                        placeholder=" Your Application year goes here"
                        name="year_applied"
                        value={jobData.year_applied}
                        onChange={handleChange}
                    /> */}
                    <DatePicker     
                        required
                        // defaultChecked 
                        // name="year_applied"
                        selected={jobData.year_applied}
                        onChange={handleChangeDate}
                        picker="year" 
                    />
                    <label>Select Resume used</label>
                    {/* <Select
                        required
                        name="year_applied"
                        value={jobData.year_applied}
                        onChange={handleChange}
                    />
                        <Select.Option name="year_applied" value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    <Select/> */}
                    <select 
                        required
                        maxLength={4}
                        placeholder=" Your Application year goes here"
                        name="doc_used_name" 
                        value={jobData.year_applied}
                        onChange={handleChange}>
                            <option value="male"> Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                    </select>
                    <input className='create' type='submit' onClick={postData} />
                </form>
            </div>
        </div>
    )
}


export default JobModal