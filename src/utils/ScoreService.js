export class ScoreService{

    static getCourseGPA(courseGradeInfo){
        if(courseGradeInfo.gradeScore !== null && courseGradeInfo.gradeScore !== undefined){
            /**
             * 根据分数计算绩点
             */
            // 确保 gradeScore 是 number 类型
            const gradeScore = parseFloat(courseGradeInfo.gradeScore);
            if(gradeScore < 60){
                return 0;
            }else if(gradeScore < 64){
                return 1.0;
            }else if(gradeScore < 66){
                return 1.5;
            }else if(gradeScore < 68){
                return 1.7;
            }else if(gradeScore < 72){
                return 2;
            }else if(gradeScore < 75){
                return 2.3;
            }else if(gradeScore < 78){
                return 2.7;
            }else if(gradeScore < 82){
                return 3;
            }else if(gradeScore < 85){
                return 3.3;
            }else if(gradeScore < 90){
                return 3.7;
            }else{
                return 4;
            }
        }else{
            /**
             * 根据等级计算绩点
             */
            const gradeName = courseGradeInfo.gradeName;
            // 五级制
            if(gradeName === '不及格'){
                return 0;
            }else if(gradeName === '及格'){
                return 1;
            }else if(gradeName === '中等'){
                return 2.3
            }else if(gradeName === '良好'){
                return 3.3
            }else if(gradeName === '优秀'){
                return 4
            }
            // 两级制
            else if(gradeName === '不通过'){
                return 0
            }else if(gradeName === '通过'){
                return 3.3
            }
        }
    }

    static getCourseGrade(course){
        if(!course.courseGradeInfo){
            return null;
        }else if(course.courseGradeInfo.gradeScore){
            return parseFloat(course.courseGradeInfo.gradeScore).toFixed(2);
        }else if(course.courseGradeInfo.gradeName){
            return course.courseGradeInfo.gradeName;
        }else{
            return null;
        }
    }
}
