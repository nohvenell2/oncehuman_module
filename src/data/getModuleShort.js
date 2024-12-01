const fs = require('fs');
const path = require('path');

try {
    // 원본 데이터 읽기
    const rawData = fs.readFileSync(path.join(process.cwd(), 'src/data/module_raw.json'), 'utf8');
    const modules = JSON.parse(rawData);

    // equip_type별로 모듈 정보 분류
    const modulesByType = modules.reduce((acc, module) => {
        const equipType = module.equip_type;
        
        if (!acc[equipType]) {
            acc[equipType] = [];
        }

        acc[equipType].push({
            name: module.name.ko,
            effect: module.core_effect.ko,
            grade: module.grade,
            features: module.features
        });

        return acc;
    }, {});

    // 결과를 JSON 파일로 저장
    fs.writeFileSync(
        path.join(process.cwd(), 'src/data/moduleNames.json'),
        JSON.stringify(modulesByType, null, 2),
        'utf8'
    );

    console.log('모듈 정보 추출 완료!');
} catch (error) {
    console.error('에러 발생:', error);
}