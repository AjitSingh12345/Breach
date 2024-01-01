import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import GpaSlider from '../Modal Peices/GpaSlider';
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  Divider,
  Upload,
  Space,
  Flex
} from 'antd';
import MFF1 from "../Modal Peices/1MultiFieldForm"

const SearchFormModal = ({ getData }) => {
  console.log("in: ")

  const [form] = Form.useForm();

  const [ searchParams, setSearchParams ] = useState({
    company_name: null,
    position: null,
    year_applied: null,
    previous_employers: [], 
    expereince_keywords: [], 
    college_attended: null,
    major: null,
    min_gpa: null,
    max_gpa: null,
    skills: [],
    clubs_activites: [],
    gender: null,
    ethnicity: null
  })

  // useEffect(() => {
  //   getData("search form page")
  // }, [])  

  const handleChangeDate = (date, dateString) => {
    console.log("date stuff: ", date, dateString)

    setSearchParams(searchParams => ({
      ...searchParams,
      ['year_applied'] : dateString
    }))
  }

  const handleChange = (e, name) => {
    console.log("changed! ", e, ", ", name)

    setSearchParams(searchParams => ({
      ...searchParams,
      [name] : e.target.value
    }))

    console.log("curr data: ", searchParams)
  }

  const handleChangeSelect = (e, name) => {
    console.log("changed select! ", e, ", ", name)

    setSearchParams(searchParams => ({
      ...searchParams,
      [name] : e
    }))

    console.log("curr data: ", searchParams)
  }

  const clearForm = () => {
    setSearchParams(searchParams => ({
      company_name: null,
      position: null,
      year_applied: null,
      previous_employers: null, 
      expereince_keywords: null, 
      college_attended: null,
      major: null,
      min_gpa: null,
      max_gpa: null,
      skills: null,
      clubs_activites: null,
      gender: null,
      ethnicity: null
    }))

    form.resetFields();
    console.log('cleared! ', searchParams)
  }

  /*
  Allows u to parameterize ur search for resumes
  - need to save this data
  - then use it in get req to backend & list result 
  - on submit -> send the data 
  - on clear -> return no results
  */

  return (
      <Form
        form={form}
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 40,
        }}
        layout="horizontal"
        style={{
          maxWidth: 800,
        }}
        onFinish={null}
      >
        <Form.Item label="Company Name">
          <Input
            onChange={(e) => handleChange(e, 'company_name')}
          />
        </Form.Item>
        <Form.Item label="Position">
          {/* <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select> */}
          <Input
            onChange={(e) => handleChange(e, 'position')}
          />
        </Form.Item>
        <Form.Item label="Year Applied">
          <Space direction="vertical">
            <DatePicker onChange={handleChangeDate} picker="year" />
          </Space>
        </Form.Item>
        <Form.Item label="Previous Employers">
          {/* select multiple items */}
          {/* <Input
            onChange={(e) => handleChange(e, 'previous_employers')}
          /> */}
          <MFF1 label1={'Previous Employers'} name='previous_employers' docData={searchParams} setDocData={setSearchParams} />
        </Form.Item>
        <Form.Item label="Experince Keywords">
          {/* select multiple items */}
          {/* <Input
            onChange={(e) => handleChange(e, 'expereince_keywords')}
          /> */}
          <MFF1 label1={'Experince Keywords'} name='expereince_keywords' docData={searchParams} setDocData={setSearchParams} />
        </Form.Item>
        <Form.Item label="College Attended">
          {/* select from many options */}
          <Input
            onChange={(e) => handleChange(e, 'college_attended')}
          />
        </Form.Item>
        <Form.Item label="Major">
          {/* select from many options */}
          <Input
            onChange={(e) => handleChange(e, 'major')}
          />
        </Form.Item>
        <Form.Item label="Min GPA">
          <GpaSlider init_val={0} name='min_gpa' data={searchParams} setData={setSearchParams} />
        </Form.Item>
        <Form.Item label="Max GPA">
          <GpaSlider init_val={6} name='max_gpa' data={searchParams} setData={setSearchParams} />
        </Form.Item>
        <Form.Item label="Skills">
          {/* select multiple options */}
          {/* <Input
            onChange={(e) => handleChange(e, 'skills')}
          /> */}
          <MFF1 label1={'Skills'} name='skills' docData={searchParams} setDocData={setSearchParams} />
        </Form.Item>
        <Form.Item label="Clubs/Activites">
          {/* select multiple options */}
          {/* <Input
            onChange={(e) => handleChange(e, 'clubs_activites')}
          /> */}
          <MFF1 label1={'Clubs/Activites'} name='clubs_activites' docData={searchParams} setDocData={setSearchParams} />
        </Form.Item>
        <Form.Item label="Gender">
          <Select
            onChange={(e) => handleChangeSelect(e, 'gender')}
          >
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Ethnicity">
          <Select
            onChange={(e) => handleChangeSelect(e, 'ethnicity')}  
          >
            <Select.Option value="other">Other</Select.Option>
          </Select>
          <Divider />
          <Flex gap="large" wrap="wrap">
            <Button 
              type="primary" 
              style={{ 
                background: "blue", 
                borderColor: "grey" }}
              onClick={() => getData(searchParams)}
            >
              Submit
            </Button>
            {' '}
            {/* <Button 
            type="primary" 
            danger
            onClick={clearForm}
            >
              Clear
            </Button> */}
          </Flex>
        </Form.Item>
      </Form>
  );
};

// export default SearchFormModal
export default SearchFormModal