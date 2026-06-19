<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حاسبة المعدل الجامعي الذكية - نظام LMD</title>
    <style>
        :root { --primary: #2c3e50; --accent: #3498db; --success: #2ecc71; --light: #f5f7fa; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: var(--light); color: #333; padding: 20px; direction: rtl; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        h1 { text-align: center; color: var(--primary); margin-bottom: 5px; }
        .subtitle { text-align: center; color: #7f8c8d; margin-bottom: 20px; font-weight: bold; }
        .btn { padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s; margin: 5px; }
        .btn-add { background: var(--accent); color: white; }
        .btn-calc { background: var(--success); color: white; width: 100%; font-size: 1.2rem; padding: 12px; margin-top: 20px; border-radius: 8px; }
        .btn-danger { background: #e74c3c; color: white; padding: 5px 10px; font-size: 0.85rem; }
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

    <!-- هنا سيتم عرض المجموعات والجداول تلقائياً -->
    <div id="groupsContainer"></div>

    <button class="btn btn-calc" onclick="calculateSemesterGPA()">🧮 احسب المعدل الفصلي العام</button>

    <div class="result-box" id="finalResult">
        المعدل الفصلي العام المتوقع: --
    </div>
</div>

<script>
    let groupCount = 0;

    // 1. دالة إنشاء مجموعة جديدة ديناميكياً مع عدد مواد واختيارات مرنة
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
        
        // عند فتح المجموعة لأول مرة، نضع مادتين افتراضيتين كتجربة (التسجيل الأول)
        if(groupCount === 1) {
            addSubjectWithValues(groupCount, "علم القياس", 1, 10, "");
            addSubjectWithValues(groupCount, "التكنولوجيا الأساسية", 1, 14, "");
        } else {
            addSubject(groupCount); // للمجموعات الجديدة اللاحقة مادة فارغة
        }
    }

    // 2. دالة إضافة مادة فارغة يقوم المستخدم بتسميتها وتحديد معاملها
    function addSubject(groupId) {
        const tbody = document.getElementById(`subject_body_${groupId}`);
        const rowId = `row_${groupId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const rowHtml = `
            <tr id="${rowId}">
                <td><input type="text" placeholder="اسم المادة"></td>
                <td><input type="number" class="coeff" step="0.5" min="1" placeholder="1" value="1"></td>
                <td><input type="number" class="exam" step="0.01" min="0" max="20" placeholder="0-20"></td>
                <td><input type="number" class="td-mark" step="0.01" min="0" max="20" placeholder="اتركه خالياً إن لم يُكتب"></td>
                <td><button class="btn btn-danger" style="padding:3px 8px;" onclick="removeElement('${rowId}')">حذف</button></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHtml);
    }

    // دالة مساعدة لملء بيانات التسجيل الأول الافتراضية المذكورة في الكود السابق
    function addSubjectWithValues(groupId, name, coeff, exam, td) {
        const tbody = document.getElementById(`subject_body_${groupId}`);
        const rowId = `row_${groupId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const rowHtml = `
            <tr id="${rowId}">
                <td><input type="text" value="${name}" placeholder="اسم المادة"></td>
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

    // 3. خوارزمية الحساب الذكية التي طلبتها لتعمل بدون أخطاء تقنية ومعالجة خانة الـ td الفارغة
    function calculateSemesterGPA() {
        const groupBoxes = document.querySelectorAll('.group-box');
        let totalSemesterPoints = 0;
        let totalSemesterCoefficients = 0;

        groupBoxes.forEach(box => {
            const rows = box.querySelectorAll('tbody tr');
            let totalGroupPoints = 0;
            let totalGroupCoefficients = 0;

            rows.forEach(row => {
                let coeff = parseFloat(row.querySelector('.coeff').value);
                let exam = parseFloat(row.querySelector('.exam').value);
                let tdInput = row.querySelector('.td-mark').value;

                // إذا تُرك المعامل فارغاً نعتبره 0 أو 1 لتفادي المشاكل
                if (isNaN(coeff)) coeff = 1;
                // إذا لم يتم إدخال نقطة الامتحان، تُعتبر 0 كقيمة افتراضية للحساب
                if (isNaN(exam)) exam = 0; 

                let subjectAverage = 0;

                // القاعدة الذكية المطلوبة: إذا تُركت خانة الـ td خالية ولم يُكتب فيها شيء، نتركها ولا نعتبرها 0، بل يصبح معدل المادة هو نقطة الامتحان مباشرة
                if (tdInput.trim() === "") {
                    subjectAverage = exam;
                } else {
                    // إذا كتبها وجعلها موجودة يتم الحساب الموزون (60% امتحان و 40% td) ويمكن مسحها وتعديلها
                    let td = parseFloat(tdInput);
                    if (isNaN(td)) td = 0;
                    subjectAverage = (exam * 0.6) + (td * 0.4);
                }

                // إضافة نقاط المادة إلى إجمالي المجموعة
                totalGroupPoints += (subjectAverage * coeff);
                totalGroupCoefficients += coeff;
            });

            // حساب المجموعات بشكل تراكمي للمعدل العام الفصلي
            if (totalGroupCoefficients > 0) {
                let groupAverage = totalGroupPoints / totalGroupCoefficients;
                totalSemesterPoints += (groupAverage * totalGroupCoefficients);
                totalSemesterCoefficients += totalGroupCoefficients;
            }
        });

        const finalResultBox = document.getElementById('finalResult');
        if (totalSemesterCoefficients > 0) {
            let finalGPA = totalSemesterPoints / totalSemesterCoefficients;
            // إظهار المعدل الفصلي العام بـ 3 أرقام بعد الفاصلة لضمان الدقة العالية
            finalResultBox.innerText = "المعدل الفصلي العام المتوقع: " + finalGPA.toFixed(3) + " من 20";
        } else {
            finalResultBox.innerText = "يرجى إضافة مجموعات ومواد أولاً وكتابة الدرجات ليتم الحساب!";
        }
    }

    // تشغيل الخوارزمية لإنشاء المجموعة الأولى التلقائية فور فتح الموقع
    window.onload = function() {
        addGroup();
    };
</script>

</body>
</html>
