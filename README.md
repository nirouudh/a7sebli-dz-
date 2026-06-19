<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حاسبة المعدل الجامعي الذكية - نظام LMD</title>
    <style>
        :root { --primary: #2c3e50; --accent: #3498db; --success: #2ecc71; --light: #f5f7fa; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: var(--light); color: #333; padding: 20px; direction: rtl; }
        .container { max-width: 1100px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        h1 { text-align: center; color: var(--primary); margin-bottom: 5px; }
        .subtitle { text-align: center; color: #7f8c8d; margin-bottom: 20px; font-weight: bold; }
        .btn { padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s; margin: 5px; }
        .btn-add { background: var(--accent); color: white; }
        .btn-calc { background: var(--success); color: white; width: 100%; font-size: 1.2rem; padding: 12px; margin-top: 20px; border-radius: 8px; }
        .btn-danger { background: #e74c3c; color: white; padding: 5px 10px; font-size: 0.85rem; }
        
        /* تقسيم الواجهة لظهور المستشار في الجانب بدون اختلاط */
        .main-layout { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 25px; }
        .content-area { flex: 3; min-width: 300px; }
        .advisor-area { flex: 1; min-width: 250px; background: #fffcf4; border: 2px dashed #f39c12; border-radius: 8px; padding: 15px; display: none; height: fit-content; }
        .advisor-title { font-weight: bold; color: #d35400; margin-bottom: 10px; border-bottom: 1px dashed #f39c12; padding-bottom: 5px; display: flex; align-items: center; gap: 5px; }
        .advisor-msg { font-size: 0.95rem; line-height: 1.5; color: #34495e; }
        .advisor-alert { color: #c0392b; font-weight: bold; }
        
        .group-box { border: 2px solid #eaeded; border-radius: 8px; padding: 20px; margin-bottom: 25px; background: #fdfefe; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .group-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ccc; padding-bottom: 8px; margin-bottom: 15px; }
        .group-title-input { font-size: 1.1rem; font-weight: bold; border: none; background: transparent; color: var(--primary); border-bottom: 1px dashed #ccc; width: 60%; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
        th, td { border: 1px solid #bdc3c7; padding: 10px; text-align: center; }
        th { background: #e5e8e8; color: var(--primary); }
        input[type="text"], input[type="number"] { width: 90%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; text-align: center; font-size: 0.95rem; }
        .result-box { background: var(--primary); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 25px; font-size: 1.5rem; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>

<div class="container">
    <h1>📊 حاسبة المعدل الجامعي المرنة (نظام LMD)</h1>
    <p class="subtitle">[نموذج التسجيل الأول المطور - مجموعات ومواد تفاعلية]</p>
    
    <div style="text-align: left; margin-bottom: 20px;">
        <button class="btn btn-add" onclick="addGroup()">➕ إضافة مجموعة اختيارية جديدة</button>
    </div>

    <!-- التقسيم الجديد: المحتوى في اليمين والمستشار ينبثق في اليسار -->
    <div class="main-layout">
        <div class="content-area" id="groupsContainer"></div>
        <div class="advisor-area" id="advisorContainer">
            <div class="advisor-title">💡 المستشار الأكاديمي المصيري</div>
            <div class="advisor-msg" id="advisorMessage"></div>
        </div>
    </div>

    <button class="btn btn-calc" onclick="calculateSemesterGPA()">🧮 احسب المعدل الفصلي العام</button>

    <div class="result-box" id="finalResult">
        المعدل الفصلي العام المتوقع: --
    </div>
</div>

<script>
    let groupCount = 0;

    function addGroup() {
        groupCount++;
        const container = document.getElementById('groupsContainer');
        const groupHtml = `
            <div class="group-box" id="group_${groupCount}">
                <div class="group-header">
                    <input type="text" class="group-title-input" value="المجموعة الاختيارية ${groupCount}">
                    <button class="btn btn-danger" onclick="removeElement('group_${groupCount}')">حذف المجموعة ❌</button>
                </div>
                <button class="btn btn-add" style="font-size:0.85rem;" onclick="addSubject(${groupCount})">➕ إضافة مادة اختيارية</button>
                <table>
                    <thead>
                        <tr>
                            <th>أسماء مواد اختيارية</th>
                            <th>المعامل (اختياري)</th>
                            <th>نقطة الامتحان</th>
                            <th>نقطة الـ td (فارغ للمسح)</th>
                            <th>إجراء</th>
                        </tr>
                    </thead>
                    <tbody id="subject_body_${groupCount}">
                    </tbody>
                </table>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', groupHtml);
        
        if(groupCount === 1) {
            addSubjectWithValues(groupCount, "علم القياس", 1, 10, "");
            addSubjectWithValues(groupCount, "التكنولوجيا الأساسية", 1, 14, "");
        } else {
            addSubject(groupCount);
        }
    }

    function addSubject(groupId) {
        const tbody = document.getElementById(`subject_body_${groupId}`);
        const rowId = `row_${groupId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const rowHtml = `
            <tr id="${rowId}">
                <td><input type="text" placeholder="اسم المادة" class="sub-name"></td>
                <td><input type="number" class="coeff" step="0.5" min="1" placeholder="1" value="1"></td>
                <td><input type="number" class="exam" step="0.01" min="0" max="20" placeholder="0-20"></td>
                <td><input type="number" class="td-mark" step="0.01" min="0" max="20" placeholder="اتركه خالياً إن لم يُكتب"></td>
                <td><button class="btn btn-danger" style="padding:3px 8px;" onclick="removeElement('${rowId}')">حذف</button></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHtml);
    }

    function addSubjectWithValues(groupId, name, coeff, exam, td) {
        const tbody = document.getElementById(`subject_body_${groupId}`);
        const rowId = `row_${groupId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const rowHtml = `
            <tr id="${rowId}">
                <td><input type="text" value="${name}" placeholder="اسم المادة" class="sub-name"></td>
                <td><input type="number" class="coeff" step="0.5" min="1" value="${coeff}"></td>
                <td><input type="number" class="exam" step="0.01" min="0" max="20" value="${exam}"></td>
                <td><input type="number" class="td-mark" step="0.01" min="0" max="20" value="${td}" placeholder="اتركه خالياً إن لم يُكتب"></td>
                <td><button class="btn btn-danger" style="padding:3px 8px;" onclick="removeElement('${rowId}')">حذف</button></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHtml);
    }

    function removeElement(id) {
        document.getElementById(id).remove();
    }

    function calculateSemesterGPA() {
        const groupBoxes = document.querySelectorAll('.group-box');
        let totalSemesterPoints = 0;
        let totalSemesterCoefficients = 0;

        // متغيرات لتتبع الخانات الفارغة من أجل المستشار الذكي
        let emptyExamsCount = 0;
        let targetRow = null; 
        let pointsWithoutTarget = 0;

        groupBoxes.forEach(box => {
            const rows = box.querySelectorAll('tbody tr');
            rows.forEach(row => {
                let coeff = parseFloat(row.querySelector('.coeff').value) || 1;
                let examInput = row.querySelector('.exam').value;
                let tdInput = row.querySelector('.td-mark').value;

                // التحقق من الخانات الفارغة للامتحان
                if (examInput.trim() === "") {
                    emptyExamsCount++;
                    targetRow = row; // حفظ السطر الفارغ مؤقتاً
                    return; // نتخطى حسابه الفوري لأننا سنعالجه لاحقاً
                }

                let exam = parseFloat(examInput) || 0;
                let subjectAverage = 0;

                if (tdInput.trim() === "") {
                    subjectAverage = exam;
                } else {
                    let td = parseFloat(tdInput) || 0;
                    subjectAverage = (exam * 0.6) + (td * 0.4);
                }

                totalSemesterPoints += (subjectAverage * coeff);
                totalSemesterCoefficients += coeff;
            });
        });

        // إخفاء المستشار مبدئياً لتحديث البيانات
        const advisorBox = document.getElementById('advisorContainer');
        const advisorMsg = document.getElementById('advisorMessage');
        advisorBox.style.display = "none";

        // حساب المعدل الحالي بدون المادة الفارغة
        let currentGPA = totalSemesterCoefficients > 0 ? (totalSemesterPoints / totalSemesterCoefficients) : 0;

        // تطبيق المنطق المصيري: إذا كان المعدل الحالي < 10 وهناك خانة فارغة واحدة بالضبط
        if (currentGPA < 10 && emptyExamsCount === 1 && targetRow !== null) {
            let targetCoeff = parseFloat(targetRow.querySelector('.coeff').value) || 1;
            let targetTdInput = targetRow.querySelector('.td-mark').value;
            let targetSubName = targetRow.querySelector('.sub-name').value || "المادة المتبقية";

            let newTotalCoeff = totalSemesterCoefficients + targetCoeff;
            // النقاط الإجمالية المطلوبة للوصول لمعدل 10 تماماً
            let requiredTotalPoints = 10 * newTotalCoeff;
            // النقاط المطلوبة من المادة الفارغة وحدها
            let requiredSubjectPoints = requiredTotalPoints - totalSemesterPoints;
            // معدل المادة المطلوب تحقيقه
            let requiredSubjectAverage = requiredSubjectPoints / targetCoeff;

            let requiredExamMark = 0;

            // حساب علامة الامتحان المطلوبة بناءً على وجود الـ TD أو غيابه
            if (targetTdInput.trim() === "") {
                requiredExamMark = requiredSubjectAverage;
            } else {
                let targetTd = parseFloat(targetTdInput) || 0;
                requiredExamMark = (requiredSubjectAverage - (targetTd * 0.4)) / 0.6;
            }

            // إظهار المستشار فقط في الحالات التي طلبتها
            if (requiredExamMark <= 20) {
                // إذا كانت النقطة المطلوبة ممكنة ومحشورة بين 0 و 20
                let finalMarkToShow = requiredExamMark < 0 ? 0 : requiredExamMark.toFixed(2);
                advisorBox.style.display = "block";
                advisorMsg.innerHTML = `في مادة <b style="color:var(--accent);">${targetSubName}</b>: يجب التحصل على <b style="color:var(--success); font-size:1.1rem;">(${finalMarkToShow})</b> في الامتحان حتى تتحصل على معدل مقبول.`;
            } else {
                // إذا كانت النقطة المطلوبة أكبر من 20 (أي مستحيلة)
                advisorBox.style.display = "block";
                advisorMsg.innerHTML = `<span class="advisor-alert">حتى نقطة 20 لن تساعدك للنجاح في مادة (${targetSubName}) لرفع المعدل الفصلي إلى 10.</span>`;
            }

            // دمج المادة الفارغة في الحساب الإجمالي الافتراضي (باعتبارها 0 حالياً) لكي لا يفسد حساب المعدل العام
            totalSemesterCoefficients = newTotalCoeff;
            if (targetTdInput.trim() !== "") {
                let targetTd = parseFloat(targetTdInput) || 0;
                totalSemesterPoints += ((targetTd * 0.4) * targetCoeff);
            }
        } else if (emptyExamsCount > 0 && targetRow !== null) {
            // معالجة حساب المعدل الإجمالي في حال وجود خانات فارغة لكي لا يتوقف الحساب العادي للكود السابق
            groupBoxes.forEach(box => {
                const rows = box.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    if (row.querySelector('.exam').value.trim() === "") {
                        let coeff = parseFloat(row.querySelector('.coeff').value) || 1;
                        let tdInput = row.querySelector('.td-mark').value;
                        totalSemesterCoefficients += coeff;
                        if (tdInput.trim() !== "") {
                            let td = parseFloat(tdInput) || 0;
                            totalSemesterPoints += ((td * 0.4) * coeff);
                        }
                    }
                });
            });
        }

        // عرض النتيجة النهائية للمعدل الفصلي العام بـ 3 أرقام بعد الفاصلة
        const finalResultBox = document.getElementById('finalResult');
        if (totalSemesterCoefficients > 0) {
            let finalGPA = totalSemesterPoints / totalSemesterCoefficients;
            finalResultBox.innerText = "المعدل الفصلي العام المتوقع: " + finalGPA.toFixed(3) + " من 20";
        } else {
            finalResultBox.innerText = "يرجى إضافة مجموعات ومواد أولاً وكتابة الدرجات ليتم الحساب!";
        }
    }

    window.onload = function() {
        addGroup();
    };
</script>

</body>
</html>

