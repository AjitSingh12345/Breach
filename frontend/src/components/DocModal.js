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
    Select,
    Modal,
    Input,
    Space,
    Button,
    notification
} from 'antd'

const DocModal = ({ setShowDocModal, getData }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(null)
    const [ posted, setPosted ] = useState(false)

    const [ docData, setDocData ] = useState({
        doc_title: null,
        user_email: null,
        school_name: null,
        gpa: null,
        major: null,
        minor: null,
        grad_date: null,
        previous_experiences: [], 
        skills: [],
        clubs_activities: [],
        awards_honors: [],
        ethnicity: null,
        gender: null,
        doc_added_date: new Date()
    }) 

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, descrip) => {
      api[type]({
        message: title,
        description: descrip
        });
    };

    const ReqKeys = ['doc_title', 'user_email', 'school_name', 'gpa', 'major', 'grad_date']
    const ReqKeysArr = ['previous_experiences', 'skills']

    const notif = (success) => {
        if (success) {
            openNotificationWithIcon('success', 'Submitted Successfully!', 'Your document has been submitted')
        } else {
            openNotificationWithIcon('error', 'Submission Failed!', 'Please fill out all of the required fields (marked with asterict) before submitting')
        }
    }

    function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }

    const postData = async(e) => {
        console.log("pd json: ", JSON.stringify(docData))
        /*
        - have arr of required keys
        - if all those r filled -> then make post req
        & close modal & show notification thaat form was submitted
        - else -> dont close modal or send post req & give notif to fill req fields 
        */
        // console.log("posting: ", e, docData, docData['skills']['skills'])
        var reqFieldsFilled = true

        for (const k of ReqKeys) if (docData[k] == null || docData[k] == '') {
            console.log("not filled: ", k)
            reqFieldsFilled = false
        }
        for (const k of ReqKeysArr) if (docData[k] == null || docData[k].length == 0) {
            console.log("not filled: ", k)
            reqFieldsFilled = false
        }


        e.preventDefault()
        if (reqFieldsFilled) {
            try {
                const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/documents`, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(docData)
                })
                if (resp.status === 200) {
                    console.log('Worked')

                    // give success notif
                    notif(true)
                    setPosted(true)
                    await sleep(2000)
                    setShowDocModal(false)
                }
            } catch(err) {
                console.error(err)

                // give failure notif
                notif(false)
            }
        } else {
            // give failure notif
            notif(false)
        }
    }

    const handleCancel = () => {
        setShowDocModal(false)
    }

    const handleChange = (e, name) => {
        // console.log("curr: ", docData)
        // console.log("changing!", e, name)
        // console.log("imp vals:", e.target.value, name)
        const value = e.target.value
        // console.log("imp vals 2: ", name, value)

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
        const value = date ? date.$d : null

        setDocData(docData => ({
            ...docData,
            [name] : value
        }))

        console.log(docData)
    }

    const [form] = Form.useForm();

    return (
        <Modal
            open={true}
            title="Resume Info" 
            onOk={null} 
            onCancel={handleCancel}
            footer={[
                
            ]}
        >

        {contextHolder} 

                {!posted && <Form
                >
                    <Form.Item
                        label='Title'
                        name="Doc Title"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input
                            placeholder="Your document title goes here"
                            onChange={(e) => handleChange(e, 'doc_title')}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Email'
                        name="Email"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        {/* <label>Email</label> */}
                        <Input
                            placeholder="Your email name goes here"
                            onChange={(e) => handleChange(e, 'user_email')}
                        />
                    </Form.Item>

                    <Form.Item
                        label='School'
                        name="School Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        {/* <label>School Name</label> */}
                        <Input
                            placeholder="Your College name goes here"
                            onChange={(e) => handleChange(e, 'school_name')}
                        />
                    </Form.Item>

                    <Form.Item
                        label='GPA'
                        name='GPA'
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        {/* <label>Your gpa goes here</label> */}
                        <GpaSlider name='gpa' data={docData} setData={setDocData} />
                    </Form.Item>

                    <Form.Item
                        label='Major'
                        name='Major'
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        {/* <label>Major</label> */}
                        <Input
                            placeholder="Your major year goes here"
                            onChange={(e) => handleChange(e, 'major')}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Minor'
                        name='Minor'
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                        {/* <label>Minor</label> */}
                        <Input
                            placeholder="Your minor year goes here"
                            onChange={(e) => handleChange(e, 'minor')}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Select Grad Date'
                        name='Grad Date'
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        {/* <label>Select grad date </label> */}
                        <DatePicker     
                            required
                            selected={docData.grad_date}
                            onChange={(e) => handleChangeDate(e, 'grad_date')}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Previous Experience'
                        name='Previous Experience'
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        {/* <label>Previous Experience </label> */}
                        <MFF2 label1={'Company Name'} label2={'previous_experiences'} name='previous_experiences' docData={docData} setDocData={setDocData}/>
                    </Form.Item>

                    <Form.Item
                        label='Skills'
                        name='Skills'
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        {/* <label>Skills </label> */}
                        <MFF1 label1={'Skill'} name='skills' docData={docData} setDocData={setDocData} />
                    </Form.Item>
                    
                    <Form.Item
                        label='Clubs & Activites'
                        name='Clubs & Activites'
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                        {/* <label>Clubs & Activites </label> */}
                        <MFF2 label1={'Club'} label2={'Accomplishments'} name='clubs_activities' docData={docData} setDocData={setDocData} />
                    </Form.Item>
                    
                    <Form.Item
                        label='Awards & Honors'
                        name='Awards & Honors'
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                        {/* <label>Awards & Honors </label> */}
                        <MFF1 label1={'Award'} name='awards_honors' docData={docData} setDocData={setDocData} />   
                    </Form.Item>
                    
                    <Form.Item
                        label='Gender'
                        name='Gender'
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
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
                    
                    <Form.Item
                        label='Ethnicity'
                        name='Ethnicity'
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                        <Select
                            name="ethnicity"
                            onChange={(e) => handleChangeSelect(e, 'ethnicity')}
                            label="Ethnicity"
                        >
                            <Select.Option value="white">White</Select.Option>
                            <Select.Option value="black">Black</Select.Option>
                            <Select.Option value="asian">Asian</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            onClick={postData}
                            htmlType="submit"
                            style={{
                                borderColor: 'grey',
                                backgroundColor: 'blue',
                                marginLeft: '45%',
                                marginTop: '2%'
                            }}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                
                </Form>}
        </Modal>
    )
}


export default DocModal