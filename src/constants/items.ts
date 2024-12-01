export const EQUIPMENT_SLOTS = {
    mainWeapon: '⚔ 주무장',
    subWeapon: '⚔ 부무장',
    helmet: '⛑️ 헬멧',
    mask: '🎭 마스크',
    top: '🥋 상의',
    gloves: '🧤 장갑',
    bottom: '👖 하의',
    shoes: '🥾 신발'
} as const;

export const MODULE_OPTIONS = {
    criticalDamage: '치명타 피해',
    weakPointDamage: '약점 피해',
    elementalDamage: '원소 피해',
    weaponDamage: '총기 피해',
    bossDamage: '상위자 피해',
    eliteDamage: '정예 피해',
    normalDamage: '일반 피해',
    extraMagazine: '추가 탄창',
    transDamage: '트랜스 피해'
} as const;

export const GRADES = {
    grey: '회색',
    green: '초록',
    blue: '파랑',
    purple: '보라',
    yellow: '노랑'
} as const;

export const MODULE_VALUES = {
    weakPointDamage: {
        grey: 1.8,
        green: 3.6,
        blue: 5.4,
        purple: 7.2,
        yellow: 9.0
    },
    bossDamage: {
        grey: 1.2,
        green: 2.4,
        blue: 3.6,
        purple: 4.8,
        yellow: 6.0
    },
    weaponDamage: {
        grey: 1.2,
        green: 2.4,
        blue: 3.6,
        purple: 4.8,
        yellow: 6.0
    },
    extraMagazine: {
        grey: 2.4,
        green: 4.8,
        blue: 7.2,
        purple: 9.6,
        yellow: 12.0
    },
    eliteDamage: {
        grey: 1.5,
        green: 3.0,
        blue: 4.5,
        purple: 6.0,
        yellow: 7.5
    },
    criticalDamage: {
        grey: 3.0,
        green: 6.0,
        blue: 9.0,
        purple: 12.0,
        yellow: 15.0
    },
    elementalDamage: {
        grey: 1.6,
        green: 3.2,
        blue: 4.8,
        purple: 6.4,
        yellow: 8.0
    },
    normalDamage: {
        grey: 2.0,
        green: 4.0,
        blue: 6.0,
        purple: 8.0,
        yellow: 10.0
    },
    transDamage: {
        grey: 1.2,
        green: 2.4,
        blue: 3.6,
        purple: 4.8,
        yellow: 6.0
    }
} as const; 