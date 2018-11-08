import {Component} from "react";
import React from 'react';
import {Route,Switch} from 'react-router'
import {List,ActivityIndicator} from 'antd-mobile'
import OverflowScrolling from 'react-overflow-scrolling'
import {RecentGradePage} from "./recent";
import {AllGradePage} from "./all";

import {StorageService} from "../../utils/StorageService";
import {HttpService} from "../../utils/HttpService";
const Item = List.Item;
export class GradeLayoutPage extends Component {
    state = {
        _loading:false,
        GPAInfo:null
    };
    get loading(){
        return this.state._loading;
    }
    set loading(flag){
        this.setState({
            _loading:flag
        })
    }
    async componentDidMount(){
        await this.fetchData();
    }

    /**
     * 获取数据
     *
     * @returns {Promise<void>}
     */
    async fetchData(){
        this.loading = true;
        try {
            // 从缓存中获取 crawlerCookie
            const crawlerCookie = await StorageService.getItem('crawlerCookie');
            // 缓存失效则前往 login
            if(!crawlerCookie){
                this.props.history.push('/login');
            }
            // 获取 gpa 信息
            const response = await HttpService.post('/crawler/getGPA',{
                crawlerCookie
            });
            this.setState({
                GPAInfo:response[0]
            });
        }catch (e) {
            // 此处主要为 Storage 发生错误，或者 Storage 中保存了错误的用户名与密码导致网络请求返回 403
            // 以上情况下前往 login
            this.props.history.push('/login');
        }finally {
            this.loading = false
        }
    }

    get GPAInfo(){
        return this.state.GPAInfo;
    }




    render(){

        // 如果获取到了信息便渲染
        // 尚未获取便渲染 loading
        let gpaElement;
        if(!this.loading && this.GPAInfo){
            gpaElement = <List renderHeader={"基本信息"}>
                <Item extra={this.GPAInfo.gpa}>所有学科平均绩点</Item>
                <Item extra={this.GPAInfo.courseNum + ' 门'}>所有已修读课程门数</Item>
                <Item extra={this.GPAInfo.coursePas + ' 门'}>尚不及格门数</Item>
                <Item extra={this.GPAInfo.courseNum_bxqyxd + ' 门'}>本学期待修读课程</Item>
            </List>
        } else {
            gpaElement = <div style={{padding:20,display:"flex",justifyContent:'center'}}>
                <ActivityIndicator text="正在加载" />
            </div>
        }
        return (
            <OverflowScrolling className='overflow-scrolling'>
                {gpaElement}
                <Switch>
                    <Route path="/grade/recent"  component={RecentGradePage}/>
                    <Route path="/grade/all"  component={AllGradePage}/>
                </Switch>
            </OverflowScrolling>
        )
    }

}
