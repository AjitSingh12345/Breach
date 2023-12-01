import {  MinusCircleOutlined, PlusOutlined  } from '@ant-design/icons';
import {  Button, Form, Input, Space  } from 'antd';

const MFF1 = ({ label1, name, docData, setDocData }) => {
    // console.log("in: ", docData)

    const onUpdate = (values, allVals) => {
        console.log('Received values of form:', values, ", ", allVals, allVals[name]);

        setDocData(docData => ({
            ...docData,
            [name] : allVals[name]
        }))

        console.log("updated: ", docData)
    }
    
    return (
      <Form
        name="dynamic_form_nest_item"
        style={{
          maxWidth: 600,
        }}
        autoComplete="off"
        onValuesChange={onUpdate}
      >
        <Form.List name={name}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'first']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing ' + label1,
                      },
                    ]}
                  >
                    <Input placeholder={label1} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    )
};

export default MFF1