import weaponRaw from '@/data/weapon_raw.json';
import armorRaw from '@/data/armor_raw.json';

// 기본 타입 정의
export type ItemGrade = '1' | '2' | '3' | '4';
export type WeaponCategory = '권총' | '산탄총' | '기관단총' | '소총' | '저격소총' | '경기관총' | '석궁' | '대형 화기' | '근접';
export type ArmorCategory = '헬멧' | '마스크' | '상의' | '하의' | '장갑' | '신발';
export type BlueprintStyle = '메타 휴먼' | '워리어' | '헌터' | '방랑자' | '오퍼레이터' | '이방인';

// Raw 데이터 타입 정의
interface WeaponRawData {
    image: string;
    ko: {
        category: WeaponCategory;
        subcategory: string | null;
        name: string;
    };
    en: {
        category: string;
        subcategory: string | null;
        name: string;
    };
    grade: ItemGrade;
    craft: {
        [level: string]: {
            damage: string;
            fireRate: string;
            magazine: string;
            critRate: string;
            weakDMG: string;
            critDMG: string;
        };
    };
    keywords: string[] | null;
    specialType: string | null;
    damageType: string | null;
    style: BlueprintStyle;
    description: string[] | null;
}

interface ArmorRawData {
    image: string;
    ko: {
        category: ArmorCategory;
        name: string;
    };
    en: {
        category: string;
        name: string;
    };
    grade: ItemGrade;
    craft: {
        [level: string]: {
            hp: string;
            res: string;
            psi: string;
        };
    };
    type: 'set' | 'key';
    set: string | null;
    specialType: string | null;
    style: BlueprintStyle;
    description: string[] | null;
}

// Info 타입은 Raw 타입과 동일
export type WeaponInfo = WeaponRawData;
export type ArmorInfo = ArmorRawData;

// 데이터 export
export const weaponData = weaponRaw as WeaponInfo[];
export const armorData = armorRaw as ArmorInfo[];

/**
 * 특정 카테고리의 무기 가져오기
 */
export const getWeaponsByCategory = (category: WeaponCategory): WeaponInfo[] => {
    return (weaponRaw as WeaponInfo[]).filter(weapon => weapon.ko.category === category);
};

/**
 * 특정 카테고리의 방어구 가져오기
 */
export const getArmorsByCategory = (category: ArmorCategory): ArmorInfo[] => {
    return (armorRaw as ArmorInfo[]).filter(armor => armor.ko.category === category);
};

/**
 * 특정 등급의 무기 가져오기
 */
export const getWeaponsByGrade = (grade: ItemGrade): WeaponInfo[] => {
    return (weaponRaw as WeaponInfo[]).filter(weapon => weapon.grade === grade);
};

/**
 * 특정 등급의 방어구 가져오기
 */
export const getArmorsByGrade = (grade: ItemGrade): ArmorInfo[] => {
    return (armorRaw as ArmorInfo[]).filter(armor => armor.grade === grade);
};

/**
 * 특정 블루프린트의 무기 가져오기
 */
export const getWeaponsByBlueprint = (blueprint: BlueprintStyle): WeaponInfo[] => {
    return (weaponRaw as WeaponInfo[]).filter(weapon => weapon.style === blueprint);
};

/**
 * 특정 블루프린트의 방어구 가져오기
 */
export const getArmorsByBlueprint = (blueprint: BlueprintStyle): ArmorInfo[] => {
    return (armorRaw as ArmorInfo[]).filter(armor => armor.style === blueprint);
};

/**
 * 특정 특수 타입의 무기 가져오기
 */
export const getWeaponsBySpecialType = (specialType: string): WeaponInfo[] => {
    return (weaponRaw as WeaponInfo[]).filter(weapon => weapon.specialType === specialType);
};

/**
 * 특정 특수 타입의 방어구 가져오기
 */
export const getArmorsBySpecialType = (specialType: string): ArmorInfo[] => {
    return (armorRaw as ArmorInfo[]).filter(armor => armor.specialType === specialType);
};

/**
 * 특정 키워드를 가진 무기 가져오기
 */
export const getWeaponsByKeyword = (keyword: string): WeaponInfo[] => {
    return (weaponRaw as WeaponInfo[]).filter(weapon => weapon.keywords?.includes(keyword));
};

/**
 * 특정 세트의 방어구 가져오기
 */
export const getArmorsBySet = (setName: string): ArmorInfo[] => {
    return (armorRaw as ArmorInfo[]).filter(armor => armor.set === setName);
};

export default {
    weaponData,
    armorData
}; 