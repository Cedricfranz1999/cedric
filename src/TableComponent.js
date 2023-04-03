import {
  Table,
  Popconfirm,
  Input,
  Checkbox,
  InputNumber,
  Form,
  Typography,
  Radio,
} from "antd";
import React from "react";
import { useContext, useState } from "react";
import { UserContext } from "./App";
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function TableComponent() {
  const { display, setDisplay } = useContext(UserContext);

  const [form] = Form.useForm();
  const [data, setData] = useState(display);
  console.log(data);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      id: "",
      taskName: "",
      startDate: "",
      endDate: "",

      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    console.log(key);
    try {
      const row = await form.validateFields();

      const newData = [...data];

      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        console.log(item);
        setData(newData);
        setDisplay(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setDisplay(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
    console.log(data);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      width: 10,
      searchable: true,
      editable: true,
    },
    {
      title: "TaskName",
      dataIndex: "taskName",
      width: 50,
      searchable: true,
      editable: true,
    },
    {
      title: "StartDate",
      dataIndex: "startDate",
      width: 110,
      searchable: true,
      editable: true,
    },
    {
      title: "EndDate",
      dataIndex: "endDate",
      width: 110,
      searchable: true,
      editable: true,
    },

    {
      title: "Action",
      dataIndex: "operation",
      width: 10,
      render: (_, record) =>
        display.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>
              {" "}
              <DeleteOutlined className=" bg-red-400 py-1 text-lg px-2 text-white "></DeleteOutlined>{" "}
            </a>
          </Popconfirm>
        ) : null,
    },

    {
      title: "Edit",
      width: 10,
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <EditOutlined className="  p-1 bg-yellow-400 text-xl text-white  "></EditOutlined>
          </Typography.Link>
        );
      },
    },
    {
      title: "Progress",
      key: "select",
      width: 10,
      render: (text, record) => (
        <input
          className="  w-10 h-7 p-0  mt-2"
          id="cb1"
          type="checkbox"
          checked={selectedRows.includes(record.id)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "id" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  const filteredData = display.filter((record) =>
    Object.values(record).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,

      {
        key: "odd",
        text: " Delete All",
        onSelect: (changeableRowKeys) => {
          setDisplay([]);
        },
      },
      {
        key: "deleteSelected",
        text: " DeleteSelected",
        onSelect: (changeableRowKeys) => {
          handleDeleteSelected();
        },
      },
    ],
  };
  const handleDelete = (key) => {
    const newData = (display.filter = (item) => item.key !== key);
    setDisplay(newData);
  };
  const handleDeleteSelected = () => {
    setDisplay(display.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const getRowClassName = (record) => {
    if (record.editable) {
      return "row-editable";
    }
    return selectedRows.includes(record.id) ? "green-row" : "";
  };

  const handleCheckboxChange = (record) => {
    const selectedRowIds = selectedRows.slice();
    const index = selectedRows.indexOf(record.id);
    if (index > -1) {
      selectedRowIds.splice(index, 1);
    } else {
      selectedRowIds.push(record.id);
    }
    setSelectedRows(selectedRowIds);
  };

  return (
    <div>
      <Search
        size="small"
        className=" mt-5  mb-1  w-1/3 float-left"
        placeholder="Search"
        onSearch={handleSearch}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
      />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName={getRowClassName}
          size="large"
          className=" bg-slate-700 "
          rowSelection={rowSelection}
          columns={mergedColumns}
          dataSource={filteredData}
          pagination={{
            pageSize: 3,
          }}
        />
      </Form>
    </div>
  );
}

export default TableComponent;
