import {Component} from "react";
import React from 'react';
import {Card,Badge} from 'antd-mobile'
import {ScoreService} from "../utils/ScoreService";
const Body = Card.Body;
const Footer = Card.Footer;
export class CourseInfoComponent extends Component {

    get course(){
        return this.props.course;
    }
    get courseGradeInfo(){
        return this.props.course.courseGradeInfo;
    }

    render(){
        let scoreElement = null;
        let gpaElement = null;
        if(this.courseGradeInfo){
            scoreElement = <Badge text={this.courseGradeInfo.gradeScore || this.courseGradeInfo.gradeName || '未知'}
                                  style={{
                                      marginLeft: 12,
                                      padding: '0 3px',
                                      backgroundColor: (this.courseGradeInfo && ScoreService.getCourseGPA(this.courseGradeInfo) > 0)?'#21b68a':'red',
                                      borderRadius: 2 }}
            />;
            gpaElement =
                <div style={{display:'flex',alignItems:'center'}}>
                    <span>绩点：</span>
                    <span>{ScoreService.getCourseGPA(this.courseGradeInfo)}</span>
                </div>
        }

        return <Card full>
            <Body>
                <div>
                    <p style={{display:"flex",alignItems:'center'}}>{this.course.courseName || '未知'}  {scoreElement}</p>
                    <p>课程类型：{this.course.coursePropertiesName || '未知'} </p>
                    <p>教师： {this.course.teacherName || '未知'}</p>
                    <p>测验类型： {this.course.examTypeName || '未知'}</p>
                    <p>学分： {this.course.unit || '未知'}</p>
                    <p>测验时间： {this.course.examTime || '未知'}</p>
                    {gpaElement}
                </div>
            </Body>
            <Footer content={<span>课程号：{this.course.courseNumber}</span>} extra={<span>课序号：{this.course.courseSequenceNumber}</span>} />
        </Card>
    }
}
