export type Grade = 'grey' | 'green' | 'blue' | 'purple' | 'yellow';

export type ModuleOption = {
    type: 'criticalDamage' | 'bossDamage' | 'eliteDamage' | 'normalDamage' | 'weaponDamage' | 'weakPointDamage' | 'elementalDamage' | 'extraMagazine' | 'transDamage';
    grade: Grade;
    value: number;
};

export interface Item {
    name: string;
    moduleName: string;
    moduleOptions: ModuleOption[];
    type: '무기' | '헬멧' | '마스크' | '상의' | '장갑' | '하의' | '신발';
}

export type Equipment = {
    mainWeapon: Item;
    subWeapon: Item;
    helmet: Item;
    mask: Item;
    top: Item;
    gloves: Item;
    bottom: Item;
    shoes: Item;
};

export type EquipmentSet = {
    id: string;
    title: string;
    equipment: Equipment;
    createdAt: number;
};