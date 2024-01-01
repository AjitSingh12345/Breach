import React, { useState } from 'react';
import {  
    Col, 
    InputNumber, 
    Row, 
    Slider, 
    Space  
} from 'antd';

const GpaSlider = ({ init_val, name, data, setData }) => {
  const [inputValue, setInputValue] = useState(init_val);

  const onChange = (value) => {
    console.log('gpa is now: ', value)

    if (isNaN(value)) {
      return;
    }
    setInputValue(value);

    setData(data => ({
      ...data,
      [name] : value
    }))

    console.log("updated gpa: ", data)
  };
  
  
  return (
    <Row>
      <Col span={12}>
        <Slider
          min={0}
          max={6}
          onChange={onChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
          step={0.01}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={0}
          max={6}
          style={{
            margin: '0 16px',
          }}
          step={0.01}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default GpaSlider;