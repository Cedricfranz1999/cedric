import { Input, Button, Form, DatePicker, Search } from "antd";
import React from "react";
import { useContext, useRef } from "react";
import { UserContext } from "./App";
import moment from "moment/moment";
import { useState } from "react";
import { DeleteOutlined, CheckCircleFilled } from "@ant-design/icons";

function FormComponent() {
  const formRef = useRef(null);
  const { display, setDisplay, input, setInput } = useContext(UserContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [form] = Form.useForm();

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const handleDateRangeChange = (value) => {
    if (value && value.length === 2) {
      const start = moment(value[0]).startOf("day");
      const end = moment(value[1]).endOf("day");
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const displayTask = () => {
    form.resetFields();
    const task = {
      key: display.length.toString(),
      id: display.length === 0 ? 1 : display[display.length - 1].id + 1,

      taskName: input,
      startDate: startDate.format("MMM DD, YYYY"),
      endDate: endDate.format("MMM DD, YYYY"),
      action: <DeleteOutlined></DeleteOutlined>,
    };

    const newDisplayTodo = [...display, task];

    setInput("");
    setDisplay(newDisplayTodo);
  };

  return (
    <div>
      <Form
        name="forms"
        form={form}
        layout="inline"
        onFinish={displayTask}
        ref={formRef}
      >
        <Form.Item name={["user", "name"]} rules={[{ required: true }]}>
          <Input
            className="   text-center "
            value={input}
            placeholder=" Enter New Task"
            onChange={handleInput}
          />
        </Form.Item>

        <Form.Item rules={[{ required: true }]}>
          <DatePicker.RangePicker
            onChange={handleDateRangeChange}
            className=" "
            name="dateRange"
          ></DatePicker.RangePicker>
        </Form.Item>

        <Form.Item>
          <Button
            className="  w-full bg-yellow-600 text-white "
            htmlType="submit"
          >
            {" "}
            Set New Task
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FormComponent;
