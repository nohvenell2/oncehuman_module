'use client';

import { useState, useMemo, useRef } from 'react';
import { Item, ModuleOption } from '@/types/item';
import styles from './ItemSlot.module.scss';
import ModuleOptions from './ModuleOptions';
import { 
    WeaponInfo, 
    ArmorInfo, 
    getArmorsByCategory,
    ArmorCategory,
    weaponData
} from '@/constants/itemInfo';

interface ItemSlotProps {
    label: string;
    item: Item;
    onChange: (item: Item) => void;
}

export default function ItemSlot({ label, item, onChange }: ItemSlotProps) {
    const [searchTerm, setSearchTerm] = useState(item.name);
    const [isComboboxOpen, setIsComboboxOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 슬롯 타입에 따른 아이템 목록 가져오기
    const itemList = useMemo(() => {
        if (label.includes('무장')) {
            return weaponData;
        }
        // 방어구 카테고리 판별
        const category = label.replace(/[⛑️🎭🥋🧤👖🥾\s]/g, '') as ArmorCategory;
        return getArmorsByCategory(category);
    }, [label]);

    // 검색어에 따른 필터링
    const getFilteredItems = () => {
        const searchLower = searchTerm.toLowerCase();
        return itemList.filter(item => 
            item.ko.name.toLowerCase().includes(searchLower)
        );
    };

    const handleItemSelect = (selectedItem: WeaponInfo | ArmorInfo) => {
        handleChange('name', selectedItem.ko.name);
        setIsComboboxOpen(false);
        setSearchTerm(selectedItem.ko.name);
    };

    const handleChange = (field: keyof Item, value: string | ModuleOption[]) => {
        onChange({
            ...item,
            [field]: value
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && getFilteredItems().length > 0) {
            e.preventDefault();
            handleItemSelect(getFilteredItems()[0]);
            setIsComboboxOpen(false);
        } else if (e.key === 'Escape') {
            setIsComboboxOpen(false);
        }
    };

    const handleBlur = (e: React.FocusEvent) => {
        requestAnimationFrame(() => {
            if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
                setIsComboboxOpen(false);
            }
        });
    };

    return (
        <div className={styles.itemSlot}>
            <div ref={dropdownRef}>
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
                            onBlur={handleBlur}
                            placeholder="아이템 이름 검색..."
                            className={styles.comboboxInput}
                        />
                        {isComboboxOpen && getFilteredItems().length > 0 && (
                            <ul className={styles.optionsList}>
                                {getFilteredItems().map((item) => (
                                    <li
                                        key={item.ko.name}
                                        onClick={() => handleItemSelect(item)}
                                        className={styles.optionItem}
                                        tabIndex={0}
                                    >
                                        {'subcategory' in item.ko ? (
                                            <div className={styles.weaponItem}>
                                                <span className={styles.weaponName}>{item.ko.name}</span>
                                                <span className={styles.weaponCategory}>
                                                    {`[${item.ko.subcategory || item.ko.category}]`}
                                                </span>
                                            </div>
                                        ) : (
                                            item.ko.name
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
        </div>
    );
}