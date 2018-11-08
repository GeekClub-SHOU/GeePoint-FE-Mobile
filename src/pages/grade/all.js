import {Component} from "react";
import React from 'react';
import {List,ActivityIndicator,Accordion} from 'antd-mobile'
import {StorageService} from "../../utils/StorageService";
import {HttpService} from "../../utils/HttpService";
import {IoIosSearch,IoMdExit} from 'react-icons/io';
import OverflowScrolling from 'react-overflow-scrolling';
import {CourseInfoComponent} from "../../components/courseInfoComponent";
import {ScoreService} from "../../utils/ScoreService";
const Item = List.Item;
const Panel = Accordion.Panel;
export class AllGradePage extends Component {

    state = {
        _loading:false,
        courseResponse:[]
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
        this.loading = true;
        try {
            // 从缓存中获取 crawlerCookie
            const crawlerCookie = await StorageService.getItem('crawlerCookie');
            // 缓存失效则前往 login
            if(!crawlerCookie){
                this.props.history.push('/login');
            }
            // 获取 本学期成绩 信息
            const response = await HttpService.post('/crawler/getHistoryGrade',{
                crawlerCookie
            });
            this.loading = false;
            this.setState({
                courseResponse:response,
            });
        }catch (e) {
            this.loading = false;
            this.props.history.push('/login')
        }
    }

    /**
     * 查询本学期绩点
     * 跳转到 /grade/all
     */
    queryRecent = () => {
        this.props.history.replace('/grade/recent');
    };

    /**
     * 注销
     * 前往 Login 页面后会删除 LocalStorage 中的 JSSESSION_ID
     */
    logout(){
        this.props.history.push('/login');
    }

    renderOperateButtons(){
        return <List renderHeader={"其他"}>
            <Item arrow="horizontal">
                <div style={{display:'flex',alignItems:'center',color:'#006d75'}}
                     onClick={this.queryRecent}
                >
                    <IoIosSearch style={{fontSize:25,marginRight:5}}/>
                    查询本学期绩点
                </div>
            </Item>
            <Item arrow="horizontal"
            >
                <div style={{display:'flex',alignItems:'center',color:'#a8071a'}}
                     onClick={() => {this.logout()}}
                >
                    <IoMdExit style={{fontSize:25,marginRight:5}}/>
                    注销
                </div>
            </Item>
        </List>
    }


    render(){
        return (
            <OverflowScrolling>
                {this.renderOperateButtons()}
                {this.renderTermList()}
            </OverflowScrolling>
        )
    }

    renderTermList() {
        if (!this.loading) {
            const elements = [];
            console.log(this.state.courseResponse);
            for(let key in this.state.courseResponse){
                elements.push(<div>
                    <List renderHeader={key} key={key}>
                        {this.renderCourseList(this.state.courseResponse[key])}
                    </List>
                </div>)
            }
            return elements;
        }else{
            return <div style={{padding:20,display:"flex",justifyContent:'center'}}>
                <ActivityIndicator text="正在加载" />
            </div>
        }
    }
    renderCourseList(courseList){
        if(!this.loading){
            return courseList.map((value,index) => {
                let grade = '';
                // 如果课程有成绩信息，则 grade 保存成绩。反之为 🙏
                if(ScoreService.getCourseGrade(value)){
                    grade = ScoreService.getCourseGrade(value);
                } else {
                    grade = '🙏'
                }
                return  <Accordion key={index}>
                    <Panel header={<div style={{display:'flex',justifyContent:'space-between'}}>
                        <span>{value.courseName}</span>
                        <span style={{marginRight:10,color:'#AAA'}}>{grade}</span>
                    </div>}>
                        <CourseInfoComponent course={value}/>
                    </Panel>
                </Accordion>
            })
        }else{
            return <div style={{padding:20,display:"flex",justifyContent:'center'}}>
                <ActivityIndicator text="正在加载" />
            </div>
        }
    }
}
