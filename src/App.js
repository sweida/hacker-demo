import React from "react";
import "./App.css";
import { Form, Card,  Input, Button, } from "antd";

const { TextArea } = Input;


const data = [
  {
    time: "111",
    title: "Ant Design Title 1",
    show: true,
    child: [
      {
        time: "222",
        show: true,
        title: "Ant Design Title 2"
      },
      {
        time: "333",
        show: true,
        title: "Ant Design Title 2"
      }
    ]
  },
  {
    time: "222",
    title: "Ant Design Title 2",
    show: true
  },
  {
    time: "333",
    title: "Ant Design Title 3",
    show: true
  },
  {
    time: "444",
    title: "Ant Design Title 4",
    show: true
  }
];
let Num = 5


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      comments: []
    };
  }
  componentDidMount() {
    this.setState({
      comments: data
    });
  }

  handleChange = (name, e) => {
    this.setState({
      [name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    let data = {
      time: Num,
      title: this.state.content,
      show: true
    };
    Num++
    this.setState({
      comments: [...this.state.comments, data],
      content: ""
    });
  };
  handleClose = item => {
    item.show = !item.show;
    this.setState({
      comments: [...this.state.comments]
    });
  };

  getComments = (list) => {
    return list.map(item => {
      if (!item.child) {
        return (
          <Card key={item.time}>
            <h4>
              {item.time}
              {item.show ? (
                <span onClick={() => this.handleClose(item)}> [-]</span>
              ) : (
                <span onClick={() => this.handleClose(item)}> [+]</span>
              )}
            </h4>
            {item.show && (
              <Card bordered={false}>
                <p>{item.title}</p>
                <p>回复</p>
              </Card>
            )}
          </Card>
        );
      }  else {
        return (
          <Card key={item.time}>
            <h4>
              {item.time}
              {item.show ? (
                <span onClick={() => this.handleClose(item)}> [-]</span>
              ) : (
                <span onClick={() => this.handleClose(item)}> [+]</span>
              )}
            </h4>
            {item.show && (
              <Card bordered={false}>
                <p>{item.title}</p>
                <p>回复</p>
                {this.getComments(item.child)}
              </Card>
            )}
          </Card>
        );
      }
    });
  };

  render() {
    
    return (
      <div style={{ padding: "50px" }}>
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="Note">
            <TextArea
              rows={4}
              value={this.state.content}
              onChange={e => this.handleChange("content", e)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
        {this.getComments(this.state.comments)}
      </div>
    );
  }
}


export default App;
