'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { Equipment, EquipmentSet } from '@/types/item';
import ItemSlot from '@/components/ItemSlot';
import { EQUIPMENT_SLOTS } from '@/constants/items';

/**
 * OnceHuman 게임의 아이템 세팅 페이지
 */
export default function Home() {
    const [equipmentSets, setEquipmentSets] = useState<EquipmentSet[]>([]);
    const [currentSet, setCurrentSet] = useState<EquipmentSet | null>(null);
    const [newSetTitle, setNewSetTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // 저장된 세트들 로드
    useEffect(() => {
        const savedSets = localStorage.getItem('equipmentSets');
        const parsedSets = savedSets ? JSON.parse(savedSets) : [];
        setEquipmentSets(parsedSets);
        if (parsedSets.length > 0) {
            setCurrentSet(parsedSets[0]);
        }
        setIsLoading(false);
    }, []);

    // 세트들 저장
    useEffect(() => {
        if (equipmentSets && equipmentSets.length > 0) {
            localStorage.setItem('equipmentSets', JSON.stringify(equipmentSets));
        }
    }, [equipmentSets]);

    if (isLoading) {
        return null; // 또는 로딩 인디케이터
    }

    const createNewSet = () => {
        if (!newSetTitle.trim() || !equipmentSets) return;
        
        const newSet: EquipmentSet = {
            id: Date.now().toString(),
            title: newSetTitle,
            equipment: getInitialEquipment(),
            createdAt: Date.now()
        };

        setEquipmentSets([...equipmentSets, newSet]);
        setCurrentSet(newSet);
        setNewSetTitle('');
    };

    const deleteSet = (id: string) => {
        if (!equipmentSets) return;
        
        const updatedSets = equipmentSets.filter(set => set.id !== id);
        setEquipmentSets(updatedSets);
        if (currentSet?.id === id) {
            setCurrentSet(updatedSets[0] || null);
        }
    };

    const updateCurrentSet = (equipment: Equipment) => {
        if (!currentSet || !equipmentSets) return;

        const updatedSet = { ...currentSet, equipment };
        setCurrentSet(updatedSet);
        setEquipmentSets(
            equipmentSets.map(set => set.id === currentSet.id ? updatedSet : set)
        );
    };

    if (equipmentSets.length === 0) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>OnceHuman 아이템 세팅</h1>
                <div className={styles.newSetForm}>
                    <input
                        type="text"
                        value={newSetTitle}
                        onChange={(e) => setNewSetTitle(e.target.value)}
                        placeholder="새로운 세트 이름 입력"
                        className={styles.input}
                    />
                    <button onClick={createNewSet} className={styles.button}>
                        새 세트 만들기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>OnceHuman 아이템 세팅</h1>
            
            <div className={styles.setControls}>
                <select 
                    value={currentSet?.id} 
                    onChange={(e) => {
                        const selected = equipmentSets.find(set => set.id === e.target.value);
                        if (selected) setCurrentSet(selected);
                    }}
                    className={styles.setSelect}
                >
                    {equipmentSets.map(set => (
                        <option key={set.id} value={set.id}>
                            {set.title}
                        </option>
                    ))}
                </select>
                <div className={styles.newSetForm}>
                    <input
                        type="text"
                        value={newSetTitle}
                        onChange={(e) => setNewSetTitle(e.target.value)}
                        placeholder="새로운 세트 이름 입력"
                        className={styles.input}
                    />
                    <button onClick={createNewSet} className={styles.button}>
                        새 세트 만들기
                    </button>
                </div>
                {currentSet && (
                    <button 
                        onClick={() => deleteSet(currentSet.id)}
                        className={styles.deleteButton}
                    >
                        현재 세트 삭제
                    </button>
                )}
            </div>

            {currentSet && (
                <>
                    <div className={styles.equipmentSection}>
                        <h2>무기</h2>
                        <div className={`${styles.equipmentGrid} ${styles.weapons}`}>
                            {['mainWeapon', 'subWeapon'].map((slot) => (
                                <ItemSlot
                                    key={slot}
                                    label={EQUIPMENT_SLOTS[slot as keyof Equipment]}
                                    item={currentSet.equipment[slot as keyof Equipment]}
                                    onChange={(updatedItem) => {
                                        updateCurrentSet({
                                            ...currentSet.equipment,
                                            [slot]: updatedItem
                                        });
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.equipmentSection}>
                        <h2>방어구</h2>
                        <div className={styles.armorGrid}>
                            {['helmet', 'mask', 'top', 'gloves', 'bottom', 'shoes'].map((slot) => (
                                <ItemSlot
                                    key={slot}
                                    label={EQUIPMENT_SLOTS[slot as keyof Equipment]}
                                    item={currentSet.equipment[slot as keyof Equipment]}
                                    onChange={(updatedItem) => {
                                        updateCurrentSet({
                                            ...currentSet.equipment,
                                            [slot]: updatedItem
                                        });
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * 장비 세트의 초기 상태를 생성합니다
 * @returns {Equipment} 빈 장비 세트 객체
 */
function getInitialEquipment(): Equipment {
    return {
        mainWeapon: { name: '', moduleName: '', moduleOptions: [] },
        subWeapon: { name: '', moduleName: '', moduleOptions: [] },
        helmet: { name: '', moduleName: '', moduleOptions: [] },
        mask: { name: '', moduleName: '', moduleOptions: [] },
        top: { name: '', moduleName: '', moduleOptions: [] },
        gloves: { name: '', moduleName: '', moduleOptions: [] },
        bottom: { name: '', moduleName: '', moduleOptions: [] },
        shoes: { name: '', moduleName: '', moduleOptions: [] }
    };
}
