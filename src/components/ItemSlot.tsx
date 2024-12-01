'use client';

import { useState, useMemo, useEffect } from 'react';
import { Item, ModuleOption } from '@/types/item';
import styles from './ItemSlot.module.scss';
import ModuleOptions from './ModuleOptions';
import weaponNames from '@/data/weaponNames.json';
import armorNames from '@/data/armorNames.json';

interface ItemSlotProps {
    label: string;
    item: Item;
    onChange: (item: Item) => void;
}

export default function ItemSlot({ label, item, onChange }: ItemSlotProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState(item.name);
    const [isComboboxOpen, setIsComboboxOpen] = useState(false);
    const [blurTimeoutId, setBlurTimeoutId] = useState<NodeJS.Timeout | null>(null);

    // 슬롯 타입에 따른 아이템 목록 가져오기
    const itemList = useMemo(() => {
        if (label.includes('무장')) {
            // 각 무기에 카테고리 정보 추가
            return Object.entries(weaponNames).flatMap(([category, names]) => 
                names.map(name => ({
                    name,
                    category
                }))
            );
        }
        // 방어구는 기존대로 문자열 배열
        const category = label.replace(/[⛑️🎭🥋🧤👖🥾\s]/g, '');
        return armorNames[category] || [];
    }, [label]);

    // 검색어에 따른 필터링
    const filteredItems = useMemo(() => {
        if (typeof itemList[0] === 'string') {
            // 방어구의 경우 (문자열 배열)
            return itemList.filter(name => 
                (name as string).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        // 무기의 경우 (객체 배열)
        return itemList.filter(item => 
            (item as {name: string, category: string}).name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [itemList, searchTerm]);

    const handleItemSelect = (item: string | { name: string, category: string }) => {
        const name = typeof item === 'string' ? item : item.name;
        handleChange('name', name);
        setIsComboboxOpen(false);
        setSearchTerm(name);
    };

    const handleChange = (field: keyof Item, value: string | ModuleOption[]) => {
        onChange({
            ...item,
            [field]: value
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filteredItems.length > 0) {
            e.preventDefault();
            handleItemSelect(filteredItems[0]);
            setIsComboboxOpen(false);
        } else if (e.key === 'Escape') {
            setIsComboboxOpen(false);
        }
    };

    // cleanup effect 추가
    useEffect(() => {
        return () => {
            if (blurTimeoutId) {
                clearTimeout(blurTimeoutId);
            }
        };
    }, [blurTimeoutId]);

    return (
        <div className={styles.itemSlot}>
            <div className={styles.header}>
                <h3>{label}</h3>
                <div className={styles.comboboxContainer}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsComboboxOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsComboboxOpen(true)}
                        onBlur={() => {
                            const timeoutId = setTimeout(() => setIsComboboxOpen(false), 200);
                            setBlurTimeoutId(timeoutId);
                        }}
                        placeholder="아이템 이름 검색..."
                        className={styles.comboboxInput}
                    />
                    {isComboboxOpen && filteredItems.length > 0 && (
                        <ul className={styles.optionsList}>
                            {filteredItems.map((item) => (
                                <li
                                    key={typeof item === 'string' ? item : item.name}
                                    onClick={() => handleItemSelect(item)}
                                    className={styles.optionItem}
                                >
                                    {typeof item === 'string' ? (
                                        item
                                    ) : (
                                        <div className={styles.weaponItem}>
                                            <span className={styles.weaponName}>{item.name}</span>
                                            <span className={styles.weaponCategory}>[{item.category}]</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <ModuleOptions
                options={item.moduleOptions}
                moduleName={item.moduleName}
                onChange={(newOptions) => handleChange('moduleOptions', newOptions)}
                onModuleNameChange={(newName) => handleChange('moduleName', newName)}
                type={item.type}
            />
        </div>
    );
}