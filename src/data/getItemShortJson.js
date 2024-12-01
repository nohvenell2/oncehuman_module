const fs = require('fs');
const path = require('path');

try {
    // 원본 데이터 읽기
    const rawData = fs.readFileSync(path.join(process.cwd(), 'src/data/armor_raw.json'), 'utf8');
    const weapons = JSON.parse(rawData);

    // grade가 3 이상인 무기들을 카테고리별로 분류
    const weaponsByCategory = weapons
        .filter(weapon => parseInt(weapon.grade) >= 3)
        .reduce((acc, weapon) => {
            const category = weapon.ko.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(weapon.ko.name);
            return acc;
        }, {});

    // 결과를 JSON 파일로 저장
    fs.writeFileSync(
        path.join(process.cwd(), 'src/data/armorNames.json'),
        JSON.stringify(weaponsByCategory, null, 2),
        'utf8'
    );

    console.log('무기 이름 추출 완료!');
} catch (error) {
    console.error('에러 발생:', error);
}