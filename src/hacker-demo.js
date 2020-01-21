import React from "react";
import "./App.css";
import { Form, Card, Input, Button, message } from "antd";

const { TextArea } = Input;

const data = [
  {
    id: 1,
    text: "Ant Design Title 1",
    show: true,
    reply: false,
    child: [
      {
        id: 2,
        show: true,
        reply: false,
        text: "Ant Design Title 2"
      },
      {
        id: 3,
        show: true,
        reply: false,
        text: "Ant Design Title 2"
      }
    ]
  },
  {
    id: 4,
    text: "Ant Design Title 2",
    reply: false,
    show: true
  },
  {
    id: 5,
    text: "Ant Design Title 3",
    reply: false,
    show: true
  },
  {
    id: 6,
    text: "Ant Design Title 4",
    reply: false,
    show: true
  }
];
let Num = 7


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      comments: [],
      replyText: ""
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

  // 评论
  handleSubmit = e => {
    e.preventDefault();

    let data = {
      id: Num,
      text: this.state.content,
      show: true,
      reply: false
    };
    Num++;
    this.setState({
      comments: [...this.state.comments, data],
      content: ""
    });
    message.success("评论成功！");
  };

  handleCloseOrShow = item => {
    item.show = !item.show;
    this.setState({
      comments: [...this.state.comments]
    });
  };

  showReply = item => {
    
    function fib(arr) {
      arr.forEach(data => {
        data.reply = false
        if (data.child) {
          fib(data.child)
        }
      })
    }
    fib(this.state.comments)
    item.reply = !item.reply;

    this.setState({
      comments: [...this.state.comments],
      replyText: ''
    });
  };
  // 回复
  handleReply = item => {
    console.log(item);
    let data = {
      id: Num,
      text: this.state.replyText,
      show: true,
      reply: false
    };
    Num++;
    if (item.child) {
      item.child.push(data);
    } else {
      item.child = [];
      item.child.push(data);
    }
    item.reply = false;
    this.setState({
      comments: [...this.state.comments],
      replyText: ""
    });
    message.success("回复成功！");
  };

  getComments = list => {
    return list.map(item => {
      return (
        <Card key={item.id}>
          <h4>
            {item.id}
            <span onClick={() => this.handleCloseOrShow(item)}> 
              {item.show ? '[-]' : '[+]' }
            </span>
          </h4>
          {item.show && (
            <Card bordered={false}>
              <p>{item.text}</p>
              <p onClick={() => this.showReply(item)}>回复</p>
              {item.reply && (
                <div>
                  <Input
                    type="text"
                    value={this.state.replyText}
                    onChange={e => this.handleChange("replyText", e)}
                  />
                  <Button
                    type="primary"
                    onClick={() => this.handleReply(item)}
                    style={{ margin: "10px 0" }}
                    disabled={this.state.replyText == ""}
                  >
                    提交
                  </Button>
                </div>
              )}
              {item.child && this.getComments(item.child)}
            </Card>
          )}
        </Card>
      );
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
          <Form.Item label="评论">
            <TextArea
              rows={4}
              value={this.state.content}
              onChange={e => this.handleChange("content", e)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 22, offset: 2 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.content == ""}
            >
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
