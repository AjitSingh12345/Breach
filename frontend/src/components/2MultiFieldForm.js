import {  MinusCircleOutlined, PlusOutlined  } from '@ant-design/icons';
import {  Button, Form, Input, Space  } from 'antd';

const MFF2 = ({ label1, label2, name, docData, setDocData }) => {
  const onUpdate = (values, allVals) => {
    console.log('Received values of form:', values, ", ", allVals);

    setDocData(docData => ({
        ...docData,
        [name] : allVals
    }))

    console.log("updated: ", docData)
  }

  return (
    <Form
      name="dynamic_form_nest_item"
      onValuesChange={onUpdate}
      style={{
        maxWidth: 600,
      }}
      autoComplete="off"
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
                <Form.Item
                  {...restField}
                  name={[name, 'last']}
                  rules={[
                    {
                      required: true,
                      message: 'Missing ' + label2,
                    },
                  ]}
                >
                  <Input placeholder={label2} />
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
    </Form>
  )
};

export default MFF2