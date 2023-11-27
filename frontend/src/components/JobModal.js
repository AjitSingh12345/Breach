// This is to add new Job u passed res screen for

import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie'
import {
    Button,
    Select,
    DatePicker,
    Modal,
    Form,
    Input,
    notification
} from 'antd';

const JobModal = ({ setShowJobModal, getData, myDocs, userEmail, getMyBreaches }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(null)
    const [ posted, setPosted ] = useState(false)

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, descrip) => {
      api[type]({
        message: title,
        description: descrip
        });
    };

    const ReqKeys = ['company_name', 'position', 'year_applied', 'doc_id']

    const [ jobData, setJobData ] = useState({
        company_name: null,
        user_email: userEmail,
        position: null,
        year_applied: null,
        doc_id: null,
        job_added_date: new Date()
    }) 

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
         /*
        - have arr of required keys
        - if all those r filled -> then make post req
        & close modal & show notification thaat form was submitted
        - else -> dont close modal or send post req & give notif to fill req fields 
        */
        console.log("posting: ", e, jobData)
        var reqFieldsFilled = true

        for (const k of ReqKeys) if (jobData[k] == null || jobData[k] == '') {
            console.log("not filled: ", k)
            reqFieldsFilled = false
        }

        console.log('posted a new breach ...')
        e.preventDefault()
        if (reqFieldsFilled) {
            try {
                const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/breaches`, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(jobData)
                })
                console.log("resp: ", resp)
                if (resp.status === 200) {
                    console.log('Worked')
    
                    // give success notif
                    notif(true)
                    setPosted(true)
                    await sleep(2000)
                    setShowJobModal(false)
                } else {
                    notif(false)
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

    useEffect(() => {
        getMyBreaches()
    }, [posted])

    const handleChange = (e, name) => {
        console.log("changing!", e)
        console.log("imp vals:", e.target.value)
        const value = e.target.value
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

    const handleChangeSelect = (value, name) => {
        console.log("changing select! ", value, ": ", name)

        setJobData(jobData => ({
            ...jobData,
            [name] : value
        }))
    }


    const handleCancel = () => {
        setShowJobModal(false)
    }

    // make antd form??
    return (
        <Modal
            open={true}
            title="Breach Info" 
            onOk={null} 
            onCancel={handleCancel}
            footer={[
                
            ]}
        >

        {contextHolder}

        {!posted && <Form
            >
                <Form.Item
                    label='Company Name'
                    name="Company Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="Your company name goes here"
                        onChange={(e) => handleChange(e, 'company_name')}
                    />
                </Form.Item>

                <Form.Item
                    label='Position'
                    name="Position"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="Your position goes here"
                        onChange={(e) => handleChange(e, 'position')}
                    />
                </Form.Item>

                <Form.Item
                    label='Select Application Year'
                    name='Application Year'
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <DatePicker     
                        required
                        selected={jobData.year_applied}
                        onChange={handleChangeDate}
                        picker="year"
                    />
                </Form.Item>

                <Form.Item
                    label='Select Resume Used'
                    name='Resume'
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select 
                        onChange={(e) => handleChangeSelect(e, 'doc_id')}
                    >
                        {/* <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                        <Select.Option value="prefer not to disclose">prefer not to disclose</Select.Option> */}

                        {myDocs?.map((doc) => 
                        <Select.Option value={doc.doc_id}>{doc.doc_title}</Select.Option>
                        )}
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


export default JobModal