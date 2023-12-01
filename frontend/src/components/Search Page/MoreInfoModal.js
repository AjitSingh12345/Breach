import { useState } from "react"
import { useCookies } from 'react-cookie'
import {
    Button,
    Select,
    DatePicker,
    Modal
} from 'antd';

// info =
//     {
//         name: 'hi',
//         company: 'me'
//     }

const MoreInfoModal = ( {showModal, setShowModal, input} ) => {  
    const handleCancel = () => {
        setShowModal(false);
    }

    /*
    - have to do = [0] bc before input was array of size 1 of objects  
    so i got this error ...
    Uncaught Error: Objects are not valid as a React child (found: object with keys {doc_id, user_email, college_attended, gpa, major, minor, grad_date, previous_experiences, skills, clubs_activities, awards_honors, ethnicity, gender, doc_added_date}). If you meant to render a collection of children, use an array instead.
    */
    if (input != null) {
        input = input[0]
        console.log("mim: ", input)
        const not_inc_keys = [ "doc_id", "user_email", "doc_added_date" ]

        // remove unwanted keys
        for (const key of not_inc_keys) {
            console.log(key)
            input = withoutProperty(input, key)  
        }

        function withoutProperty(obj, property) {  
            const { [property]: unused, ...rest } = obj
            return rest
        }
    }

    const formatEntry = (key) => {
        // {!not_inc_keys.includes(key) && <p>{key}: {input[key]} <br/> </p>}
        return (
            <p>{key}: {input[key]} <br/> </p>
        )
    }

    console.log("final input: ", input)

    return (
        <Modal 
            open={showModal}
            title="Resume Info" 
            onOk={null} 
            onCancel={handleCancel}
            footer={[
                <Button 
                    type="primary" 
                    onClick={() => setShowModal(false)}
                    style={{
                        borderColor: 'grey',
                        backgroundColor: 'blue',
                    }}
                >
                    Ok
                </Button>
            ]}>
            {(input != null) && Object.keys(input)?.map((key) => 
                <p>{key}: {input[key]} <br/> </p>
            )}
        </Modal>
    )
}

export default MoreInfoModal 