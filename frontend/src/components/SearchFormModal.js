import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import GpaSlider from './GpaSlider';
import {
  // Button,
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

// import {
//   Button
// } from 'react-native'


import { Button } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
 

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const SearchFormModal = ({ getData }) => {
  const [ searchParams, setSearchParams ] = useState({
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
  })

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

  const finished = (e) => {
    console.log('finished! ', e)
  }

  /*
  Allows u to parameterize ur search for resumes
  - need to save this data
  - then use it in get req to backend & list result 
  - on submit -> send the data 
  - on clear -> return no results
  */

  return (
    <div>
    {/* <label>Enter in ur search params</label> */}
      <Form
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
        onFinish={finished}
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
          <Input
            onChange={(e) => handleChange(e, 'previous_employers')}
          />
        </Form.Item>
        <Form.Item label="Experince Keywords">
          {/* select multiple items */}
          <Input
            onChange={(e) => handleChange(e, 'expereince_keywords')}
          />
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
          <GpaSlider name='min_gpa' data={searchParams} setData={setSearchParams} />
        </Form.Item>
        <Form.Item label="Max GPA">
          <GpaSlider name='max_gpa' data={searchParams} setData={setSearchParams} />
        </Form.Item>
        <Form.Item label="Skills">
          {/* select multiple options */}
          <Input
            onChange={(e) => handleChange(e, 'skills')}
          />
        </Form.Item>
        <Form.Item label="Clubs/Activites">
          {/* select multiple options */}
          <Input
            onChange={(e) => handleChange(e, 'clubs_activites')}
          />
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
              style={{ background: "blue", 
              borderColor: "grey" }}>
              Submit
            </Button>
            {' '}
            <Button type="primary" danger>
              Clear
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </div>
  );
};

// export default SearchFormModal
export default () => <SearchFormModal />;