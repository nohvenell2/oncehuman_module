import moduleRaw from '@/data/module_raw.json';

// 기본 타입 정의
export type ModuleGrade = '2' | '4';
export type ModuleDifficulty = '노멀' | '하드' | '마스터';
export type ModuleEquipType = '무기' | '방어구 범용' | '헬멧' | '마스크' | '상의' | '하의' | '장갑' | '신발';

// Raw 데이터 타입 정의
interface ModuleRawData {
    name: {
        ko: string;
        en: string;
    };
    equip_type: ModuleEquipType;
    features: string[] | null;
    keywords: string[] | null;
    core_effect: {
        ko: string;
        en: string;
    };
    grade: ModuleGrade;
    from: {
        method: string;
        difficulty: ModuleDifficulty[] | null;
    }[];
    image?: string;
}

// Info 타입은 Raw 타입과 동일
export type ModuleInfo = ModuleRawData;

// 데이터 export
export const moduleData = moduleRaw as ModuleInfo[];

/**
 * 특정 장착 위치의 모든 모듈 가져오기
 */
export const getModulesByEquipType = (equipType: ModuleEquipType): ModuleInfo[] => {
    return (moduleRaw as ModuleInfo[]).filter(module => module.equip_type === equipType);
};

/**
 * 특정 등급의 모든 모듈 가져오기
 */
export const getModulesByGrade = (grade: ModuleGrade): ModuleInfo[] => {
    return (moduleRaw as ModuleInfo[]).filter(module => module.grade === grade);
};

/**
 * 특정 특성을 가진 모든 모듈 가져오기
 */
export const getModulesByFeature = (feature: string): ModuleInfo[] => {
    return (moduleRaw as ModuleInfo[]).filter(module => module.features?.includes(feature));
};

/**
 * 특정 키워드를 가진 모든 모듈 가져오기
 */
export const getModulesByKeyword = (keyword: string): ModuleInfo[] => {
    return (moduleRaw as ModuleInfo[]).filter(module => module.keywords?.includes(keyword));
};

/**
 * 특정 획득 방법으로 얻을 수 있는 모든 모듈 가져오기
 */
export const getModulesBySource = (source: string, difficulty?: ModuleDifficulty): ModuleInfo[] => {
    return (moduleRaw as ModuleInfo[]).filter(module => 
        module.from.some(from => 
            from.method === source && 
            (!difficulty || from.difficulty?.includes(difficulty))
        )
    );
};

export default moduleData; 