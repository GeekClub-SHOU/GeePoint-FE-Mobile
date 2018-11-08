import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom'
import './App.css';
import 'antd-mobile/dist/antd-mobile.css';
import {Route} from 'react-router';
import LoginPage from "./pages/login";
import {GradeLayoutPage} from "./pages/grade/layout"
class App extends Component {
    componentWillMount(){
        // quick & dirty fix
        // todo: remove it later
        if(window.location.href === 'https://geepoint.coursego.cn' || window.location.href === 'https://geepoint.coursego.cn/'){
            window.location.href = `https://geepoint.coursego.cn/grade/recent`;
        }
    }
    render() {
        return (
            <BrowserRouter>
                <div style={{maxWidth:500,margin:"auto"}}>
                    <Route path="/login"  component={LoginPage}/>
                    <Route path="/grade" component={GradeLayoutPage} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
