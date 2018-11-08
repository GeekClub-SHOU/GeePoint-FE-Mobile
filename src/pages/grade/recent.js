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
export class RecentGradePage extends Component {

    state = {
        _loading:false,
        courseList:[]
    };
    get loading(){
        return this.state._loading;
    }
    set loading(flag){
        this.setState({
            _loading:flag
        })
    }

    /**
     * 所有课程的总学分
     * @returns {number} 学分
     */
    get totalUnit(){
        let totalUnit = 0;
        for(let course of this.state.courseList){
            totalUnit += course.unit;
        }
        return totalUnit;
    }

    /**
     * 所有已出成绩课程的总学分
     * @returns {number} 学分
     */
    get totalUnitForFinishedCourses(){
        let totalUnit = 0;
        for(let course of this.state.courseList){
            if(ScoreService.getCourseGrade(course)){
                totalUnit += course.unit;
            }
        }
        return totalUnit;
    }

    /**
     * 未出成绩平均绩点
     * @returns {string} 绩点
     */
    get averageGPANoDefault(){
        let averageGPA = 0;
        for(let course of this.state.courseList){
            if(ScoreService.getCourseGrade(course)){
                const courseGPA = ScoreService.getCourseGPA(course.courseGradeInfo);
                averageGPA += (course.unit/this.totalUnit) * courseGPA
            }
        }
        return averageGPA.toFixed(2);
    }

    /**
     * 已出成绩平均绩点
     *
     * 如果没有成绩信息则绩点按照 0 计算
     * @returns {string} 绩点
     */
    get averageGPAForFinishedCourses(){
        // 如果已出科目的总学分为0 则意味着没有出任何一门。
        // 直接return 0 ，防止后面出现除以 0 而出现 NAN
        if(this.totalUnitForFinishedCourses === 0){
            return "0";
        }
        // 如果总学分不为0 ， 则正常计算平均绩点
        let averageGPA = 0;
        for(let course of this.state.courseList){
            let courseGPA;
            if(ScoreService.getCourseGrade(course)){
                courseGPA = ScoreService.getCourseGPA(course.courseGradeInfo);
            }else{
                // 未出成绩按照 0 分计算
                courseGPA = 0;
            }
            averageGPA += (course.unit/this.totalUnitForFinishedCourses) * courseGPA
        }
        return averageGPA.toFixed(2);
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
            const response = await HttpService.post('/crawler/getThisTermGrade',{
                crawlerCookie
            });
            this.loading = false;
            this.setState({
                courseList:response,
            });
        }catch (e) {
            this.loading = false;
            this.props.history.push('/login')
        }
    }

    /**
     * 查询所有学期绩点
     * 跳转到 /grade/all
     */
    queryAllGrade = () => {
        this.props.history.replace('/grade/all');
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
                     onClick={this.queryAllGrade}
                >
                    <IoIosSearch style={{fontSize:20,marginRight:5}}/>
                    查询其他学期绩点
                </div>
            </Item>
            <Item arrow="horizontal"
            >
                <div style={{display:'flex',alignItems:'center',color:'#a8071a'}}
                     onClick={() => {this.logout()}}
                >
                    <IoMdExit style={{fontSize:20,marginRight:5}}/>
                    注销
                </div>
            </Item>
        </List>
    }


    render(){
        return (
            <OverflowScrolling>
                {this.renderOperateButtons()}
                <List renderHeader="本学期成绩">
                    <Item extra={this.totalUnit + ' 分'}>总学分</Item>
                    <Item extra={this.averageGPAForFinishedCourses}>已出成绩平均绩点</Item>
                    <Item extra={this.averageGPANoDefault}>未出成绩平均绩点</Item>
                    {this.renderCourseList()}
                </List>
            </OverflowScrolling>
        )
    }

    renderCourseList(){
        if(!this.loading){
            return this.state.courseList.map((value,index) => {
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
