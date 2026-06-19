// مصفوفة البيانات المحفوظة (التسجيل الأول - فارغ وقابل للزيادة)
let academicData = {
    groups: [
        {
            id: 1,
            name: "المجموعة الأولى المخصصة",
            subjects: [
                { name: "علم القياس", coefficiency: 1, exam: 10, td: null },
                { name: "التكنولوجيا الأساسية", coefficiency: 1, exam: 14, td: null }
            ]
        }
        // يمكن للمستخدم إضافة مجموعات ومواد أخرى هنا ديناميكياً
    ]
};

/**
 * خوارزمية حساب المعدل الفصلي العام والمجموعات
 * تم ضبطها لتعمل بدون مشاكل تقنية حتى لو كانت القيم فارغة
 */
function calculateSemesterGPA(data) {
    let totalSemesterPoints = 0;
    let totalSemesterCoefficients = 0;
    let groupsResults = [];

    // المرور على كل مجموعة
    data.groups.forEach(group => {
        let totalGroupPoints = 0;
        let totalGroupCoefficients = 0;

        // المرور على مواد المجموعة
        group.subjects.forEach(subject => {
            let exam = parseFloat(subject.exam);
            let td = subject.td !== null && subject.td !== "" ? parseFloat(subject.td) : null;
            let coeff = parseFloat(subject.coefficiency) || 0;

            // إذا لم يتم إدخال نقطة الامتحان، تُعتبر 0 كقيمة افتراضية للحساب
            if (isNaN(exam)) exam = 0;

            let subjectAverage = 0;

            // القاعدة الذكية: إذا خانة TD فارغة أو ممسوحة، معدل المادة = نقطة الامتحان مباشرة
            if (td === null || isNaN(td)) {
                subjectAverage = exam;
            } else {
                // إذا وُجدت نقطة الـ TD يتم الحساب الموزون
                subjectAverage = (exam * 0.6) + (td * 0.4);
            }

            // إضافة نقاط المادة إلى إجمالي المجموعة
            totalGroupPoints += (subjectAverage * coeff);
            totalGroupCoefficients += coeff;
        });

        // حساب معدل المجموعة الحالية
        let groupAverage = totalGroupCoefficients > 0 ? (totalGroupPoints / totalGroupCoefficients) : 0;

        groupsResults.push({
            groupId: group.id,
            groupName: group.name,
            average: groupAverage,
            totalCoeff: totalGroupCoefficients
        });

        // إضافة إجمالي المجموعة إلى الحساب الفصلي العام
        totalSemesterPoints += (groupAverage * totalGroupCoefficients);
        totalSemesterCoefficients += totalGroupCoefficients;
    });

    // حساب المعدل الفصلي العام الإجمالي
    let semesterGPA = totalSemesterCoefficients > 0 ? (totalSemesterPoints / totalSemesterCoefficients) : 0;

    return {
        semesterGPA: semesterGPA.toFixed(3),
        groups: groupsResults
    };
}

// ===== مثال على طريقة تشغيل الخوارزمية واختبارها =====
// (تخيل أن المستخدم أضاف مادة جديدة بها TD ومادة بدون TD)
let testData = {
    groups: [
        {
            id: 1,
            name: "المجموعة 1",
            subjects: [
                { name: "علم القياس", coefficiency: 1, exam: 10, td: null }, // بدون TD (المعدل 10)
                { name: "التكنولوجيا الأساسية", coefficiency: 1, exam: 14, td: "" } // فارغة تعني بدون TD (المعدل 14)
            ]
        },
        {
            id: 3,
            name: "المجموعة 3",
            subjects: [
                { name: "الرياضيات", coefficiency: 3, exam: 7, td: 10.5 }, // بها TD (المعدل 8.4)
                { name: "الميكانيك الجدرية", coefficiency: 2, exam: 14, td: 8.01 } // بها TD (المعدل 11.604)
            ]
        }
    ]
};

// تشغيل الخوارزمية واختبار النتيجة
console.log(calculateSemesterGPA(testData));