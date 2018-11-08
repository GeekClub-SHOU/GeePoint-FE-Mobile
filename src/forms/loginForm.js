import {Component} from "react";
import React from 'react';
import {List, InputItem, Button,WhiteSpace } from 'antd-mobile'
import { createForm } from "rc-form";

class LoginForm extends Component {
    state = {
        to:''
    };
    render(){
        const { getFieldProps } = this.props.form;
        return (
            <div >
                <List renderHeader={() => ''}>
                    <InputItem
                        {...getFieldProps('username')}
                        type="digit"
                        placeholder="请输入您的 URP 账号"
                    >URP 账号</InputItem>
                    <InputItem
                        {...getFieldProps('password')}
                        type="password"
                        placeholder="******"
                    >URP 密码</InputItem>
                </List>
                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>
                <Button loading={this.props.loading && this.state.to === 'recent'} disabled={this.props.loading} type="primary" onClick={() => {this.onSubmit('recent')}}>查询</Button>
            </div>
        );
    }

    onSubmit(to){
        console.log(this.props.form.getFieldsValue());
        this.setState({
            to
        });
        this.props.onSubmit({
            to,
            form:this.props.form.getFieldsValue()
        })
    }
}
export default createForm()(LoginForm);
