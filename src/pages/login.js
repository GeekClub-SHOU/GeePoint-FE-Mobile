import {Component} from "react";
import React from 'react';
import './login.css'
import {Toast}from 'antd-mobile';
import {GoMarkGithub} from 'react-icons/go'
import LoginForm from "../forms/loginForm";
import {HttpService} from "../utils/HttpService";
import {StorageService} from "../utils/StorageService";
class LoginPage extends Component {
    state = {
        _loading:false
    };

    set loading(flag){
        this.setState({
            _loading:flag
        });
    }

    get loading(){
        return this.state._loading;
    }

    async componentDidMount(){
        // 进入 login page ， 删除缓存中的信息，自动注销
        await StorageService.removeItem('username');
        await StorageService.removeItem('password');
    }

    /**
     * 登录
     *
     * @param to: string 需要前往的页面,“recent” 表示本学期，"all" 表示所有学期
     * @param form: {
     *     username: string;
     *     password: string;
     * } 表单，用户名 与 密码
     * @returns {Promise<void>}
     */
    onSubmit = async ({to,form}) => {
        this.loading = true;
        try {
            // 请求登录接口检查是否是否正确
            const response = await HttpService.post('/crawler/login',{
                username:form.username,
                password:form.password
            });
            // 由于服务器不保存 urp 的账号密码，保存传回的 crawlerCookie
            // 之后获取 gpa 等信息仍然需要 crawlerCookie
            await StorageService.setItem('crawlerCookie',response.crawlerCookie);
            this.loading = false;
            // 如果登录成功，进入对应路由
            this.props.history.push('/grade/' + to);
        }catch (e) {
            this.loading = false;
            Toast.fail(e.message, 1.5);
        }
    };

    goToGithub(){
        window.open('https://github.com/GeekClub-SHOU/GeePoint-FE-Mobile');
    }


    render(){
        return (
            <div className="container">
                <div className="titleContainer">
                    <p className="title">CourseGo</p>
                    <span className="subTitle">绩点查询工具</span>
                </div>
                <div style={{marginTop:50}} className="bodyContainer">
                    <LoginForm loading={this.loading} onSubmit={this.onSubmit} />
                </div>
                <div className="footer">
                    <GoMarkGithub onClick={() => {
                        this.goToGithub()
                    }} className="footer-icon" />
                </div>
            </div>
        );
    }
}
export default LoginPage;
